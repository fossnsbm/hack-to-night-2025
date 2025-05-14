<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user']) || !isset($_COOKIE['user']) || $_COOKIE['user'] !== 'true') {
    header("Location: index.php");
    exit;
}

// Get the message from POST
$message = $_POST['message'] ?? '';

// Store the message in session (no database for simplicity)
if (!isset($_SESSION['messages'])) {
    $_SESSION['messages'] = [];
}

// Save the message - deliberately NOT sanitizing input to allow XSS
if (!empty($message)) {
    $_SESSION['messages'][] = $message;
}

// Redirect back to dashboard
header("Location: view_messages.php");
exit; 