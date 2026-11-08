# Links

A small, single-page app for saving links with titles, tags, and notes. Links are stored in your browser (IndexedDB). A small Express server looks up page titles when you save a link without one.

## Features

- Add, edit, and delete links from a dialog. Edit and Delete live behind a ⋯ menu on each card.
- Title is optional. If you leave it blank, the server fetches the page's `<title>`. If that fails, the URL is shown as the link's text.
- Comma-separated tags. Click a tag to filter by it.
- Fuzzy search across title, URL, notes, and tags. Tolerates typos (`javscript` finds JavaScript).
- Data persists in IndexedDB, so it survives refreshes.
- Export and Import as JSON.
- Automatic daily export: after 8pm local time, the first time the page is open each day, it downloads `links-YYYY-MM-DD.json`.

## Project layout

```
.
├── server.js        # Express server: serves public/ and the /title endpoint
├── package.json     # must define a "start" script (see below)
└── public/
    └── index.html   # the link manager client (link-manager-local.html renamed)
```

## Requirements

- Node.js 22 or newer. `node --run` was added in Node 22.
- A modern browser with IndexedDB support.

## Running it

```bash
node --run start
```

This runs the `start` script from `package.json`. The script should look like this:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Then open the app in your browser:

```
http://localhost:3000
```

The port is set in `server.js`. The examples here use 3000.

## Using the title lookup

When you save a link with an empty title, the client calls:

```
GET /title?url=https://example.com
```

The server responds with:

```json
{ "url": "https://example.com", "title": "Example Domain" }
```

The client waits up to 4 seconds. If the lookup fails or times out, the link is saved without a title. Errors return a JSON `error` field with a 400 (bad URL) or 502 (upstream failed or timed out) status.

The client and the endpoint share an origin, so no CORS configuration is needed.

## Data and backups

Links are stored in the browser that opened the app. Data does not sync between browsers or devices, and clearing site data erases it.

To back up or move your links, use **Export** to download a JSON file and **Import** to load one. The automatic daily export writes the same format to your Downloads folder. Some browsers block automatic downloads, so you may need to allow multiple downloads for this site.

The daily export only runs while the page is open. If the page is closed at 8pm, the export runs the next time you open it after 8pm that day.

## Security notes

The `/title` endpoint makes the server fetch any URL it's given. Before exposing the server beyond your own machine or network, make sure the endpoint rejects private and loopback addresses (for example `localhost`, `127.0.0.0/8`, `10.0.0.0/8`, `192.168.0.0/16`, and link-local addresses). Otherwise, anyone who can reach it can use it to probe internal services. Consider rate limiting or an API key too.

## Troubleshooting

- **Titles are not filled in:** check that the server is running and that the page is loaded from the server (`http://localhost:3000`), not opened as a file.
- **Daily export did not download:** allow multiple automatic downloads for the site in your browser settings.
- **Data disappeared:** it was probably cleared with site data or stored in a different browser profile. Import from your most recent export.
