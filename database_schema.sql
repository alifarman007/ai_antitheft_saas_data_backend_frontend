-- AI Face Recognition SaaS Database Schema
-- PostgreSQL Database Schema

-- Drop tables if they exist (for development)
DROP TABLE IF EXISTS detection_logs CASCADE;
DROP TABLE IF EXISTS registered_faces CASCADE; 
DROP TABLE IF EXISTS cameras CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS packages CASCADE;

-- Create packages table for subscription plans
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    period VARCHAR(20) NOT NULL DEFAULT 'monthly',
    description TEXT,
    features JSONB,
    camera_limit INTEGER,
    max_registered_faces INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    package_id INTEGER REFERENCES packages(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_sessions table for authentication
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cameras table
CREATE TABLE cameras (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    camera_name VARCHAR(255) NOT NULL,
    camera_brand VARCHAR(100),
    camera_type VARCHAR(20) CHECK (camera_type IN ('ip_camera', 'webcam')) NOT NULL,
    ip_address INET,
    port INTEGER CHECK (port >= 1 AND port <= 65535),
    username VARCHAR(255),
    password_hash VARCHAR(255),
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'disabled')),
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ip_camera_requires_network CHECK (
        (camera_type = 'webcam') OR 
        (camera_type = 'ip_camera' AND ip_address IS NOT NULL AND port IS NOT NULL)
    )
);

-- Create registered_faces table
CREATE TABLE registered_faces (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    face_name VARCHAR(255) NOT NULL,
    face_image_path VARCHAR(500),
    face_encoding BYTEA,  -- Store face encoding for recognition
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create detection_logs table
CREATE TABLE detection_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    camera_id INTEGER REFERENCES cameras(id) ON DELETE CASCADE,
    registered_face_id INTEGER REFERENCES registered_faces(id) ON DELETE SET NULL,
    detection_confidence DECIMAL(5,4),
    detection_image_path VARCHAR(500),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_package_id ON users(package_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_cameras_user_id ON cameras(user_id);
CREATE INDEX idx_cameras_status ON cameras(status);
CREATE INDEX idx_registered_faces_user_id ON registered_faces(user_id);
CREATE INDEX idx_registered_faces_name ON registered_faces(face_name);
CREATE INDEX idx_detection_logs_user_id ON detection_logs(user_id);
CREATE INDEX idx_detection_logs_camera_id ON detection_logs(camera_id);
CREATE INDEX idx_detection_logs_detected_at ON detection_logs(detected_at);

-- Insert default packages
INSERT INTO packages (name, price, period, description, features, camera_limit, max_registered_faces) VALUES 
(
    'Basic', 
    100.00, 
    'monthly',
    'Perfect for home security with webcam support',
    '["Webcam support included", "Up to 50 registered faces", "Instant email notifications", "Basic dashboard access", "Email support", "Standard recognition accuracy", "30-day data retention"]'::jsonb,
    1,
    50
),
(
    'Standard', 
    500.00, 
    'monthly',
    'Ideal for small businesses with 1 professional camera',
    '["1 professional camera connection", "Up to 200 registered faces", "Instant email notifications", "Advanced dashboard", "Priority email support", "High accuracy recognition", "60-day data retention", "Real-time alerts", "Custom notification settings"]'::jsonb,
    1,
    200
),
(
    'Premium', 
    1400.00, 
    'monthly',
    'Best for growing businesses with 2 professional cameras',
    '["2 professional camera connections", "Unlimited registered faces", "Instant email notifications", "Full dashboard access", "24/7 phone & email support", "Premium accuracy recognition", "90-day data retention", "Real-time alerts & notifications", "Advanced analytics", "Custom integrations", "Priority processing"]'::jsonb,
    2,
    -1
);

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cameras_updated_at BEFORE UPDATE ON cameras FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_registered_faces_updated_at BEFORE UPDATE ON registered_faces FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample data for development
INSERT INTO users (email, full_name, phone_number, password_hash, package_id) VALUES 
('arafat.adi@sysnova.com', 'Arafat Hossain Adi', '+1234567890', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqyNjdt.3E4b9DAo47E7DPy', 2);

INSERT INTO cameras (user_id, camera_name, camera_brand, camera_type, ip_address, port, username, password_hash, status) VALUES 
(1, 'Living Room Camera', 'Hikvision', 'ip_camera', '192.168.1.100', 554, 'admin', '$2b$12$password_hash_here', 'active'),
(1, 'Office Entrance', 'Dahua', 'ip_camera', '192.168.1.101', 554, 'admin', '$2b$12$password_hash_here', 'inactive'),
(1, 'Kitchen Monitor', 'TP-Link', 'webcam', NULL, NULL, NULL, NULL, 'active');

INSERT INTO registered_faces (user_id, face_name, face_image_path) VALUES 
(1, 'Alif', '/uploads/faces/alif.jpg'),
(1, 'Arafat', '/uploads/faces/arafat.jpg'),
(1, 'Sanchita', '/uploads/faces/sanchita.jpg'),
(1, 'Riyad', '/uploads/faces/riyad.jpg'),
(1, 'Anika', '/uploads/faces/anika.jpg'),
(1, 'Shushmita', '/uploads/faces/shushmita.jpg'),
(1, 'Rahman', '/uploads/faces/rahman.jpg'),
(1, 'Faiza', '/uploads/faces/faiza.jpg');

INSERT INTO detection_logs (user_id, camera_id, registered_face_id, detection_confidence, detected_at) VALUES 
(1, 1, 1, 0.9834, '2025-01-08 14:32:15'),
(1, 1, 2, 0.9721, '2025-01-08 13:45:22'),
(1, 3, 3, 0.9643, '2025-01-08 12:18:07'),
(1, 2, 4, 0.9512, '2025-01-07 16:22:41'),
(1, 1, 5, 0.9387, '2025-01-07 15:07:33'),
(1, 3, 6, 0.9456, '2025-01-07 11:55:18'),
(1, 1, 7, 0.9234, '2025-01-06 17:40:29'),
(1, 2, 8, 0.9567, '2025-01-06 09:15:52');