// CyberGuard Labs - Shared lab and category data

const categoriesData = [
  {
    id: "sql-injection",
    title: "SQL Injection",
    description: "Manipulate database queries to bypass authentication, extract hidden records, and learn secure parameter handling."
  },
  {
    id: "xss",
    title: "Cross-Site Scripting (XSS)",
    description: "Probe client-side injection paths, reflected and DOM-based vectors, and learn how output encoding prevents exploitation."
  },
  {
    id: "access-control",
    title: "Access Control",
    description: "Explore broken authorization scenarios with IDOR, cookie tampering, and weak JWT usage in modern web applications."
  }
];

const labsData = [
  {
    id: "sql-injection",
    category: "sql-injection",
    title: "Login Bypass Challenge",
    vulnType: "SQLi",
    difficulty: "easy",
    description: "Simulate an unparameterized database query. Inject payloads to bypass login checks and retrieve the admin flag.",
    docPath: "docs/sql-injection-guide.pdf",
    labPath: "labs/sql-injection/index.html"
  },
  {
    id: "union-sqli",
    category: "sql-injection",
    title: "Union-Based SQLi",
    vulnType: "SQLi",
    difficulty: "medium",
    description: "Use UNION payloads to merge attacker-controlled data with query results and uncover hidden table values.",
    docPath: "#",
    labPath: "labs/union-sqli/index.html"
  },
  {
    id: "blind-sqli",
    category: "sql-injection",
    title: "Blind SQLi",
    vulnType: "SQLi",
    difficulty: "hard",
    description: "Extract sensitive values without direct query output by observing boolean responses and timing behavior.",
    docPath: "#",
    labPath: "labs/blind-sqli/index.html"
  },
  {
    id: "reflected-xss",
    category: "xss",
    title: "Reflected XSS Sandbox",
    vulnType: "XSS",
    difficulty: "easy",
    description: "Inject reflected script payloads into the page and learn how browsers execute unsafe user input.",
    docPath: "docs/reflected-xss-guide.pdf",
    labPath: "labs/reflected-xss/index.html"
  },
  {
    id: "stored-xss",
    category: "xss",
    title: "Stored XSS Guestbook",
    vulnType: "XSS",
    difficulty: "medium",
    description: "Persist malicious input in the application and watch how stored payloads execute for future visitors.",
    docPath: "#",
    labPath: "labs/stored-xss/index.html"
  },
  {
    id: "dom-xss",
    category: "xss",
    title: "DOM XSS Playground",
    vulnType: "XSS",
    difficulty: "hard",
    description: "Explore DOM-based cross-site scripting by targeting insecure client-side JavaScript transformations.",
    docPath: "#",
    labPath: "labs/dom-xss/index.html"
  },
  {
    id: "idor",
    category: "access-control",
    title: "IDOR Profile Console",
    vulnType: "IDOR",
    difficulty: "medium",
    description: "Manipulate object identifiers to access unauthorized profiles, confidential data, and hidden controls.",
    docPath: "docs/idor-guide.pdf",
    labPath: "labs/idor/index.html"
  },
  {
    id: "cookie-tampering",
    category: "access-control",
    title: "Cookie Tampering",
    vulnType: "Auth",
    difficulty: "easy",
    description: "Modify client-side authentication cookies to escalate privileges and bypass access controls.",
    docPath: "#",
    labPath: "labs/cookie-tampering/index.html"
  },
  {
    id: "weak-jwt",
    category: "access-control",
    title: "Weak JWT",
    vulnType: "Auth",
    difficulty: "hard",
    description: "Exploit poorly configured JSON Web Tokens and learn how token signing protects authorization.",
    docPath: "#",
    labPath: "labs/weak-jwt/index.html"
  }
];

function getCategoryTitle(categoryId) {
  const category = categoriesData.find((item) => item.id === categoryId);
  return category ? category.title : categoryId;
}
