# chashtager.github.io

Minimal static portfolio for `CHashtager.github.io`.

The site is intentionally quiet: one handcrafted homepage, pinned GitHub repositories as the project source of truth, and a small "Working Memory" section instead of a fake blog.

## Structure

```text
.
├── index.html
├── assets/
│   ├── styles.css
│   └── app.js
├── data/
│   └── pinned.json
├── scripts/
│   └── fetch-pinned.mjs
└── .github/workflows/pages.yml
```

## How pinned repos work

The homepage reads `data/pinned.json` at runtime. The GitHub Actions workflow refreshes this file from the GitHub GraphQL API before deploying to Pages.

You can change the visible projects by changing your pinned repositories on your GitHub profile.

## Local preview

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

## Deploy

Push this repository to:

```text
CHashtager/chashtager.github.io
```

Then enable GitHub Pages with **GitHub Actions** as the source.
