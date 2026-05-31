// CyberGuard Labs - Dashboard category gateways

const categoryGateways = document.getElementById("categoryGateways");

function renderCategoryGateways() {
  if (!categoryGateways) {
    return;
  }

  categoryGateways.innerHTML = "";

  categoriesData.forEach((category) => {
    const labs = labsData.filter((lab) => lab.category === category.id);

    const card = document.createElement("a");
    card.className = "category-card category-gateway";
    card.href = `labs.html?category=${category.id}`;
    card.innerHTML = `
      <span class="category-tag">${category.title}</span>
      <h3 class="category-title">${category.title}</h3>
      <p class="category-copy">${category.description}</p>
      <div class="category-meta">
        ${getCategoryProgressHtml(labs)}
      </div>
      <span class="gateway-link">Open in Labs section ?</span>
    `;

    categoryGateways.appendChild(card);
  });
}

function refreshDashboardProgress() {
  renderCategoryGateways();
  updateProgressStats();
}

window.addEventListener("DOMContentLoaded", refreshDashboardProgress);
window.addEventListener("lab-progress-updated", refreshDashboardProgress);
window.addEventListener("focus", refreshDashboardProgress);
window.addEventListener("pageshow", refreshDashboardProgress);
