<?php
session_start();

echo("Logout");

// destroy session data
session_unset();
session_destroy();

// redirect to index page
header("Location: index.php");
exit();