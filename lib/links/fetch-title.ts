import * as cheerio from "cheerio"

export async function fetchTitle(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) return null

    const html = await response.text()
    const $ = cheerio.load(html)

    const ogTitle = $('meta[property="og:title"]').attr("content")?.trim()

    if (ogTitle) return ogTitle

    const title = $("title").first().text().trim()

    if (title) return title

    return null
  } catch {
    return null
  }
}
