document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const sqlInput = document.getElementById("sqlInput");
  const terminalLogs = document.getElementById("terminalLogs");
  const resultsTable = document.getElementById("resultsTable");
  const flagCard = document.getElementById("flagCard");
  const queryStatus = document.getElementById("queryStatus");
  const hintBtn = document.getElementById("hintBtn");
  const hintBox = document.getElementById("hintBox");
  const LAB_FLAG = "flag{union_sqli_data_extracted}";
  const products = [
    { name: "CyberDesk Pro", price: "$299" },
    { name: "Neon Keyboard", price: "$149" }
  ];

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

  function renderResults(rows) {
    resultsTable.innerHTML = rows.map((row) => `<p><strong>${row.name}</strong> ù ${row.price}</p>`).join("");
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = searchInput.value || "";
    sqlInput.textContent = input;
    log(`[+] Executing lookup for "${input}"`);

    if (/union\s+select/i.test(input) && /secret/i.test(input)) {
      renderResults([{ name: LAB_FLAG, price: "EXFILTRATED" }]);
      queryStatus.textContent = "UNION";
      log("[SUCCESS] Secret extracted via UNION SELECT.", "success");
      flagCard.classList.remove("hidden");
      markLabComplete("union-sqli");
        markLabComplete("union-sqli");
      return;
    }

    if (/union\s+select/i.test(input)) {
      renderResults([{ name: "(empty union)", price: "ù" }]);
      log("[-] UNION ran but secrets table not referenced.", "error");
      flagCard.classList.add("hidden");
      return;
    }

    const term = input.split("'")[0].toLowerCase();
    const matches = products.filter((p) => p.name.toLowerCase().includes(term));
    renderResults(matches.length ? matches : [{ name: "No results", price: "ù" }]);
    flagCard.classList.add("hidden");
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    searchInput.value = "";
    sqlInput.textContent = "";
    resultsTable.innerHTML = "";
    flagCard.classList.add("hidden");
    terminalLogs.innerHTML = '<div class="log-line text-muted">[+] Inventory database online.</div>';
  });

  document.getElementById("copyBtn").addEventListener("click", () => {
    const flagValue = document.getElementById("flagValue");
    flagValue.select();
    navigator.clipboard.writeText(flagValue.value);
  });
});
