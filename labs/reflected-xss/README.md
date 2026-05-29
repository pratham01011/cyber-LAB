# Lab: Reflected Cross-Site Scripting (XSS)

### Difficulty: Easy
### Vulnerability Type: Cross-Site Scripting (XSS)

---

## Overview
Cross-Site Scripting (XSS) occurs when a web application accepts input from a client request and reflects that data back to the user's browser in an insecure manner, causing the browser to execute client-side scripts injected by an attacker. 

* **Reflected XSS**: The malicious script is part of the request sent to the server (e.g. as search query parameters) and is reflected immediately in the response DOM structure.

---

## Lab Objective
The search portal reflects user query inputs onto the webpage using unescaped handlers:

```javascript
resultsOutput.innerHTML = "<p>Search results for: <span>" + userInput + "</span></p>";
```

Your objective is to craft an input payload containing executable JavaScript that runs an `alert()` dialog in the browser context to capture the flag.

---

## Walkthrough

1. **Test basic input reflection**: Search a standard query such as `test` in the input field. Note how it prints in the results box and is highlighted in red inside the **Live DOM Source Inspector**.
2. **Understand browser constraints**: HTML5 specifications naturally block `<script>` tags injected via dynamic `innerHTML` properties to protect basic browser contexts. Therefore, simply typing `<script>alert(1)</script>` will be blocked by standard browser renders.
3. **Use event handlers to execute**: You can bypass this restriction by using elements that run script triggers inside native browser events (like `onload`, `onerror`, `onclick`). Enter:
   ```html
   <img src=x onerror="alert('XSS')">
   ```
   Or utilize an SVG element:
   ```html
   <svg onload="alert(1)">
   ```
4. **Trigger XSS Execution**: Submit your query. The browser loads the custom image, encounters the invalid source `x`, immediately calls the `onerror` event callback handler, and triggers the `alert()` block.
5. **Collect Flag**: The sandbox intercepts the alert, prints log validations in the console terminal, and displays the custom neon modal revealing the flag:
   ```txt
   flag{reflected_xss_solved}
   ```

---

## Defensive Remediations

To fully prevent XSS, all user input reflected in web documents must be sanitized or properly HTML-escaped.

1. **Context-Aware Output Escaping**: Before printing variables inside HTML templates, escape special characters to their corresponding safe HTML entities:
   - `<` becomes `&lt;`
   - `>` becomes `&gt;`
   - `"` becomes `&quot;`
   - `'` becomes `&#x27;`
   - `&` becomes `&amp;`
2. **Use safe APIs**: In Vanilla JavaScript, prefer assigning texts via `.textContent` or `.innerText` instead of `.innerHTML`. This forces browsers to treat variables purely as static literal text strings, rendering HTML tags as visible text instead of active executable DOM nodes.
3. **Content Security Policy (CSP)**: Establish strict CSP HTTP headers restricting script origins and blocking unsafe inline execution strings (`'unsafe-inline'`).
