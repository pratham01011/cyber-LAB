// IDOR Sandbox Simulation Logic

const mockDatabase = {
  "1001": {
    id: 1001,
    name: "Jane Doe",
    role: "System Auditor",
    email: "jane.doe@corp.local",
    privileges: "Audit Access"
  },
  "1002": {
    id: 1002,
    name: "Marcus Vance",
    role: "Support Technician",
    email: "marcus.vance@corp.local",
    privileges: "Customer Tickets"
  },
  "1003": {
    id: 1003,
    name: "Clara Oswald",
    role: "Lead Developer",
    email: "clara.oswald@corp.local",
    privileges: "Source Code Repo"
  },
  "1337": {
    id: 1337,
    name: "Root Administrator",
    role: "Super Admin",
    email: "admin@corp.local",
    privileges: "Root Control Panel Access",
    flag: "flag{idor_admin_profile_compromised}"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const userIdParam = document.getElementById("userIdParam");
  const sendApiRequestBtn = document.getElementById("sendApiRequestBtn");
  const resetLabBtn = document.getElementById("resetLabBtn");
  
  const employeeCard = document.getElementById("employeeCard");
  const avatarImage = document.getElementById("avatarImage");
  const profileName = document.getElementById("profileName");
  const profileRole = document.getElementById("profileRole");
  const profileId = document.getElementById("profileId");
  const profileEmail = document.getElementById("profileEmail");
  const profilePrivs = document.getElementById("profilePrivs");

  const liveJsonResponse = document.getElementById("liveJsonResponse");
  const apiStatus = document.getElementById("apiStatus");
  const terminalLogs = document.getElementById("terminalLogs");
  const flagDisplayCard = document.getElementById("flagDisplayCard");

  const flagValue = document.getElementById("flagValue");
  const copyFlagBtn = document.getElementById("copyFlagBtn");
  const idorHintToggleBtn = document.getElementById("idorHintToggleBtn");
  const idorHint = document.getElementById("idorHint");

  // Initial load
  fetchProfileData(1001);

  // 1. Listen to Send button and Enter key inside inputs
  sendApiRequestBtn.addEventListener("click", () => {
    const id = parseInt(userIdParam.value);
    fetchProfileData(id);
  });

  userIdParam.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const id = parseInt(userIdParam.value);
      fetchProfileData(id);
    }
  });

  if (idorHintToggleBtn && idorHint) {
    idorHintToggleBtn.addEventListener("click", () => {
      const hidden = idorHint.classList.toggle("hidden");
      idorHintToggleBtn.textContent = hidden ? "Show Hint" : "Hide Hint";
    });
  }

  function fetchProfileData(id) {
    if (!id || id <= 0) {
      addLogLine("[-] API Request aborted: Invalid User ID format.", "error");
      return;
    }

    addLogLine(`[+] HTTP GET /api/v1/users/${id}`);
    addLogLine(`[+] Routing REST request to users table index...`);

    // Lock parameter during short simulated lag
    userIdParam.disabled = true;
    sendApiRequestBtn.disabled = true;

    setTimeout(() => {
      const record = mockDatabase[id.toString()];

      if (record) {
        // SUCCESS RENDER
        addLogLine(`[+] Record found! Preparing client-side payload...`);
        
        // Update Code Box formatted as pretty JSON
        liveJsonResponse.textContent = JSON.stringify({
          status: "success",
          data: record
        }, null, 2);

        // Update card parameters
        profileName.textContent = record.name;
        profileRole.textContent = record.role;
        profileId.textContent = record.id;
        profileEmail.textContent = record.email;
        profilePrivs.textContent = record.privileges;

        // Custom style upgrades for admin bypass
        if (id === 1337) {
          avatarImage.textContent = "👑";
          employeeCard.classList.add("glow-admin");
          
          addLogLine(`[!] WARNING: Security mismatch! Administrative credentials retrieved without authorization.`, "warning");
          addLogLine(`[SUCCESS] IDOR vulnerability confirmed. Captured flag!`, "success");

          flagDisplayCard.classList.remove("hidden");
          markLabComplete("idor");
        } else {
          avatarImage.textContent = "👤";
          employeeCard.classList.remove("glow-admin");
          flagDisplayCard.classList.add("hidden");
        }

        apiStatus.textContent = "200 OK";
        apiStatus.className = "pulse-indicator success";

      } else {
        // ERROR RENDER (404)
        addLogLine(`[-] Error: ID index record "${id}" not found in database registry.`, "error");

        liveJsonResponse.textContent = JSON.stringify({
          status: "error",
          message: "User not found"
        }, null, 2);

        // Clear display card fields
        profileName.textContent = "Record Not Found";
        profileRole.textContent = "N/A";
        profileId.textContent = id;
        profileEmail.textContent = "N/A";
        profilePrivs.textContent = "N/A";
        avatarImage.textContent = "❌";
        
        employeeCard.classList.remove("glow-admin");
        flagDisplayCard.classList.add("hidden");

        apiStatus.textContent = "404 Not Found";
        apiStatus.className = "pulse-indicator error";
      }

      // Unlock parameters
      userIdParam.disabled = false;
      sendApiRequestBtn.disabled = false;
    }, 400);
  }

  // Helper: Append line to Terminal
  function addLogLine(text, type = "") {
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.innerHTML = text;
    terminalLogs.appendChild(line);
    terminalLogs.scrollTop = terminalLogs.scrollHeight;
  }

  // 2. Reset sandbox console state
  resetLabBtn.addEventListener("click", () => {
    userIdParam.value = "1001";
    
    terminalLogs.innerHTML = `
      <div class="log-line text-muted">[+] REST Router established at https://api.corp.local/</div>
      <div class="log-line text-muted">[+] Current authorized session mapping active: [token_user_1001]</div>
    `;

    fetchProfileData(1001);
  });

  // 3. Clipboard copy action
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
        console.error("Failed to copy IDOR flag text: ", err);
      });
  });
});
