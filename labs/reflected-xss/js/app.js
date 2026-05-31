// Reflected XSS Sandbox Simulation Logic

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("xssSearchForm");
  const searchQuery = document.getElementById("searchQuery");
  const resultsOutput = document.getElementById("resultsOutput");
  const domHighlightedQuery = document.getElementById("domHighlightedQuery");
  const terminalLogs = document.getElementById("terminalLogs");
  const resetLabBtn = document.getElementById("resetLabBtn");
  
  const xssAlertOverlay = document.getElementById("xssAlertOverlay");
  const alertPayloadText = document.getElementById("alertPayloadText");
  const flagValue = document.getElementById("flagValue");
  const copyFlagBtn = document.getElementById("copyFlagBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const domStatus = document.getElementById("domStatus");
  const xssHintToggleBtn = document.getElementById("xssHintToggleBtn");
  const xssHint = document.getElementById("xssHint");

  // Initial state helper
  const originalAlert = window.alert;

  // Hint toggle for XSS lab
  if (xssHintToggleBtn && xssHint) {
    xssHintToggleBtn.addEventListener("click", () => {
      const hidden = xssHint.classList.toggle("hidden");
      xssHintToggleBtn.textContent = hidden ? "Show Hint" : "Hide Hint";
    });
  }

  // Intercept window.alert inside our scope
  window.alert = function (message) {
    triggerXssSolved(message);
  };

  // 1. Submit query and reflect
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchQuery.value;

    if (!query.trim()) {
      addLogLine("[-] Lookup cancelled: Empty query field.", "error");
      return;
    }

    addLogLine(`[+] Search query received: "${query}"`);
    addLogLine(`[+] DOM Update: Writing query raw to innerHTML results block...`);

    // Reflect raw unescaped string inside DOM (vulnerable innerHTML)
    resultsOutput.innerHTML = `<p>Search results for: <span class="user-query">${query}</span></p>`;

    // Update Live DOM Source Viewer (escapes HTML so the user sees the source literal text tags!)
    domHighlightedQuery.textContent = query;
    
    addLogLine(`[!] WARNING: Unescaped string injected. DOM parser re-parsing nodes...`, "warning");

    // Check for inline script tags and execute them explicitly since innerHTML naturally blocks standard <script> execution
    checkForScriptTags(query);
  });

  function checkForScriptTags(input) {
    if (input.includes("<script>")) {
      const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
      let match;
      while ((match = scriptRegex.exec(input)) !== null) {
        const scriptBody = match[1];
        addLogLine(`[!] DOM Parser: Script block extracted. Forcing execution context...`, "warning");
        try {
          setTimeout(() => {
            // Evaluate script code
            const runner = new Function(scriptBody);
            runner();
          }, 200);
        } catch (err) {
          addLogLine(`[-] DOM Execution Error: ${err.message}`, "error");
          domStatus.textContent = "SYNTAX ERROR";
          domStatus.className = "pulse-indicator error";
        }
      }
    }
  }

  // 2. Intercept and Solved Trigger
  function triggerXssSolved(payloadMsg) {
    addLogLine(`[!] CRITICAL: window.alert() triggered inside document sandbox!`, "warning");
    addLogLine(`[SUCCESS] Reflected XSS verified. Session token security bypassed.`, "success");
    addLogLine(`[SUCCESS] Captured Flag: flag{reflected_xss_solved}`, "success");

    domStatus.textContent = "COMPROMISED";
    domStatus.className = "pulse-indicator error";

    // Set local storage
    localStorage.setItem("lab.reflected-xss.solved", "true");

    // Reveal Neon Flag Modal
    alertPayloadText.innerHTML = `Vulnerability triggered via active dialog alert verification message:<br/><code class="neon-code" style="color: var(--neon-pink); display: inline-block; margin-top: 8px;">alert(${payloadMsg || ''})</code>`;
    xssAlertOverlay.classList.remove("hidden");
  }

  // Helper: Append line to Terminal
  function addLogLine(text, type = "") {
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.innerHTML = text;
    terminalLogs.appendChild(line);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  // 3. Reset Sandbox state
  resetLabBtn.addEventListener("click", () => {
    searchQuery.value = "";
    resultsOutput.innerHTML = `<p class="placeholder-text">Enter a query to search the catalogue records.</p>`;
    domHighlightedQuery.textContent = "";
    
    terminalLogs.innerHTML = `
      <div class="log-line text-muted">[+] DOM parsing engine mounted. Ready.</div>
      <div class="log-line text-muted">[+] Document catalog active.</div>
    `;

    domStatus.textContent = "HEALTHY";
    domStatus.className = "pulse-indicator success";

    xssAlertOverlay.classList.add("hidden");
  });

  // 4. Modal actions
  closeModalBtn.addEventListener("click", () => {
    xssAlertOverlay.classList.add("hidden");
  });

  copyFlagBtn.addEventListener("click", () => {
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
