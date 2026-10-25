// Lists public repos from the GitHub API in #repos (newest first, forks hidden).
const USER = "tantg88888";
const HIDE = new Set(["tantg-site", USER]);

document.getElementById("year").textContent = new Date().getFullYear();

const list = document.getElementById("repo-list");

function card(repo) {
  const el = document.createElement("article");
  el.className = "card repo";
  const h = document.createElement("h3");
  const a = document.createElement("a");
  a.href = repo.html_url;
  a.textContent = repo.name;
  h.appendChild(a);
  const p = document.createElement("p");
  p.textContent = repo.description || "";
  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = [repo.language, "updated " + new Date(repo.pushed_at).toLocaleDateString()].filter(Boolean).join(" · ");
  el.append(h, p, meta);
  return el;
}

fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=30`)
  .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
  .then((repos) => {
    const shown = repos.filter((r) => !r.fork && !HIDE.has(r.name));
    list.replaceChildren(...(shown.length ? shown.map(card) : [Object.assign(document.createElement("p"), { className: "muted", textContent: "No public repositories yet." })]));
  })
  .catch(() => {
    list.innerHTML = `<p class="muted">See all repositories on <a href="https://github.com/${USER}">GitHub</a>.</p>`;
  });
