<?php
session_start();

// Clear session
session_unset();
session_destroy();

// Clear cookies
setcookie('user', '', time() - 3600, '/');
setcookie('admin', '', time() - 3600, '/');

// Redirect to login page
header("Location: index.php");
exit; 