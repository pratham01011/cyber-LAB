document.addEventListener("DOMContentLoaded", () => {
  const resetForm = document.getElementById("resetForm");
  const usernameInput = document.getElementById("username");
  const sqlUser = document.getElementById("sqlUser");
  const terminalLogs = document.getElementById("terminalLogs");
  const flagCard = document.getElementById("flagCard");
  const statusTitle = document.getElementById("statusTitle");
  const statusMessage = document.getElementById("statusMessage");
  const queryStatus = document.getElementById("queryStatus");
  const hintBtn = document.getElementById("hintBtn");
  const hintBox = document.getElementById("hintBox");
  const validUsers = ["admin", "jane"];

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

  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = usernameInput.value || "";
    sqlUser.textContent = raw;
    const normalized = raw.trim().toLowerCase().replace(/\s+/g, " ");
    const bypass =
      normalized.includes("' and '1'='1") ||
      normalized.includes("' or '1'='1") ||
      normalized.includes("or 1=1");

    if (bypass) {
      statusTitle.textContent = "? Username registered";
      statusMessage.textContent = "Boolean query evaluated to TRUE.";
      queryStatus.textContent = "TRUE";
      log("[SUCCESS] Blind boolean bypass confirmed.", "success");
      flagCard.classList.remove("hidden");
      markLabComplete("blind-sqli");
      return;
    }

    const baseUser = raw.split("'")[0].trim().toLowerCase();
    if (validUsers.includes(baseUser)) {
      statusTitle.textContent = "? Username registered";
      statusMessage.textContent = "Reset link would be sent.";
      queryStatus.textContent = "TRUE";
      log("[+] Boolean result: TRUE");
    } else {
      statusTitle.textContent = "? Unknown username";
      statusMessage.textContent = "No account matches.";
      queryStatus.textContent = "FALSE";
      log("[-] Boolean result: FALSE", "error");
    }
    flagCard.classList.add("hidden");
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    usernameInput.value = "";
    sqlUser.textContent = "";
    flagCard.classList.add("hidden");
    statusTitle.textContent = "Awaiting input";
    statusMessage.textContent = "Submit a username to observe the boolean response.";
    terminalLogs.innerHTML = '<div class="log-line text-muted">[+] Boolean inference engine ready.</div>';
  });

  document.getElementById("copyBtn").addEventListener("click", () => {
    const flagValue = document.getElementById("flagValue");
    flagValue.select();
    navigator.clipboard.writeText(flagValue.value);
  });
});
