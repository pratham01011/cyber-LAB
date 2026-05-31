// CyberGuard Labs - Per-lab completion tracking (not shared global flags)

function getSolverStorageKey(labId) {
  return `cyberguard.lab.${labId}.completed`;
}

function checkLabSolved(labId) {
  const key = getSolverStorageKey(labId);
  if (localStorage.getItem(key) === "true") {
    return true;
  }

  // Support older per-lab keys from previous builds
  return localStorage.getItem(`lab.${labId}.solved`) === "true";
}

function markLabComplete(labId) {
  localStorage.setItem(getSolverStorageKey(labId), "true");
  localStorage.removeItem(`lab.${labId}.solved`);
  window.dispatchEvent(new CustomEvent("lab-progress-updated", { detail: { labId } }));
}

function countCompletedLabs(labList) {
  const list = labList || (typeof labsData !== "undefined" ? labsData : []);
  return list.filter((lab) => checkLabSolved(lab.id)).length;
}

function getScorePercent(labList) {
  const list = labList || (typeof labsData !== "undefined" ? labsData : []);
  if (!list.length) {
    return 0;
  }
  return Math.round((countCompletedLabs(list) / list.length) * 100);
}

function applyProgressBar(trackEl, fillEl, percent) {
  const value = Math.max(0, Math.min(100, percent));

  if (trackEl) {
    trackEl.setAttribute("role", "progressbar");
    trackEl.setAttribute("aria-valuemin", "0");
    trackEl.setAttribute("aria-valuemax", "100");
    trackEl.setAttribute("aria-valuenow", String(value));
  }

  if (fillEl) {
    fillEl.style.width = `${value}%`;
  }
}

function updateProgressStats() {
  const total = typeof labsData !== "undefined" ? labsData.length : 0;
  const completed = countCompletedLabs();

  const badgeTotalText = document.getElementById("badgeTotalText");
  const completedCountEl = document.getElementById("completedCount");
  const completedCategoryCount = document.getElementById("completedCategoryCount");
  const dashboardCompletedCount = document.getElementById("dashboardCompletedCount");
  const dashboardScorePercent = document.getElementById("dashboardScorePercent");

  if (badgeTotalText) {
    badgeTotalText.textContent = `Labs: ${total}`;
  }

  if (completedCountEl) {
    completedCountEl.textContent = completed;
  }

  if (completedCategoryCount) {
    completedCategoryCount.textContent = completed;
  }

  if (dashboardCompletedCount) {
    dashboardCompletedCount.textContent = completed;
  }

  if (dashboardScorePercent) {
    dashboardScorePercent.textContent = getScorePercent();
  }
}

window.addEventListener("storage", () => {
  window.dispatchEvent(new Event("lab-progress-updated"));
});
