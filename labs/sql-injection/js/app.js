// SQL Injection Simulation Logic

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const sqlUserSpan = document.getElementById("sqlUser");
  const sqlPassSpan = document.getElementById("sqlPass");
  const submitLoginBtn = document.getElementById("submitLoginBtn");
  const loginForm = document.getElementById("vulnerableLoginForm");
  const terminalLogs = document.getElementById("terminalLogs");
  const resetLabBtn = document.getElementById("resetLabBtn");
  const flagDisplayCard = document.getElementById("flagDisplayCard");
  const sqlQueryStatus = document.getElementById("sqlQueryStatus");
  const copyFlagBtn = document.getElementById("copyFlagBtn");
  const flagValue = document.getElementById("flagValue");

  // Initial update
  updateLiveSql();

  // 1. Reactive Live SQL Display
  usernameInput.addEventListener("input", updateLiveSql);
  passwordInput.addEventListener("input", updateLiveSql);

  function updateLiveSql() {
    const userVal = usernameInput.value;
    const passVal = passwordInput.value;

    // Default placeholders if empty
    sqlUserSpan.textContent = userVal || "admin";
    sqlPassSpan.textContent = passVal || "password";

    // Style highlighting for injection hints
    if (userVal.includes("'") || userVal.includes("--")) {
      sqlUserSpan.className = "sql-highlight";
      sqlQueryStatus.textContent = "SYNTAX ALTERED";
      sqlQueryStatus.className = "pulse-indicator";
    } else {
      sqlUserSpan.className = "";
      sqlQueryStatus.textContent = "WAITING";
      sqlQueryStatus.className = "pulse-indicator";
    }

    if (passVal.includes("'") || passVal.includes("--")) {
      sqlPassSpan.className = "sql-highlight";
    } else {
      sqlPassSpan.className = "";
    }
  }

  // 2. Submit Logic & Database Query Simulation
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleAuthentication();
  });

  function handleAuthentication() {
    const userVal = usernameInput.value.trim();
    const passVal = passwordInput.value.trim();

    if (!userVal) {
      addLogLine("[-] Error: Username cannot be blank.", "error");
      return;
    }

    // Lock UI during simulation
    submitLoginBtn.disabled = true;
    usernameInput.disabled = true;
    passwordInput.disabled = true;

    // Reset status and print initial query log
    sqlQueryStatus.textContent = "PROCESSING...";
    sqlQueryStatus.className = "pulse-indicator";
    
    addLogLine(`[+] Intercepted auth request: USER="${userVal}" PASS="${passVal.replace(/./g, '*')}"`);
    
    // Simulate database network lag and query execution steps
    setTimeout(() => {
      addLogLine(`[+] Building SQL command...`);
    }, 300);

    setTimeout(() => {
      const fullQuery = `SELECT * FROM users WHERE username = '${userVal}' AND password = '${passVal}';`;
      addLogLine(`[+] Query sent to database engine:`, "warning");
      addLogLine(`<span style="color: var(--neon-cyan);">${fullQuery}</span>`);
    }, 700);

    // Bypassing check
    const normalizedUser = userVal.toLowerCase();
    const isBypass = 
      normalizedUser.includes("' or ") || 
      normalizedUser.includes("'or ") ||
      normalizedUser.includes("' --") ||
      normalizedUser.includes("'--") ||
      normalizedUser.includes("' #") ||
      normalizedUser.includes("'#");

    if (isBypass) {
      // SUCCESS SIMULATION PATH
      setTimeout(() => {
        addLogLine(`[!] WARNING: Single quote detected. SQL string context broken!`, "warning");
      }, 1200);

      setTimeout(() => {
        addLogLine(`[!] Evaluating logical clause: "OR TRUE" condition detected.`, "warning");
      }, 1800);

      setTimeout(() => {
        addLogLine(`[SUCCESS] SQL constraint successfully bypassed! Returns 1 record (Admin Account).`, "success");
      }, 2300);

      setTimeout(() => {
        addLogLine(`[SUCCESS] Access Granted! Logged in as: ROOT_ADMINISTRATOR.`, "success");
        addLogLine(`[SUCCESS] Captured flag: flag{login_bypass_success}`, "success");
        
        // Show Flag, Set Storage
        localStorage.setItem("flag{login_bypass_success}", "true");
        flagDisplayCard.classList.remove("hidden");
        
        sqlQueryStatus.textContent = "AUTHORIZED";
        sqlQueryStatus.className = "pulse-indicator success";

        // Unlock UI
        submitLoginBtn.disabled = false;
        usernameInput.disabled = false;
        passwordInput.disabled = false;
      }, 2800);

    } else {
      // FAILURE PATH
      setTimeout(() => {
        addLogLine(`[+] Query processed by database engine...`);
      }, 1200);

      setTimeout(() => {
        addLogLine(`[-] Error: Invalid credentials. No matching username and password pairs found.`, "error");
        
        sqlQueryStatus.textContent = "DENIED";
        sqlQueryStatus.className = "pulse-indicator error";

        // Unlock UI
        submitLoginBtn.disabled = false;
        usernameInput.disabled = false;
        passwordInput.disabled = false;
      }, 1800);
    }
  }

  // Helper: Append line to mock Terminal
  function addLogLine(text, type = "") {
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.innerHTML = text;
    terminalLogs.appendChild(line);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  // 3. Reset Sandbox State
  resetLabBtn.addEventListener("click", () => {
    usernameInput.value = "";
    passwordInput.value = "";
    usernameInput.disabled = false;
    passwordInput.disabled = false;
    submitLoginBtn.disabled = false;

    // Reset log box
    terminalLogs.innerHTML = `
      <div class="log-line text-muted">[+] Database engine initialized. Standing by...</div>
      <div class="log-line text-muted">[+] Ready to intercept authentications.</div>
    `;

    // Hide flag
    flagDisplayCard.classList.add("hidden");

    // Reset SQL spans
    updateLiveSql();
  });

  // 4. Clipboard Copy
  copyFlagBtn.addEventListener("click", () => {
    flagValue.select();
    flagValue.setSelectionRange(0, 99999); // Mobile
    
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
        console.error("Failed to copy text: ", err);
      });
  });
});
