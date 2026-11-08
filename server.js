import express from "express";
import path from "node:path";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;
const FETCH_TIMEOUT_MS = 8000;

// Static client
app.use(express.static(path.join(import.meta.dirname, "public")));

function parseHttpUrl(value) {
  try {
    const u = new URL(value);
    if (u.protocol === "http:" || u.protocol === "https:") return u;
  } catch {
    /* fall through */
  }
  return null;
}

function extractTitle(html) {
  const $ = cheerio.load(html);
  const title =
    $("title").first().text().trim() ||
    $('meta[property="og:title"]').attr("content")?.trim() ||
    "";
  return title;
}

app.get("/title", async (req, res) => {
  const target = parseHttpUrl(req.query.url);
  if (!target) {
    return res.status(400).json({
      error: "Missing or invalid 'url' query parameter (http/https only)",
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(target, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TitleService/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return res
        .status(502)
        .json({ error: `Upstream responded with HTTP ${response.status}` });
    }

    const html = await response.text();
    const title = extractTitle(html);

    res.json({ url: req.query.url, title });
  } catch (err) {
    const reason =
      err.name === "AbortError" ? "Timed out" : "Failed to fetch URL";
    res.status(502).json({ error: reason });
  } finally {
    clearTimeout(timer);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
});
