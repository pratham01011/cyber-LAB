// CyberGuard Labs - Category navigation and lab list renderer

const categoryOverview = document.getElementById("categoryOverview");
const categoryDetail = document.getElementById("categoryDetail");
const labsList = document.getElementById("labsList");
const labSearch = document.getElementById("labSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const categoryLabel = document.getElementById("categoryLabel");
const categoryTitle = document.getElementById("categoryTitle");
const categoryDescription = document.getElementById("categoryDescription");
const categoryLabCount = document.getElementById("categoryLabCount");
const categorySolvedCount = document.getElementById("categorySolvedCount");
const categoryProgressFill = document.getElementById("categoryProgressFill");
const backToCategories = document.getElementById("backToCategories");

let activeCategory = null;
let activeFilter = "all";
let searchQuery = "";

function renderCategoryOverview() {
  activeCategory = null;
  categoryOverview.innerHTML = "";
  categoryDetail.classList.add("hidden");
  categoryOverview.classList.remove("hidden");

  categoriesData.forEach((category) => {
    const labs = labsData.filter((lab) => lab.category === category.id);

    const card = document.createElement("article");
    card.className = "category-card";
    card.innerHTML = `
      <span class="category-tag">${category.title}</span>
      <h3 class="category-title">${category.title}</h3>
      <p class="category-copy">${category.description}</p>
      <div class="category-meta">
        ${getCategoryProgressHtml(labs)}
      </div>
      <button type="button" class="btn btn-primary" data-category="${category.id}">View labs</button>
    `;

    card.querySelector(".btn").addEventListener("click", () => {
      openCategory(category.id);
    });

    categoryOverview.appendChild(card);
  });
}

function openCategory(categoryId) {
  activeCategory = categoryId;
  searchQuery = "";
  activeFilter = "all";
  labSearch.value = "";
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.difficulty === "all"));
  categoryOverview.classList.add("hidden");
  categoryDetail.classList.remove("hidden");
  renderCategoryDetail();
  document.getElementById("labsSection").scrollIntoView({ behavior: "smooth", block: "start" });

  const url = new URL(window.location.href);
  url.searchParams.set("category", categoryId);
  window.history.replaceState({}, "", url);
}

function renderCategoryDetail() {
  const category = categoriesData.find((item) => item.id === activeCategory);
  if (!category) {
    renderCategoryOverview();
    return;
  }

  const labs = labsData.filter((lab) => lab.category === activeCategory);
  const solvedCount = countCompletedLabs(labs);
  const progressValue = getScorePercent(labs);

  categoryLabel.textContent = category.title;
  categoryTitle.textContent = `${category.title} labs`;
  categoryDescription.textContent = category.description;
  categoryLabCount.textContent = labs.length;

  if (categorySolvedCount) {
    categorySolvedCount.textContent = solvedCount;
  }

  const progressTrack = document.querySelector("#categoryDetail .progress-bar-shell");
  applyProgressBar(progressTrack, categoryProgressFill, progressValue);

  renderLabsList();
}

function getFilteredLabs() {
  return labsData.filter((lab) => {
    const matchesCategory = lab.category === activeCategory;
    const matchesFilter = activeFilter === "all" || lab.difficulty === activeFilter;
    const searchTerm = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !searchTerm ||
      lab.title.toLowerCase().includes(searchTerm) ||
      lab.description.toLowerCase().includes(searchTerm) ||
      lab.vulnType.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesFilter && matchesSearch;
  });
}

function renderLabsList() {
  labsList.innerHTML = "";
  const filteredLabs = getFilteredLabs();

  if (!filteredLabs.length) {
    labsList.innerHTML = buildNoResultsHtml(
      "Try adjusting the search or difficulty filter to discover labs in this category."
    );
    return;
  }

  filteredLabs.forEach((lab) => {
    const card = document.createElement("article");
    card.className = "lab-card";
    card.innerHTML = buildLabCardHtml(lab, { showCategory: false });
    labsList.appendChild(card);
  });
}

function setupEventListeners() {
  labSearch.addEventListener("input", (event) => {
    searchQuery = event.target.value;
    renderLabsList();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((option) => option.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.difficulty;
      renderLabsList();
    });
  });

  backToCategories.addEventListener("click", (event) => {
    event.preventDefault();
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    window.history.replaceState({}, "", url);
    renderCategoryOverview();
    updateProgressStats();
  });
}

function openCategoryFromUrl() {
  const categoryId = new URLSearchParams(window.location.search).get("category");
  if (categoryId && categoriesData.some((category) => category.id === categoryId)) {
    openCategory(categoryId);
  } else {
    renderCategoryOverview();
  }
}

function refreshLabsProgress() {
  if (activeCategory) {
    renderCategoryDetail();
  } else {
    renderCategoryOverview();
  }
  updateProgressStats();
}

window.addEventListener("DOMContentLoaded", () => {
  openCategoryFromUrl();
  updateProgressStats();
  setupEventListeners();
});

window.addEventListener("lab-progress-updated", refreshLabsProgress);
window.addEventListener("focus", refreshLabsProgress);
window.addEventListener("pageshow", refreshLabsProgress);
