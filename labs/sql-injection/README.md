# Lab: SQL Injection (SQLi) Login Bypass

### Difficulty: Easy
### Vulnerability Type: SQL Injection

---

## Overview
SQL Injection (SQLi) is a classic web security vulnerability that occurs when user input is directly concatenated into a database query string instead of using safe parameterized inputs. This allows input strings to escape their data context, alter query structures, and execute custom database command statements.

---

## Lab Objective
In this lab, the system database administrator portal is guarded by an authentication query. The backend executes a query similar to the following:

```sql
SELECT * FROM users WHERE username = 'USER_INPUT' AND password = 'PASSWORD_INPUT';
```

Your objective is to inject syntactical operators that force this logical query expression to evaluate to **TRUE**, bypassing the authentication structure and retrieving the flag.

---

## Step-by-Step Walkthrough

1. **Analyze the Live Query**: Look at the "Simulated SQL Query" panel. Type letters in the username and password fields to observe how inputs are directly concatenated inside single quotes (`'`).
2. **Inject the Quote Boundary**: In the **Username** field, enter a single quote character (`'`). Notice how the string context breaks, and the visualizer flags a syntax alteration warning.
3. **Formulate the logical bypass**: Type the standard logical bypass:
   ```sql
   ' OR '1'='1
   ```
4. **Submit for Authentication**: Leave the password field blank and click **Authenticate**.
5. **Review the execution logs**: The SQL Engine console processes the input logic step-by-step:
   - The query parses as: `SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '';`
   - Since `'1'='1'` evaluates to **TRUE**, the database returns user entries (usually the first, which is the Administrator).
   - The login evaluates successfully, and the system reveals:
     `flag{login_bypass_success}`

---

## Defensive Countermeasures
The absolute defense against SQL Injection is separating query commands from the input data.

* **Parameterized Queries (Prepared Statements)**: Ensures the database compiler translates the structure of the SQL instructions first, treating incoming arguments strictly as literal variables instead of executable instructions.
* **Stored Procedures**: Use parameterized stored procedures.
* **Principle of Least Privilege**: Give the application database user only the minimal table privileges required.
