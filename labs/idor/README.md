# Lab: Insecure Direct Object Reference (IDOR)

### Difficulty: Medium
### Vulnerability Type: Broken Access Control

---

## Overview
**Insecure Direct Object Reference (IDOR)** is a type of access control vulnerability that occurs when a web application uses user-supplied input to access database records or files directly, without verifying if the user has authorization to access the requested resource. 

Typically, this occurs when database keys, file paths, or internal indices are exposed in query parameters (such as URLs) and can be altered by simply modifying the variables.

---

## Lab Objective
In this secure employee console, users fetch profile card records by sending an API lookup containing direct user ID integers:

```txt
GET /api/v1/users/1001
```

You are logged in as employee **Jane Doe (ID: 1001)**. The server fetches whatever ID is queried in the address bar without evaluating permissions. Your goal is to bypass access boundaries by swapping query indicators to locate and compromise the Super Administrator profile record.

---

## Walkthrough

1. **Observe API behavior**: Send request queries for the default active index: `1001`. Observe the **API Server JSON Response** reflecting Jane Doe's profile records in structured text, and the **Rendered Profile Card** below.
2. **Scan sequential references**: Test logical sequential profiles. Try inputting User ID `1002` or `1003` inside the address bar and click **Send**. Note how the API returns Marcus Vance and Clara Oswald's records seamlessly! This proves sequential profile indexes are readable globally.
3. **Target administrative structures**: Hackers seek privilege escalation by targeting admin accounts. In standard indexing tables, admins might reside at low indexes (like `1` or `2`), or high specialized offsets (like `9999` or `1337`). 
4. **Trigger IDOR access breach**: Input the value:
   ```txt
   1337
   ```
   Click **Send**.
5. **Analyze administration responses**: The database successfully resolves ID `1337` to the **Super Administrator** employee, returning raw profile metadata containing the capture flag inside the JSON payload:
   ```txt
   flag{idor_admin_profile_compromised}
   ```
   The interactive card glows gold, proving root-level administrative database exfiltration.

---

## Defensive Remediations
IDOR is entirely prevented by implementing context-aware authorization mappings on every transaction.

1. **Access Control Checks**: Never rely strictly on the queried index. Ensure the session token validation validates that the logged-in user possesses valid rights to read/write the requested direct object.
2. **Indirect Object Reference Maps**: Instead of exposing direct numeric primary database keys (e.g. `/users/1001`), map indexes to temporary, session-specific randomized hashes (e.g. `/users/a8f3d1`).
3. **Cryptographically Secure Random Identifiers (UUIDs)**: Use complex, high-entropy non-sequential string keys (like UUIDv4) for resources so attackers cannot guess or scrape sequential objects easily.
