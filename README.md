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

## Render a Jupyter notebook to HTML

---

## Rendering this notebook on GitHub Pages

1. Run this notebook completely in Google Colab.
2. Save the executed notebook back to `notebooks/text.ipynb`.
3. From the repository root, run:

```bash
python -m pip install nbconvert
jupyter nbconvert notebooks/text.ipynb \
  --to html \
  --output text-notebook.html \
  --output-dir docs/assignments/text
```

4. Commit both:
   - `notebooks/text.ipynb`
   - `docs/assignments/text/text-notebook.html`

The rendered notebook will then be available at:

```text
https://nguyenvanhau896.github.io/data-analysis-and-visualization/assignments/text/text-notebook.html
```

## Notes

- The assignment pages are intentionally placeholders.
- The HTML uses relative links so it works under `https://nguyenvanhau896.github.io/data-analysis-and-visualization/`.
- No framework or build step is required.
