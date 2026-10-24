# G5 · Data Analysis & Visualization

A GitHub Pages portfolio for the group's course projects. The site presents three project notebooks: tabular coupon acceptance, Vietnamese feedback sentiment, and real-world urban air-quality time-series analysis.

## Project pages

- [Tabular: In-Vehicle Coupon Recommendation](docs/assignments/tabular/)
- [Text: Vietnamese Sentiment Classification](docs/assignments/text/)
- [Optional: UCI Air Quality Time Series](docs/assignments/optional/)

Each page links to a static, readable notebook view and its original `.ipynb` source. The optional notebook downloads the original UCI dataset at runtime, cleans its timestamps and missing-value sentinel, explores NO₂ readings, and compares daily forecast baselines.

## Run or update the notebooks

Open a notebook from `notebooks/` in Jupyter or Google Colab and run its cells from top to bottom. Save the executed notebook back into the repository. The GitHub Pages workflow regenerates the rendered views on every push to `main` using:

```bash
node scripts/render-notebooks.mjs
```

To preview the site locally:

```bash
python -m http.server 8000 --directory docs
```

Then open `http://localhost:8000`.

## Publish with GitHub Pages

The included Actions workflow deploys the `docs/` directory. In repository settings, choose **GitHub Actions** under **Pages → Build and deployment**, then push changes to `main`.

The current repository has no separate PDF reports or presentation video links. Project pages say so explicitly and use the rendered notebooks as walkthroughs instead of linking to empty placeholders.
