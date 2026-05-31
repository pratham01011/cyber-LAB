document.addEventListener("DOMContentLoaded", () => {
  let sessionRole = "guest";
  const cookieDisplay = document.getElementById("cookieDisplay");
  const cookieValue = document.getElementById("cookieValue");
  const accessMessage = document.getElementById("accessMessage");
  const accessStatus = document.getElementById("accessStatus");
  const terminalLogs = document.getElementById("terminalLogs");
  const flagCard = document.getElementById("flagCard");
  const hintBtn = document.getElementById("hintBtn");
  const hintBox = document.getElementById("hintBox");

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

  function sync() {
    cookieDisplay.textContent = `session_role=${sessionRole}`;
    cookieValue.value = sessionRole;
    accessStatus.textContent = sessionRole === "admin" ? "Admin" : "Guest";
    accessMessage.textContent = sessionRole === "admin" ? "Admin session active." : "Guest session - admin panel locked.";
  }

  document.getElementById("applyCookieBtn").addEventListener("click", () => {
    sessionRole = cookieValue.value.trim().toLowerCase() || "guest";
    log(`[+] Cookie set: session_role=${sessionRole}`);
    sync();
    flagCard.classList.add("hidden");
  });

  document.getElementById("adminPanelBtn").addEventListener("click", () => {
    if (sessionRole === "admin") {
      log("[SUCCESS] Admin panel unlocked via cookie tampering.", "success");
      flagCard.classList.remove("hidden");
      markLabComplete("cookie-tampering");
    } else {
      log("[-] Access denied.", "error");
      flagCard.classList.add("hidden");
    }
  });

  document.getElementById("copyBtn").addEventListener("click", () => {
    const flagValue = document.getElementById("flagValue");
    flagValue.select();
    navigator.clipboard.writeText(flagValue.value);
  });

  sync();
});
