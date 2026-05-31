// Web Security Labs Dashboard - Core Logic

const labsData = [
  {
    id: "sql-injection",
    title: "SQL Injection Login Bypass",
    vulnType: "SQLi",
    difficulty: "easy",
    description: "Simulate an unparameterized database query. Inject SQL syntactical operators into the username and password fields to alter the logical context, bypass login checks, and capture the admin flag.",
    docPath: "docs/sql-injection-guide.pdf",
    labPath: "labs/sql-injection/index.html"
  },
  {
    id: "reflected-xss",
    title: "Reflected XSS Sandbox",
    vulnType: "XSS",
    difficulty: "easy",
    description: "Inject unescaped client-side JavaScript payloads into a reflection mechanism. Evade browser limits, execute custom script operations in the DOM environment, and solve the challenge.",
    docPath: "docs/reflected-xss-guide.pdf", // Links to the common guide list
    labPath: "labs/reflected-xss/index.html"
  },
  {
    id: "idor",
    title: "IDOR Profile Console",
    vulnType: "IDOR",
    difficulty: "medium",
    description: "Insecure Direct Object Reference. Manipulate request account identifiers to read confidential client data without permission, retrieve target profile details, and extract the flag.",
    docPath: "docs/idor-guide.pdf",
    labPath: "labs/idor/index.html"
  }
];

// DOM Element Selections
const labsGrid = document.getElementById("labsGrid");
const labSearch = document.getElementById("labSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const completedCountEl = document.getElementById("completedCount");

let activeFilter = "all";
let searchQuery = "";

// Initialize Dashboard
document.addEventListener("DOMContentLoaded", () => {
  renderLabs();
  updateProgressBadge();
  setupEventListeners();
});

// Calculate and render progress from localStorage flags
const labSolvedStorageKeys = {
  "sql-injection": "lab.sql-injection.solved",
  "reflected-xss": "lab.reflected-xss.solved",
  "idor": "lab.idor.solved"
};

function getSolverStorageKey(labId) {
  return labSolvedStorageKeys[labId] || labId;
}

function updateProgressBadge() {
  let completed = 0;
  const keys = Object.values(labSolvedStorageKeys);

  keys.forEach(key => {
    if (localStorage.getItem(key) === "true") {
      completed++;
    }
  });

  if (completedCountEl) {
    completedCountEl.textContent = completed;
  }
}

// Render Lab Cards dynamically based on Search & Difficulty Filter
function renderLabs() {
  labsGrid.innerHTML = "";

  const filteredLabs = labsData.filter(lab => {
    // Difficulty Filter Check
    const matchesDifficulty = activeFilter === "all" || lab.difficulty === activeFilter;

    // Search Query Check
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      lab.title.toLowerCase().includes(term) ||
      lab.vulnType.toLowerCase().includes(term) ||
      lab.description.toLowerCase().includes(term) ||
      lab.difficulty.toLowerCase().includes(term);

    return matchesDifficulty && matchesSearch;
  });

  if (filteredLabs.length === 0) {
    renderNoResults();
    return;
  }

  filteredLabs.forEach(lab => {
    const isSolved = checkLabSolved(lab.id);
    const cardEl = document.createElement("article");
    cardEl.className = "lab-card";
    cardEl.id = `card-${lab.id}`;

    // Inject styles and details
    cardEl.innerHTML = `
      <div class="lab-header">
        <span class="vuln-type">${lab.vulnType}</span>
        <div style="display: flex; gap: 8px; align-items: center;">
          ${isSolved ? `<span class="difficulty-badge diff-easy" style="background: rgba(16, 185, 129, 0.15); font-size: 0.7rem; border-color: var(--neon-green);">SOLVED</span>` : ""}
          <span class="difficulty-badge diff-${lab.difficulty}">${lab.difficulty}</span>
        </div>
      </div>
      <h3 class="lab-title">${lab.title}</h3>
      <p class="lab-description">${lab.description}</p>
      <div class="card-actions">
        <a href="${lab.docPath}" target="_blank" class="btn btn-secondary" title="View PDF Documentation for SQLi">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Docs
        </a>
        <a href="${lab.labPath}" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Start Lab
        </a>
      </div>
    `;

    // Add custom style highlights if solved
    if (isSolved) {
      cardEl.style.borderColor = "var(--neon-green)";
    }

    labsGrid.appendChild(cardEl);
  });
}

// Render empty state
function renderNoResults() {
  labsGrid.innerHTML = `
    <div class="no-results" id="noResultsAlert">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" style="margin: 0 auto 15px;">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h4>No Laboratories Found</h4>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 5px;">We couldn't find any labs matching "${searchQuery}". Try modifying your search query or filters.</p>
    </div>
  `;
}

// Helper: Check if a lab is solved by ID
function checkLabSolved(labId) {
  return localStorage.getItem(getSolverStorageKey(labId)) === "true";
}

// Bind search and filter events
function setupEventListeners() {
  // Real-time Search Input
  labSearch.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderLabs();
  });

  // Difficulty Filter Buttons
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      activeFilter = btn.getAttribute("data-difficulty");
      renderLabs();
    });
  });
}
