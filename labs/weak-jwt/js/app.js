document.addEventListener("DOMContentLoaded", () => {
  const sampleTokenEl = document.getElementById("sampleToken");
  const tokenInput = document.getElementById("tokenInput");
  const apiResponse = document.getElementById("apiResponse");
  const apiStatus = document.getElementById("apiStatus");
  const terminalLogs = document.getElementById("terminalLogs");
  const flagCard = document.getElementById("flagCard");
  const hintBtn = document.getElementById("hintBtn");
  const hintBox = document.getElementById("hintBox");

  const sampleToken = `${btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${btoa(JSON.stringify({ user: "tester", role: "user" }))}.demo`;
  sampleTokenEl.textContent = sampleToken;
  tokenInput.value = sampleToken;

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

  function decodePart(part) {
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(normalized + "=".repeat((4 - (normalized.length % 4)) % 4)));
  }

  document.getElementById("submitTokenBtn").addEventListener("click", () => {
    flagCard.classList.add("hidden");
    const parts = tokenInput.value.trim().split(".");
    if (parts.length < 2) {
      log("[-] Malformed JWT", "error");
      return;
    }
    try {
      const header = decodePart(parts[0]);
      const payload = decodePart(parts[1]);
      log(`[+] alg=${header.alg}, role=${payload.role}`);
      if (payload.role === "admin" && (header.alg === "none" || header.alg === "None" || !parts[2])) {
        log("[SUCCESS] Forged admin token accepted.", "success");
        apiStatus.textContent = "200";
        apiResponse.textContent = JSON.stringify({ status: "success", role: "admin" }, null, 2);
        flagCard.classList.remove("hidden");
        markLabComplete("weak-jwt");
      } else {
        log("[-] Token rejected.", "error");
        apiStatus.textContent = "401";
      }
    } catch (error) {
      log("[-] Decode failed.", "error");
    }
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    tokenInput.value = sampleToken;
    flagCard.classList.add("hidden");
    apiStatus.textContent = "401";
    apiResponse.textContent = '{"status":"unauthorized"}';
    terminalLogs.innerHTML = '<div class="log-line text-muted">[+] Validator online.</div>';
  });

  document.getElementById("copyBtn").addEventListener("click", () => {
    const flagValue = document.getElementById("flagValue");
    flagValue.select();
    navigator.clipboard.writeText(flagValue.value);
  });
});
