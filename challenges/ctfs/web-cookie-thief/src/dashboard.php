<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user']) || !isset($_COOKIE['user']) || $_COOKIE['user'] !== 'true') {
    header("Location: index.php");
    exit;
}

// Create admin cookie but make it HttpOnly for "security"
setcookie('admin', 'true', time() + 3600, '/', '', false, true);
?>

<!DOCTYPE html>
<html>
<head>
    <title>User Dashboard</title>
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
        }
        .message-box {
            background-color: #e9f7ef;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 3px;
        }
        .post {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 3px;
        }
        .post h3 {
            margin-top: 0;
        }
        .vulnerable-area {
            margin-top: 30px;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 3px;
        }
        .logout {
            text-align: right;
        }
        .logout a {
            color: #666;
            text-decoration: none;
        }
        .logout a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logout">
            <a href="logout.php">Logout</a>
        </div>
        
        <h1>Welcome, User!</h1>
        
        <div class="message-box">
            <p>This is your regular user dashboard. Only administrators can access the special content.</p>
        </div>
        
        <div class="post">
            <h3>Company Update</h3>
            <p>We've implemented new security measures. All sensitive cookies are now HttpOnly to prevent XSS attacks.</p>
        </div>
        
        <div class="post">
            <h3>Recent Activity</h3>
            <p>Nothing to report. Check back later for updates.</p>
        </div>
        
        <div class="vulnerable-area">
            <h3>Message Board</h3>
            <p>Post a message to share with others:</p>
            <form method="post" action="post_message.php">
                <textarea name="message" style="width: 100%; height: 100px;"></textarea>
                <br><br>
                <button type="submit">Post Message</button>
            </form>
            
            <div id="messages">
                <h4>Recent Messages:</h4>
                <!-- Messages will appear here -->
            </div>
        </div>
    </div>
</body>
</html> 