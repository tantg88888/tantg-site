/* ---- Nav toggle ---- */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

document.addEventListener('click', e => {
  if (!e.target.closest('.nav')) closeNav();
});

function closeNav() {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

/* ---- GitHub repos ---- */
const GITHUB_USER = 'tantg88888';
const grid = document.getElementById('repos-grid');

const LANG_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python:     '#3572A5',
  Java:       '#B07219',
  CSS:        '#563D7C',
  HTML:       '#E34C26',
  Go:         '#00ADD8',
  Rust:       '#DEA584',
  Ruby:       '#701516',
  PHP:        '#4F5D95',
  'C++':      '#F34B7D',
  C:          '#555555',
  Shell:      '#89E051',
  Vue:        '#41B883',
  Svelte:     '#FF3E00',
  Kotlin:     '#7F52FF',
  Swift:      '#FA7343',
};

async function loadRepos() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=12`
    );
    if (!res.ok) throw new Error(res.status);
    const repos = await res.json();

    if (!repos.length) {
      grid.innerHTML = '<p class="repos-status">No public repositories yet.</p>';
      return;
    }

    grid.innerHTML = repos.map(r => {
      const color = r.language ? (LANG_COLORS[r.language] ?? '#999999') : null;
      const langTag = color
        ? `<span class="repo-lang">
             <span class="lang-dot" style="background:${color}"></span>
             ${r.language}
           </span>`
        : '';
      return `<a class="repo-card"
                 href="${r.html_url}"
                 target="_blank"
                 rel="noopener noreferrer"
                 aria-label="View ${r.name} on GitHub">
        <span class="repo-name">${r.name}</span>
        <p class="repo-desc">${r.description ?? 'No description.'}</p>
        <div class="repo-meta">
          ${langTag}
          <span class="repo-stars">&#9733; ${r.stargazers_count}</span>
        </div>
      </a>`;
    }).join('');
  } catch {
    grid.innerHTML = `<p class="repos-status repos-error">
      Could not load repositories.
      <a href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
    </p>`;
  }
}

loadRepos();
