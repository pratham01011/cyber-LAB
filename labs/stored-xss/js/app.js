document.addEventListener("DOMContentLoaded", () => {
  const guestbookForm = document.getElementById("guestbookForm");
  const guestName = document.getElementById("guestName");
  const guestMessage = document.getElementById("guestMessage");
  const guestbookEntries = document.getElementById("guestbookEntries");
  const terminalLogs = document.getElementById("terminalLogs");
  const flagOverlay = document.getElementById("flagOverlay");
  const hintBtn = document.getElementById("hintBtn");
  const hintBox = document.getElementById("hintBox");
  let entries = [{ name: "System", message: "Welcome!" }];

  window.alert = () => {
    log("[SUCCESS] Stored payload executed.", "success");
    flagOverlay.classList.remove("hidden");
    markLabComplete("stored-xss");
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

  function renderEntries() {
    guestbookEntries.innerHTML = entries.map((e) => `<div style="margin-bottom:12px;"><strong>${e.name}:</strong> ${e.message}</div>`).join("");
    entries.forEach((entry) => {
      const match = entry.message.match(/<script>([\s\S]*?)<\/script>/i);
      if (match) new Function(match[1])();
    });
  }

  guestbookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!guestMessage.value.trim()) return;
    entries.push({ name: guestName.value.trim() || "Anonymous", message: guestMessage.value });
    log("[+] Entry stored and rendered with innerHTML.", "warning");
    guestName.value = "";
    guestMessage.value = "";
    renderEntries();
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    entries = [{ name: "System", message: "Welcome!" }];
    renderEntries();
    flagOverlay.classList.add("hidden");
    terminalLogs.innerHTML = '<div class="log-line text-muted">[+] Guestbook ready.</div>';
  });

  document.getElementById("closeBtn").addEventListener("click", () => flagOverlay.classList.add("hidden"));
  document.getElementById("copyBtn").addEventListener("click", () => {
    const flagValue = document.getElementById("flagValue");
    flagValue.select();
    navigator.clipboard.writeText(flagValue.value);
  });

  renderEntries();
});
