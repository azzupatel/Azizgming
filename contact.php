<?php
require('cn.php');
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize and get the form inputs
    $name = mysqli_real_escape_string($conn, $_POST['Name']);
    $email = mysqli_real_escape_string($conn, $_POST['Email']);
    $phone = mysqli_real_escape_string($conn, $_POST['Phone']);
    $message = mysqli_real_escape_string($conn, $_POST['Message']);

    // SQL query to insert data into the database
    $sql = "INSERT INTO contact_data (name, email, phone, message)
            VALUES ('$name', '$email', '$phone', '$message')";

    // Execute the query
    if ($conn->query($sql) === TRUE) {
        echo "<script>alert('Message sent successfully!'); window.location.href = 'index.html';</script>";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Close the database connection
    $conn->close();
}
?>
