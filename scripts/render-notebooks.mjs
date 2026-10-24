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

function markdown(source, headingIds = []) {
  const inline = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  let list = false;
  let headingIndex = 0;
  return text(source).replace(/\r\n/g, "\n").split("\n").map((line) => {
    if (/^#{1,6}\s/.test(line)) { list = false; const m = line.match(/^(#+)\s+(.*)/); const id = headingIds[headingIndex++]; return `<h${m[1].length}${id ? ` id="${id}"` : ""}>${inline(m[2])}</h${m[1].length}>`; }
    if (/^[-*+]\s+/.test(line)) { const start = list ? "" : "<ul>"; list = true; return `${start}<li>${inline(line.replace(/^[-*+]\s+/, ""))}</li>`; }
    if (!line.trim()) { const end = list ? "</ul>" : ""; list = false; return end; }
    list = false; return `<p>${inline(line)}</p>`;
  }).join("");
}

function slugify(value) {
  return String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
}

function output(output) {
  if (output.output_type === "stream") {
    const lines = text(output.text).split(/\r?\n/);
    const captions = lines.filter((line) => /^\s*Caption:/i.test(line));
    const rest = lines.filter((line) => !/^\s*Caption:/i.test(line)).join("\n").trim();
    return `${captions.map((line) => `<aside class="insight"><span>Experiment takeaway</span><p>${esc(line.replace(/^\s*Caption:\s*/i, ""))}</p></aside>`).join("")}${rest ? `<pre class="output">${esc(rest)}</pre>` : ""}`;
  }
  if (output.output_type === "error") return `<pre class="output error">${esc((output.traceback || []).join("\n"))}</pre>`;
  const data = output.data || {};
  if (data["image/png"]) return `<img class="plot" src="data:image/png;base64,${data["image/png"]}" alt="Notebook chart">`;
  if (data["image/jpeg"]) return `<img class="plot" src="data:image/jpeg;base64,${data["image/jpeg"]}" alt="Notebook chart">`;
  if (data["text/html"]) return `<div class="rich">${text(data["text/html"])}</div>`;
  if (data["text/plain"]) return `<pre class="output">${esc(text(data["text/plain"]))}</pre>`;
  return "";
}

function render(slug, title, cells) {
  let headingIndex = 0;
  const headingsByCell = new Map();
  const toc = [];
  cells.forEach((cell, cellIndex) => {
    if (cell.cell_type !== "markdown") return;
    const headings = [];
    text(cell.source).split(/\r?\n/).forEach((line) => {
      const match = line.match(/^(#{1,4})\s+(.*)/);
      if (!match) return;
      const id = `${slugify(match[2].replace(/[*`]/g, ""))}-${headingIndex++}`;
      headings.push(id);
      toc.push({ id, label: match[2].replace(/[*`]/g, ""), level: match[1].length });
    });
    headingsByCell.set(cellIndex, headings);
  });

  const body = cells.map((cell, cellIndex) => {
    if (cell.cell_type === "markdown") return `<section class="markdown">${markdown(cell.source, headingsByCell.get(cellIndex))}</section>`;
    if (cell.cell_type !== "code") return "";
    const outputs = (cell.outputs || []).map(output).join("");
    const emptyNotice = outputs || cell.execution_count !== null ? "" : `<div class="pending"><strong>Result not saved yet</strong><span>Run this cell in the notebook and save its output to display the experiment result here.</span></div>`;
    return `<section class="cell"><div class="input"><span>In [${cell.execution_count ?? " "}]</span><pre><code>${esc(text(cell.source))}</code></pre></div><div class="outputs">${outputs || emptyNotice}</div></section>`;
  }).join("\n");

  const tocHtml = toc.filter((item) => item.level <= 3).map((item) => `<a class="toc-level-${item.level}" href="#${item.id}">${esc(item.label)}</a>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Rendered notebook: ${esc(title)}"><title>${esc(title)} | G5</title><style>
  :root{--ink:#172033;--muted:#64748b;--blue:#3157d5;--teal:#167a70;--line:#dfe5ef;--paper:#fff;--bg:#f3f6fb;--soft:#eef3ff;--shadow:0 12px 34px rgba(23,32,51,.07)}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:88px}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.7 system-ui,-apple-system,"Segoe UI",sans-serif}.bar{position:sticky;top:0;z-index:20;background:#ffffffed;backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.bar>div{width:min(1440px,calc(100% - 40px));min-height:66px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:18px}.brand{color:var(--ink);font-weight:850;text-decoration:none}.bar-actions{display:flex;align-items:center;gap:10px}.bar a,.bar button{font:inherit;color:var(--blue);font-weight:750;text-decoration:none}.bar button,.bar .download{border:1px solid #ccd7ee;background:#fff;border-radius:10px;padding:8px 13px;cursor:pointer}.bar a:hover,.bar button:hover{background:var(--soft)}.page{width:min(1440px,calc(100% - 40px));margin:auto;display:grid;grid-template-columns:240px minmax(0,1fr);gap:28px;padding:28px 0 70px}.toc{position:sticky;top:92px;align-self:start;max-height:calc(100vh - 116px);overflow:auto;padding:16px 12px;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow)}.toc-title{margin:0 10px 10px;color:var(--muted);font-size:.72rem;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.toc a{display:block;padding:6px 10px;border-radius:8px;color:#40506b;font-size:.86rem;line-height:1.4;text-decoration:none}.toc a:hover{background:var(--soft);color:var(--blue)}.toc-level-1{font-weight:800}.toc-level-3{padding-left:22px!important;color:var(--muted)!important}.report{min-width:0}.markdown,.cell{margin:0 0 18px;background:var(--paper);border:1px solid var(--line);border-radius:16px;box-shadow:var(--shadow);overflow:hidden}.markdown{padding:clamp(18px,3vw,30px)}.markdown h1{font-size:clamp(2rem,4vw,3.3rem);line-height:1.12;letter-spacing:-.035em;margin:0 0 16px}.markdown h2{margin:10px 0 12px;padding-bottom:9px;border-bottom:1px solid var(--line);font-size:clamp(1.35rem,2.3vw,1.8rem);letter-spacing:-.02em}.markdown h3{margin:20px 0 8px;font-size:1.1rem}.markdown p{margin:10px 0}.markdown li{margin:5px 0}.markdown code{background:#eef2f7;padding:2px 5px;border-radius:5px}.cell{scroll-margin-top:84px}.input{display:grid;grid-template-columns:64px minmax(0,1fr);background:#f8faff;border-bottom:1px solid var(--line)}.input span{padding:16px 8px;color:var(--blue);font:12px ui-monospace,monospace;text-align:right}.input pre,.output{margin:0;padding:16px 18px;overflow:auto;font:12.5px/1.55 ui-monospace,SFMono-Regular,Consolas,monospace;tab-size:4}.input pre{max-height:440px}.input code{white-space:pre}.outputs{min-width:0}.outputs:empty{display:none}.output{white-space:pre-wrap;overflow-wrap:anywhere;color:#334155}.error{color:#a61b1b;background:#fff2f2}.plot{display:block;width:auto;max-width:min(100%,1100px);max-height:78vh;height:auto;object-fit:contain;margin:18px auto;padding:0 12px}.rich{max-width:100%;max-height:560px;overflow:auto;padding:14px 18px}.rich table{width:max-content;min-width:65%;max-width:100%;border-collapse:separate;border-spacing:0;font-size:.87rem}.rich th,.rich td{padding:8px 12px;border:0;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}.rich th{position:sticky;top:0;background:#edf2fb!important;color:#40506b;font-size:.74rem;letter-spacing:.04em;text-transform:uppercase;z-index:1}.rich tbody tr:nth-child(even){background:#f8faff}.insight{margin:14px 18px;padding:15px 18px;border:1px solid #b9e2da;border-left:5px solid var(--teal);border-radius:12px;background:linear-gradient(110deg,#effaf7,#f9fffd)}.insight span{display:block;margin-bottom:4px;color:var(--teal);font-size:.7rem;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.insight p{margin:0;color:#194c47;font-size:.95rem;font-weight:650;line-height:1.55}.pending{display:grid;gap:3px;margin:14px 18px;padding:14px 16px;border-radius:11px;background:#fff8e8;border:1px solid #f0d9a4;color:#765516;font-size:.88rem}.pending strong{font-size:.9rem}.code-hidden .input{display:none}.code-hidden .cell:has(.outputs:not(:empty)) .outputs{border-top:0}.cell:has(.input):hover{border-color:#cbd7ec}footer{padding:18px 0;color:var(--muted);font-size:.82rem}.empty-output{display:none}@media(max-width:900px){.page{grid-template-columns:1fr;gap:14px;padding-top:16px}.toc{position:relative;top:auto;max-height:none;display:flex;gap:5px;overflow:auto;white-space:nowrap;padding:9px}.toc-title{display:none}.toc a{flex:0 0 auto}.toc-level-3{padding-left:10px!important}}@media(max-width:620px){.bar>div,.page{width:calc(100% - 20px)}.bar>div{min-height:58px}.brand{font-size:.9rem}.bar-actions{gap:6px}.bar button,.bar .download{padding:7px 9px;font-size:.8rem}.page{padding-bottom:38px}.input{grid-template-columns:42px minmax(0,1fr)}.input span{padding:14px 4px;font-size:10px}.input pre,.output{padding:13px;font-size:11px}.rich{padding:8px}.plot{max-height:none;padding:0 6px}.markdown{padding:18px}.insight{margin:12px;padding:12px}}
  </style></head><body class="code-hidden"><header class="bar"><div><a class="brand" href="./">← Assignment overview</a><nav class="bar-actions" aria-label="Notebook tools"><button id="code-toggle" type="button" aria-expanded="false">Show code</button><a class="download" href="../../../notebooks/${slug}.ipynb">Open notebook</a></nav></div></header><div class="page"><nav class="toc" aria-label="Notebook contents"><p class="toc-title">On this page</p>${tocHtml}</nav><main class="report">${body}<footer>Rendered from the project notebook · Outputs appear here after the notebook is run and saved.</footer></main></div><script>const toggle=document.getElementById('code-toggle');toggle.addEventListener('click',()=>{const hidden=document.body.classList.toggle('code-hidden');toggle.textContent=hidden?'Show code':'Hide code';toggle.setAttribute('aria-expanded',String(!hidden));});</script></body></html>`;
}

for (const [slug, title] of notebooks) {
  const notebook = JSON.parse(await readFile(resolve(root, "notebooks", `${slug}.ipynb`), "utf8"));
  const target = resolve(root, "docs", "assignments", slug, `${slug}-notebook.html`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, render(slug, title, notebook.cells), "utf8");
  console.log(`Rendered ${slug}`);
}
