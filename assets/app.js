const pinnedGrid = document.querySelector("#pinned-grid");
const pinnedStatus = document.querySelector("#pinned-status");

const fallbackProjects = [
  {
    name: "gitlab-ai-assistant",
    description: "Gitlab AI Assistant, Easy Git Flow, AI Code Review",
    url: "https://github.com/CHashtager/gitlab-ai-assistant",
    primaryLanguage: { name: "TypeScript" },
    stargazerCount: 5,
    forkCount: 0,
  },
  {
    name: "renom",
    description: "A simple CLI tool to recursively rename files, directories, and replace text inside files.",
    url: "https://github.com/CHashtager/renom",
    primaryLanguage: { name: "Go" },
    stargazerCount: 0,
    forkCount: 0,
  },
  {
    name: "scriptzilla",
    description: "My everyday random scripts.",
    url: "https://github.com/CHashtager/scriptzilla",
    primaryLanguage: { name: "Shell" },
    stargazerCount: 0,
    forkCount: 0,
  },
  {
    name: "notch-dock",
    description: "Hover the notch to reach the menu bar icons macOS hides behind it. Native Swift, no private APIs.",
    url: "https://github.com/CHashtager/notch-dock",
    primaryLanguage: { name: "Swift" },
    stargazerCount: 2,
    forkCount: 0,
  },
  {
    name: "patchlens",
    description: "MR/PR AI Reviewer.",
    url: "https://github.com/CHashtager/patchlens",
    primaryLanguage: { name: "Go" },
    stargazerCount: 2,
    forkCount: 0,
  },
  {
    name: "kmit",
    description: "AI Commiter.",
    url: "https://github.com/CHashtager/kmit",
    primaryLanguage: { name: "Go" },
    stargazerCount: 0,
    forkCount: 0,
  },
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function projectCard(project) {
  const language = project.primaryLanguage?.name || project.language || "Repo";
  const description = project.description || "Public GitHub repository.";

  return `
    <a class="project-card" href="${escapeHtml(project.url)}" rel="noopener noreferrer" aria-label="Open ${escapeHtml(project.name)} on GitHub" title="${escapeHtml(description)}">
      <h3>${escapeHtml(project.name)}</h3>
      <div class="project-meta" aria-label="Repository metadata">
        <span class="project-language">${escapeHtml(language)}</span>
      </div>
      <span class="project-arrow" aria-hidden="true">→</span>
    </a>
  `;
}

function renderProjects(projects) {
  if (!pinnedGrid) return;
  const normalized = Array.isArray(projects) && projects.length > 0 ? projects : fallbackProjects;
  pinnedGrid.innerHTML = normalized.slice(0, 6).map(projectCard).join("");
  if (pinnedStatus) {
    pinnedStatus.textContent = `Rendered ${normalized.slice(0, 6).length} pinned repositories.`;
  }
}

async function loadPinnedProjects() {
  try {
    const response = await fetch("data/pinned.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Pinned JSON responded with ${response.status}`);
    const payload = await response.json();
    renderProjects(payload.items || payload.repositories || payload);
  } catch (error) {
    console.warn("Could not load data/pinned.json. Rendering fallback projects.", error);
    renderProjects(fallbackProjects);
  }
}

loadPinnedProjects();
