<?php
// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'portfolio_contacts';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8
$conn->set_charset("utf8");

// Get form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validate input
$response = array('success' => false, 'message' => '');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    $response['message'] = 'Please fill in all required fields.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'Please enter a valid email address.';
} else {
    // Prepare and bind statement
    $stmt = $conn->prepare("INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
    
    if ($stmt === false) {
        $response['message'] = 'Database error: ' . $conn->error;
    } else {
        $stmt->bind_param("ssss", $name, $email, $subject, $message);
        
        // Execute the statement
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Thank you for your message! I will get back to you soon.';
            
            // Optional: Send email notification
            $to = 'gadhiyasavan1@gmail.com';
            $email_subject = 'New Contact Message from Portfolio: ' . $subject;
            $email_body = "You have received a new message from your portfolio website:\n\n";
            $email_body .= "Name: $name\n";
            $email_body .= "Email: $email\n";
            $email_body .= "Subject: $subject\n";
            $email_body .= "Message: $message\n";
            
            $headers = "From: $email\r\n";
            $headers .= "Reply-To: $email\r\n";
            
            // Uncomment below to actually send email
            // mail($to, $email_subject, $email_body, $headers);
            
        } else {
            $response['message'] = 'Error saving message: ' . $stmt->error;
        }
        
        $stmt->close();
    }
}

$conn->close();

// Return JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
