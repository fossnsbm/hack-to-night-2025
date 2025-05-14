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
    <title>Message Board</title>
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
        .message {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 3px;
            border-left: 4px solid #4CAF50;
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
        .form-container {
            margin-top: 20px;
            padding: 20px;
            background-color: #f0f0f0;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="nav">
            <a href="dashboard.php">Dashboard</a>
            <a href="logout.php">Logout</a>
        </div>
        
        <h1>Message Board</h1>
        
        <div class="messages">
            <?php if (isset($_SESSION['messages']) && count($_SESSION['messages']) > 0): ?>
                <?php foreach ($_SESSION['messages'] as $msg): ?>
                    <div class="message">
                        <?php 
                        // Deliberately output raw message to enable XSS
                        echo $msg; 
                        ?>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No messages yet. Be the first to post!</p>
            <?php endif; ?>
        </div>
        
        <div class="form-container">
            <h3>Post a New Message:</h3>
            <form method="post" action="post_message.php">
                <textarea name="message" style="width: 100%; height: 100px;" placeholder="Type your message here..."></textarea>
                <br><br>
                <button type="submit">Post Message</button>
            </form>
        </div>
    </div>
</body>
</html> 