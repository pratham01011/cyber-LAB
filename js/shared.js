// CyberGuard Labs - Shared lab card utilities

function buildLabCardHtml(lab, options = {}) {
  const { showCategory = true } = options;
  const isSolved = checkLabSolved(lab.id);
  const categoryTitle = getCategoryTitle(lab.category);
  const categoryMarkup = showCategory ? `<span class="category-tag">${categoryTitle}</span>` : "";
  const statusBadge = isSolved ? `<span class="difficulty-badge diff-easy">Completed</span>` : "";

  return `
    <div class="lab-header">
      <span class="vuln-type">${lab.vulnType}</span>
      <div class="badge-group">
        ${statusBadge}
        <span class="difficulty-badge diff-${lab.difficulty}">${lab.difficulty}</span>
      </div>
    </div>
    ${categoryMarkup}
    <h3 class="lab-title">${lab.title}</h3>
    <p class="lab-description">${lab.description}</p>
    <div class="card-actions">
      <a class="btn btn-secondary" ${lab.docPath !== "#" ? `href="${lab.docPath}" target="_blank"` : "href=\"#\" aria-disabled=\"true\""}>
        Docs
      </a>
      <a class="btn btn-primary" href="${lab.labPath}">
        Launch lab
      </a>
    </div>
  `;
}

function buildNoResultsHtml(message) {
  return `
    <div class="no-results">
      <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h4>No labs found</h4>
      <p>${message}</p>
    </div>
  `;
}

function updateLabCountBadge() {
  updateProgressStats();
}

function getCategoryProgressHtml(labs) {
  const solvedCount = countCompletedLabs(labs);
  const progressValue = getScorePercent(labs);

  return `
    <div class="category-meta-row">
      <span>${labs.length} labs</span>
      <span>${solvedCount}/${labs.length} completed</span>
    </div>
    <div class="progress-bar-shell" data-progress="${progressValue}">
      <span class="progress-fill" style="width: ${progressValue}%;"></span>
    </div>
  `;
}
