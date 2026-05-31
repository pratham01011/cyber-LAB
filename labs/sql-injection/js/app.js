// SQL Injection Sandbox Simulation Logic

document.addEventListener("DOMContentLoaded", () => {
  const vulnerableLoginForm = document.getElementById("vulnerableLoginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const submitLoginBtn = document.getElementById("submitLoginBtn");
  const sqlUser = document.getElementById("sqlUser");
  const sqlPass = document.getElementById("sqlPass");
  const sqlQueryStatus = document.getElementById("sqlQueryStatus");
  const terminalLogs = document.getElementById("terminalLogs");
  const resetLabBtn = document.getElementById("resetLabBtn");
  const flagDisplayCard = document.getElementById("flagDisplayCard");
  const copyFlagBtn = document.getElementById("copyFlagBtn");
  const sqliHintToggleBtn = document.getElementById("sqliHintToggleBtn");
  const sqliHint = document.getElementById("sqliHint");

  if (sqliHintToggleBtn && sqliHint) {
    sqliHintToggleBtn.addEventListener("click", () => {
      const hidden = sqliHint.classList.toggle("hidden");
      sqliHintToggleBtn.textContent = hidden ? "Show Hint" : "Hide Hint";
    });
  }

  function addLogLine(text, type = "") {
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.innerHTML = text;
    terminalLogs.appendChild(line);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  function normalizeInput(value) {
    return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function updateQueryPreview(username, password) {
    sqlUser.textContent = username;
    sqlPass.textContent = password;
  }

  function showSuccess() {
    addLogLine("[SUCCESS] Query bypass condition triggered. SQL WHERE predicate evaluated to TRUE.", "success");
    sqlQueryStatus.textContent = "Compromised";
    sqlQueryStatus.className = "pulse-indicator error";
    flagDisplayCard.classList.remove("hidden");
    markLabComplete("sql-injection");
  }

  function showFailure() {
    addLogLine("[-] Authentication failed. Query execution returned no matching row.", "error");
    sqlQueryStatus.textContent = "Failed";
    sqlQueryStatus.className = "pulse-indicator error";
    flagDisplayCard.classList.add("hidden");
  }

  function handleLoginAttempt(e) {
    e.preventDefault();

    const username = usernameInput.value || "";
    const password = passwordInput.value || "";
    updateQueryPreview(username, password);

    addLogLine(`[+] Authentication attempt with username: "${username}"`);
    addLogLine("[+] Evaluating login query...");

    const normalizedUser = normalizeInput(username);
    const normalizedPassword = normalizeInput(password);
    const bypassPattern = normalizedUser.includes("' or '1'='1") || normalizedUser.includes('" or "1"="1') || normalizedUser.includes("or 1=1");

    setTimeout(() => {
      if (bypassPattern && normalizedPassword === "") {
        showSuccess();
      } else {
        showFailure();
      }
    }, 300);
  }

  vulnerableLoginForm.addEventListener("submit", handleLoginAttempt);
  submitLoginBtn.addEventListener("click", handleLoginAttempt);

  resetLabBtn.addEventListener("click", () => {
    usernameInput.value = "";
    passwordInput.value = "";
    sqlUser.textContent = "";
    sqlPass.textContent = "";
    sqlQueryStatus.textContent = "Waiting";
    sqlQueryStatus.className = "pulse-indicator";
    terminalLogs.innerHTML = `
      <div class="log-line text-muted">[+] Database engine initialized. Standing by...</div>
      <div class="log-line text-muted">[+] Ready to intercept authentications.</div>
    `;
    flagDisplayCard.classList.add("hidden");
  });

  copyFlagBtn.addEventListener("click", () => {
    const flagValue = document.getElementById("flagValue");
    if (!flagValue) return;
    flagValue.select();
    navigator.clipboard.writeText(flagValue.value)
      .then(() => {
        const originalText = copyFlagBtn.textContent;
        copyFlagBtn.textContent = "Copied!";
        copyFlagBtn.style.background = "var(--neon-green)";
        copyFlagBtn.style.color = "#fff";

        setTimeout(() => {
          copyFlagBtn.textContent = originalText;
          copyFlagBtn.style.background = "";
          copyFlagBtn.style.color = "";
        }, 1500);
      })
      .catch(err => {
        console.error("Failed to copy flag text: ", err);
      });
  });
});