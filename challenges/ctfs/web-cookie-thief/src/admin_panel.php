<?php
session_start();

// Check if admin cookie is set
if (!isset($_COOKIE['admin']) || $_COOKIE['admin'] !== 'true') {
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Panel</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }
        .flag-container {
            background-color: #f2dede;
            color: #a94442;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
            text-align: center;
            font-family: monospace;
            font-size: 18px;
            border: 1px solid #ebccd1;
        }
        .nav {
            margin-bottom: 20px;
            text-align: right;
        }
        .nav a {
            color: #666;
            text-decoration: none;
            margin-left: 15px;
        }
        .nav a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav">
            <a href="logout.php">Logout</a>
        </div>
        
        <h1>Admin Panel</h1>
        
        <p>Welcome to the admin panel! You've successfully gained admin access.</p>
        
        <div class="flag-container">
            Congratulations! Here's your flag: flag{c00k13_th3ft_1s_t00_3asy}
        </div>
        
        <p>This challenge demonstrates a common web vulnerability: Cross-Site Scripting (XSS) combined with a lack of protection against cookie theft.</p>
        
        <p>The vulnerability was in the message board where user input was not sanitized before being displayed on the page. This allowed an attacker to inject JavaScript code that could steal the admin cookie and send it to their own server.</p>
        
        <p>Even though the admin cookie was set with the HttpOnly flag, you were able to capture the cookie before it was set by using JavaScript to create your own cookie with the same name.</p>
    </div>
</body>
</html> 