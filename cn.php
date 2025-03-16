<?php
// db_connect.php

// Database credentials
$servername = "localhost"; // Database host (typically "localhost")
$username = "root";        // Your MySQL username
$password = "";            // Your MySQL password
$dbname = "contact_form_db"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
