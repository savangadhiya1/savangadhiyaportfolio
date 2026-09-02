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

// Get messages
$sql = "SELECT * FROM contact_messages ORDER BY created_at DESC";
$result = $conn->query($sql);

// Update message status to 'read' when viewed
if (isset($_GET['mark_read']) && is_numeric($_GET['mark_read'])) {
    $update_sql = "UPDATE contact_messages SET status = 'read' WHERE id = ?";
    $stmt = $conn->prepare($update_sql);
    $stmt->bind_param("i", $_GET['mark_read']);
    $stmt->execute();
    $stmt->close();
    
    // Redirect to remove mark_read parameter
    header("Location: view_messages.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Messages - Admin Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
            border-radius: 10px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
        }

        .stat-label {
            color: #666;
            margin-top: 0.5rem;
        }

        .messages-container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .message-item {
            border-bottom: 1px solid #eee;
            padding: 1.5rem;
            transition: background-color 0.3s ease;
        }

        .message-item:hover {
            background-color: #f8f9fa;
        }

        .message-item.new {
            background-color: #e8f5e8;
            border-left: 4px solid #28a745;
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }

        .message-meta {
            display: flex;
            gap: 2rem;
            align-items: center;
        }

        .message-name {
            font-weight: bold;
            color: #333;
        }

        .message-email {
            color: #667eea;
        }

        .message-date {
            color: #666;
            font-size: 0.9rem;
        }

        .message-subject {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
        }

        .message-content {
            color: #555;
            line-height: 1.6;
        }

        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }

        .status-new {
            background-color: #28a745;
            color: white;
        }

        .status-read {
            background-color: #6c757d;
            color: white;
        }

        .status-replied {
            background-color: #007bff;
            color: white;
        }

        .no-messages {
            text-align: center;
            padding: 3rem;
            color: #666;
        }

        .back-link {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 5px;
            margin-bottom: 1rem;
            transition: background-color 0.3s ease;
        }

        .back-link:hover {
            background-color: #5a6fd8;
        }

        @media (max-width: 768px) {
            .message-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .message-meta {
                flex-direction: column;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Contact Messages Admin</h1>
            <p>Manage messages from your portfolio website</p>
        </div>

        <a href="../demo/" class="back-link">← Back to Portfolio</a>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">
                    <?php 
                    $total_result = $conn->query("SELECT COUNT(*) as total FROM contact_messages");
                    $total_row = $total_result->fetch_assoc();
                    echo $total_row['total'];
                    ?>
                </div>
                <div class="stat-label">Total Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">
                    <?php 
                    $new_result = $conn->query("SELECT COUNT(*) as new_count FROM contact_messages WHERE status = 'new'");
                    $new_row = $new_result->fetch_assoc();
                    echo $new_row['new_count'];
                    ?>
                </div>
                <div class="stat-label">New Messages</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">
                    <?php 
                    $read_result = $conn->query("SELECT COUNT(*) as read_count FROM contact_messages WHERE status = 'read'");
                    $read_row = $read_result->fetch_assoc();
                    echo $read_row['read_count'];
                    ?>
                </div>
                <div class="stat-label">Read Messages</div>
            </div>
        </div>

        <div class="messages-container">
            <?php
            if ($result && $result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $status_class = $row['status'] == 'new' ? 'new' : '';
                    $status_badge = 'status-' . $row['status'];
                    $status_text = ucfirst($row['status']);
                    
                    echo '<div class="message-item ' . $status_class . '">';
                    echo '<div class="message-header">';
                    echo '<div class="message-meta">';
                    echo '<span class="message-name">' . htmlspecialchars($row['name']) . '</span>';
                    echo '<span class="message-email">' . htmlspecialchars($row['email']) . '</span>';
                    echo '<span class="message-date">' . date('M j, Y g:i A', strtotime($row['created_at'])) . '</span>';
                    echo '</div>';
                    echo '<span class="status-badge ' . $status_badge . '">' . $status_text . '</span>';
                    echo '</div>';
                    echo '<div class="message-subject">' . htmlspecialchars($row['subject']) . '</div>';
                    echo '<div class="message-content">' . nl2br(htmlspecialchars($row['message'])) . '</div>';
                    
                    if ($row['status'] == 'new') {
                        echo '<br><a href="view_messages.php?mark_read=' . $row['id'] . '" style="color: #667eea; text-decoration: none;">Mark as read</a>';
                    }
                    
                    echo '</div>';
                }
            } else {
                echo '<div class="no-messages">';
                echo '<h3>No messages yet</h3>';
                echo '<p>When visitors fill out your contact form, messages will appear here.</p>';
                echo '</div>';
            }
            ?>
        </div>
    </div>

    <?php $conn->close(); ?>
</body>
</html>
