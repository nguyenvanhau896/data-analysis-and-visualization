# Data Analysis & Visualization Assignment — Starter Repository

A minimal GitHub repository structure for the course **Nền tảng lập trình cho phân tích và trực quan dữ liệu**.

This starter intentionally contains only:
- a GitHub Pages landing page,
- placeholder pages for each assignment/data type,
- placeholder folders for notebooks, reports, and video links,
- a simple GitHub Pages deployment workflow.

It does **not** implement the full assignment.

## Repository structure

```text
.
├── .github/workflows/pages.yml
├── docs/
│   ├── index.html
│   ├── assignments/
│   │   ├── tabular/index.html
│   │   ├── text/index.html
│   │   └── optional/index.html
│   └── assets/
│       ├── css/styles.css
│       └── js/main.js
├── notebooks/
│   ├── tabular.ipynb
│   ├── text.ipynb
│   └── optional.ipynb
├── reports/
│   └── .gitkeep
├── videos/
│   └── README.md
├── .gitignore
├── LICENSE
└── README.md
```

## What you should edit first

1. Open `docs/index.html` and replace:
   - `G5`
   - member names, student IDs, roles, GitHub links
   - repository URL
2. Open each page under `docs/assignments/` and replace the dataset/problem placeholders.
3. Replace the placeholder notebooks in `notebooks/` with the real Colab-compatible notebooks.
4. Add PDF reports to `reports/` and update their links on the assignment pages.
5. Put YouTube URLs in `videos/README.md` and update the assignment pages.

## Publish with GitHub Pages

### Option A — GitHub Actions (included)
1. Create a GitHub repository and push this folder.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. Push to `main`. The included workflow deploys the `docs/` folder.

### Option B — Deploy directly from branch
You may instead configure GitHub Pages to publish from `main` → `/docs` and remove the workflow if you prefer.

## Local preview

From the repository root:

```bash
python -m http.server 8000 --directory docs
```

Then open `http://localhost:8000`.

## Rendered notebooks on GitHub Pages

Every notebook under `notebooks/` has a matching static page in `docs/assignments/`:

- `tabular.ipynb` → `assignments/tabular/tabular-notebook.html`
- `text.ipynb` → `assignments/text/text-notebook.html`
- `optional.ipynb` → `assignments/optional/optional-notebook.html`

The GitHub Pages workflow runs `node scripts/render-notebooks.mjs` before deploying.
Run the same command locally after saving an executed notebook if you want to preview
the HTML before pushing. Embedded notebook outputs such as charts, tables, and text
are included in the published page.

## Notes

- The assignment pages are intentionally placeholders.
- The HTML uses relative links so it works under `https://nguyenvanhau896.github.io/data-analysis-and-visualization/`.
- No framework or build step is required.
