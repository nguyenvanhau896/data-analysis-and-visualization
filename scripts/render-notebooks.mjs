import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const notebooks = [
  ["tabular", "Tabular Data Analysis"],
  ["text", "Vietnamese Sentiment Classification"],
  ["optional", "Optional Data Assignment"],
];
const text = (value = []) => Array.isArray(value) ? value.join("") : value;
const esc = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function markdown(source) {
  const inline = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  let list = false;
  return text(source).replace(/\r\n/g, "\n").split("\n").map((line) => {
    if (/^#{1,6}\s/.test(line)) { list = false; const m = line.match(/^(#+)\s+(.*)/); return `<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`; }
    if (/^[-*+]\s+/.test(line)) { const start = list ? "" : "<ul>"; list = true; return `${start}<li>${inline(line.replace(/^[-*+]\s+/, ""))}</li>`; }
    if (!line.trim()) { const end = list ? "</ul>" : ""; list = false; return end; }
    list = false; return `<p>${inline(line)}</p>`;
  }).join("");
}

function output(output) {
  if (output.output_type === "stream") return `<pre class="output">${esc(text(output.text))}</pre>`;
  if (output.output_type === "error") return `<pre class="output error">${esc((output.traceback || []).join("\n"))}</pre>`;
  const data = output.data || {};
  if (data["image/png"]) return `<img class="plot" src="data:image/png;base64,${data["image/png"]}" alt="Notebook chart">`;
  if (data["image/jpeg"]) return `<img class="plot" src="data:image/jpeg;base64,${data["image/jpeg"]}" alt="Notebook chart">`;
  if (data["text/html"]) return `<div class="rich">${text(data["text/html"])}</div>`;
  if (data["text/plain"]) return `<pre class="output">${esc(text(data["text/plain"]))}</pre>`;
  return "";
}

function render(slug, title, cells) {
  const body = cells.map((cell) => {
    if (cell.cell_type === "markdown") return `<section class="markdown">${markdown(cell.source)}</section>`;
    if (cell.cell_type !== "code") return "";
    return `<section class="cell"><div class="input"><span>In [${cell.execution_count ?? " "}]</span><pre><code>${esc(text(cell.source))}</code></pre></div>${(cell.outputs || []).map(output).join("")}</section>`;
  }).join("\n");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Rendered notebook: ${esc(title)}"><title>${esc(title)} | G5</title><style>
  :root{--ink:#172033;--muted:#64748b;--blue:#3157d5;--line:#dfe5ef;--paper:#fff;--bg:#f7f8fc}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif}.bar{position:sticky;top:0;z-index:2;background:#ffffffed;border-bottom:1px solid var(--line)}.bar>div,main{width:min(1180px,calc(100% - 32px));margin:auto}.bar>div{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:16px}.bar a{color:var(--blue);font-weight:700;text-decoration:none}main{padding:42px 0 72px}.markdown,.cell{background:var(--paper);border:1px solid var(--line);border-radius:14px;margin:20px 0;overflow:hidden}.markdown{padding:18px 26px}.markdown h1{font-size:clamp(2rem,5vw,3.4rem);line-height:1.12}.markdown code{background:#eef2f7;padding:2px 5px;border-radius:4px}.input{display:grid;grid-template-columns:76px 1fr;background:#f9fafc;border-bottom:1px solid var(--line)}.input span{padding:17px 8px;color:var(--blue);font:12px ui-monospace,monospace;text-align:right}.input pre,.output{margin:0;padding:16px;overflow:auto;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}.output{white-space:pre-wrap}.error{color:#a61b1b;background:#fff2f2}.plot{display:block;max-width:100%;height:auto;margin:18px auto}.rich{overflow:auto;padding:18px}.rich table{border-collapse:collapse}.rich th,.rich td{padding:6px 10px;border:1px solid var(--line);text-align:left}@media(max-width:620px){.bar>div,main{width:calc(100% - 24px)}.input{grid-template-columns:52px 1fr}}
  </style></head><body><header class="bar"><div><a href="./">Back to assignment</a><a href="../../../notebooks/${slug}.ipynb">Download .ipynb</a></div></header><main>${body}</main></body></html>`;
}

for (const [slug, title] of notebooks) {
  const notebook = JSON.parse(await readFile(resolve(root, "notebooks", `${slug}.ipynb`), "utf8"));
  const target = resolve(root, "docs", "assignments", slug, `${slug}-notebook.html`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(slug, title, notebook.cells), "utf8");
  console.log(`Rendered ${slug}`);
}
