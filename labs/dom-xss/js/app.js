document.addEventListener("DOMContentLoaded", () => {
  const welcomePanel = document.getElementById("welcomePanel");
  const hashInput = document.getElementById("hashInput");
  const terminalLogs = document.getElementById("terminalLogs");
  const flagOverlay = document.getElementById("flagOverlay");
  const hintBtn = document.getElementById("hintBtn");
  const hintBox = document.getElementById("hintBox");
  const domStatus = document.getElementById("domStatus");
  const domHighlightedQuery = document.getElementById("domHighlightedQuery");

  window.alert = () => {
    log("[SUCCESS] DOM XSS from hash fragment.", "success");
    domStatus.textContent = "PWNED";
    domStatus.className = "pulse-indicator error";
    flagOverlay.classList.remove("hidden");
    markLabComplete("dom-xss");
  };

  hintBtn.addEventListener("click", () => {
    const hidden = hintBox.classList.toggle("hidden");
    hintBtn.textContent = hidden ? "Show Hint" : "Hide Hint";
  });

  function log(text, type = "") {
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.textContent = text;
    terminalLogs.appendChild(line);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  function processHash(fragment) {
    log(`[+] Processing hash: #${fragment || ""}`);
    domHighlightedQuery.textContent = fragment || "";

    if (!fragment) {
      welcomePanel.innerHTML = '<p class="placeholder-text">Waiting for hash...</p>';
      domStatus.textContent = "Idle";
      domStatus.className = "pulse-indicator success";
      return;
    }

    log("[!] Writing hash to innerHTML", "warning");
    welcomePanel.innerHTML = `<p>Welcome, <span class="user-query">${fragment}</span>!</p>`;
    domStatus.textContent = "Rendered";
    domStatus.className = "pulse-indicator";
  }

  document.getElementById("applyHashBtn").addEventListener("click", () => {
    const value = hashInput.value.replace(/^#/, "");
    location.hash = value;
    processHash(value);
  });

  window.addEventListener("hashchange", () => processHash(location.hash.replace(/^#/, "")));

  document.getElementById("resetBtn").addEventListener("click", () => {
    hashInput.value = "";
    location.hash = "";
    processHash("");
    flagOverlay.classList.add("hidden");
    terminalLogs.innerHTML = '<div class="log-line text-muted">[+] Hash router ready.</div>';
  });

  document.getElementById("closeBtn").addEventListener("click", () => flagOverlay.classList.add("hidden"));
  document.getElementById("copyBtn").addEventListener("click", () => {
    const flagValue = document.getElementById("flagValue");
    flagValue.select();
    navigator.clipboard.writeText(flagValue.value);
  });

  if (location.hash) {
    hashInput.value = location.hash.replace(/^#/, "");
    processHash(location.hash.replace(/^#/, ""));
  }
});
