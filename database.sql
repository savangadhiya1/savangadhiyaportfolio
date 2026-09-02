-- Create database for portfolio contact messages
CREATE DATABASE IF NOT EXISTS portfolio_contacts;

USE portfolio_contacts;

-- Create table for contact messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'read', 'replied') DEFAULT 'new'
);

-- Insert sample data (optional)
-- INSERT INTO contact_messages (name, email, subject, message) 
-- VALUES ('Test User', 'test@example.com', 'Test Subject', 'This is a test message.');
