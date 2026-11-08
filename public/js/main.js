let links = [];
let activeTag = null;
let editingId = null;

const $ = (id) => document.getElementById(id);
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function parseTags(str) {
  return [
    ...new Set(
      str
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}

function safeHref(url) {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : "#";
  } catch {
    return "#";
  }
}

function allTags() {
  const set = new Set();
  links.forEach((l) => l.tags.forEach((t) => set.add(t)));
  return [...set].sort();
}

function editDistance(a, b) {
  const m = a.length,
    n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[n];
}

// Short terms must match exactly; longer terms may have 1-2 typos.
// Partial words also match (e.g. "wikip" finds "wikipedia").
function fuzzyMatch(term, word) {
  const allowed = term.length <= 3 ? 0 : term.length <= 6 ? 1 : 2;
  if (editDistance(term, word) <= allowed) return true;
  if (word.length > term.length) {
    return editDistance(term, word.slice(0, term.length)) <= allowed;
  }
  return false;
}

function filteredLinks() {
  const q = $("search").value.trim().toLowerCase();
  return links
    .filter((l) => !activeTag || l.tags.includes(activeTag))
    .filter((l) => {
      if (!q) return true;
      const text = [l.title, l.url, l.notes, l.tags.join(" ")]
        .join(" ")
        .toLowerCase();
      const words = text.split(/[^a-z0-9]+/).filter(Boolean);
      return q
        .split(/\s+/)
        .filter(Boolean)
        .every(
          (term) =>
            text.includes(term) || words.some((w) => fuzzyMatch(term, w)),
        );
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

function render() {
  saveLinks();
  const tags = allTags();
  if (activeTag && !tags.includes(activeTag)) activeTag = null;

  $("tag-filters").innerHTML = tags.length
    ? tags
        .map(
          (t) =>
            `<button class="chip ${t === activeTag ? "active" : ""}" data-tag="${escapeHtml(t)}">#${escapeHtml(t)}</button>`,
        )
        .join("")
    : "";

  const list = filteredLinks();
  $("count").textContent =
    `${list.length} of ${links.length} link${links.length === 1 ? "" : "s"}`;

  if (!links.length) {
    $("links").innerHTML =
      `<div class="empty">No links yet. Click <strong>+ Add link</strong> to save your first one.</div>`;
    return;
  }
  if (!list.length) {
    $("links").innerHTML =
      `<div class="empty">No links match your search or filter.</div>`;
    return;
  }

  $("links").innerHTML = list
    .map(
      (l) => `
      <div class="link-card">
        <div class="link-top">
          <div style="min-width:0">
            <a class="link-title" href="${escapeHtml(safeHref(l.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.title || l.url)}</a>
            ${l.title ? `<div class="link-url">${escapeHtml(l.url)}</div>` : ""}
          </div>
          <div class="card-actions">
            <button class="small menu-btn" data-menu="${l.id}" aria-label="Options" aria-haspopup="true">⋯</button>
            <div class="menu hidden" data-menu-panel="${l.id}">
              <button class="small" data-edit="${l.id}">Edit</button>
              <button class="small danger" data-delete="${l.id}">Delete</button>
            </div>
          </div>
        </div>
        ${l.notes ? `<div class="link-note">${escapeHtml(l.notes)}</div>` : ""}
        ${l.tags.length ? `<div class="link-meta">${l.tags.map((t) => `<button class="tag" data-tag="${escapeHtml(t)}">#${escapeHtml(t)}</button>`).join("")}</div>` : ""}
      </div>
    `,
    )
    .join("");
}

function openForm(link = null) {
  editingId = link ? link.id : null;
  $("f-title").value = link ? link.title : "";
  $("f-url").value = link ? link.url : "";
  $("f-tags").value = link ? link.tags.join(", ") : "";
  $("f-notes").value = link ? link.notes : "";
  $("f-error").textContent = "";
  $("form-title").textContent = link ? "Edit link" : "Add link";
  $("form-panel").classList.add("open");
  $("f-title").focus();
}

function closeForm() {
  editingId = null;
  $("form-panel").classList.remove("open");
  $("link-form").reset();
}

const TITLE_SERVICE = "/title";
async function fetchTitle(url) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(`${TITLE_SERVICE}?url=${encodeURIComponent(url)}`, {
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return "";
    const data = await res.json();
    return (data.title || "").trim();
  } catch (err) {
    console.warn("Title lookup failed:", err);
    return "";
  }
}

$("link-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = $("f-title").value.trim();
  let url = $("f-url").value.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    new URL(url);
  } catch {
    $("f-error").textContent = "Please enter a valid URL.";
    return;
  }
  const finalTitle = title || (await fetchTitle(url));
  const data = {
    title: finalTitle,
    url,
    tags: parseTags($("f-tags").value),
    notes: $("f-notes").value.trim(),
  };
  if (editingId) {
    const existing = links.find((l) => l.id === editingId);
    if (existing) Object.assign(existing, data);
  } else {
    links.push({ id: uid(), createdAt: Date.now(), ...data });
  }
  closeForm();
  render();
});

$("f-cancel").addEventListener("click", closeForm);
$("form-panel").addEventListener("click", (e) => {
  if (e.target.id === "form-panel") closeForm();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("form-panel").classList.contains("open"))
    closeForm();
});
$("btn-new").addEventListener("click", () => openForm());
$("search").addEventListener("input", render);

$("links").addEventListener("click", (e) => {
  const menuBtn = e.target.closest("[data-menu]");
  if (menuBtn) {
    const panel = document.querySelector(
      `[data-menu-panel="${menuBtn.dataset.menu}"]`,
    );
    const wasOpen = !panel.classList.contains("hidden");
    closeMenus();
    if (!wasOpen) panel.classList.remove("hidden");
    return;
  }
  closeMenus();
  const edit = e.target.closest("[data-edit]");
  const del = e.target.closest("[data-delete]");
  const tag = e.target.closest("[data-tag]");
  if (edit) {
    openForm(links.find((l) => l.id === edit.dataset.edit));
  } else if (del) {
    const l = links.find((x) => x.id === del.dataset.delete);
    if (l) openConfirm(l);
  } else if (tag) {
    activeTag = activeTag === tag.dataset.tag ? null : tag.dataset.tag;
    render();
  }
});

function closeMenus() {
  document
    .querySelectorAll("[data-menu-panel]")
    .forEach((p) => p.classList.add("hidden"));
}
document.addEventListener("click", (e) => {
  if (!e.target.closest(".card-actions")) closeMenus();
});

let pendingDeleteId = null;
function openConfirm(link) {
  pendingDeleteId = link.id;
  $("confirm-text").textContent =
    `"${link.title || link.url}" will be removed. This can't be undone.`;
  $("confirm-panel").classList.add("open");
  $("confirm-cancel").focus();
}
function closeConfirm() {
  pendingDeleteId = null;
  $("confirm-panel").classList.remove("open");
}
$("confirm-cancel").addEventListener("click", closeConfirm);
$("confirm-ok").addEventListener("click", () => {
  if (pendingDeleteId) {
    links = links.filter((x) => x.id !== pendingDeleteId);
    if (editingId === pendingDeleteId) closeForm();
    closeConfirm();
    render();
  }
});
$("confirm-panel").addEventListener("click", (e) => {
  if (e.target.id === "confirm-panel") closeConfirm();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $("confirm-panel").classList.contains("open"))
    closeConfirm();
});

$("tag-filters").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-tag]");
  if (!chip) return;
  activeTag = activeTag === chip.dataset.tag ? null : chip.dataset.tag;
  render();
});

$("btn-export").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(links, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "links.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

$("btn-import").addEventListener("click", () => $("file-import").click());
$("file-import").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data)) throw new Error("Expected an array of links.");
    const cleaned = data
      .filter((l) => l && typeof l.url === "string")
      .map((l) => ({
        id: l.id || uid(),
        title: String(l.title || ""),
        url: String(l.url),
        tags: Array.isArray(l.tags)
          ? l.tags.map((t) => String(t).toLowerCase())
          : [],
        notes: String(l.notes || ""),
        createdAt: Number(l.createdAt) || Date.now(),
      }));
    links = [...links, ...cleaned];
    render();
  } catch (err) {
    alert("Import failed: " + err.message);
  }
  e.target.value = "";
});

const DB_NAME = "linksdb";
const STORE = "links";
let dbPromise = null;
let loaded = false;

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 2);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE))
          db.createObjectStore(STORE, { keyPath: "id" });
        if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

async function loadLinks() {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Could not load links:", err);
    return null;
  }
}

async function saveLinks() {
  if (!loaded) return;
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      const store = tx.objectStore(STORE);
      store.clear();
      links.forEach((l) => store.put(l));
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Could not save links:", err);
  }
}

const EXPORT_HOUR = 20; // 8pm local time
let exporting = false;

function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function getMeta(key) {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const req = db
        .transaction("meta", "readonly")
        .objectStore("meta")
        .get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Could not read meta:", err);
    return null;
  }
}

async function setMeta(key, value) {
  try {
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction("meta", "readwrite");
      tx.objectStore("meta").put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error("Could not write meta:", err);
  }
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function maybeExport() {
  if (!loaded || exporting) return;
  exporting = true;
  try {
    const now = new Date();
    const today = localDateKey(now);
    const lastExport = await getMeta("lastExportDate");
    if (now.getHours() >= EXPORT_HOUR && lastExport !== today) {
      downloadJSON(links, `links-${today}.json`);
      await setMeta("lastExportDate", today);
    }
  } finally {
    exporting = false;
  }
}

(async () => {
  const saved = await loadLinks();
  if (saved) {
    links = saved;
    loaded = true;
  }
  render();
  // maybeExport();
})();
// setInterval(maybeExport, 60_000);
