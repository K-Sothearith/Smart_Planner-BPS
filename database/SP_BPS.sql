CREATE DATABASE SP_BPS;
USE SP_BPS;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(255) NOT NULL,
    role ENUM('Student', 'Teacher', 'Others'),
    created_at DATE
);

CREATE TABLE IF NOT EXISTS Categories (
	category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30),
    color VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Tasks (
	task_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    category_id INT,
    title VARCHAR(50),
    description VARCHAR(150),
    priority ENUM('High', 'Medium', 'Low'),
    status ENUM('Done', 'Undone'),
    due_date DATE,
    created_at DATE,
    completed_at DATETIME NULL,
    
	CONSTRAINT fk_task_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_task_category FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS StudySessions (
	session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    task_id INT,
    start_time DATETIME,
    end_time DATETIME,
    duration_minutes INT,
    
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_session_task FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Notifications (
	notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message VARCHAR(150),
    type ENUM('Deadline', 'Reminder', 'Break', 'System'),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATE,
    
    CONSTRAINT fk_noti_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Recommendations (
	recommendation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message VARCHAR(150),
    recommendation_type ENUM('Break', 'Workload', 'Deadline', 'Productivity'),
    created_at date,
    
    constraint fk_recomm_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS MoodLogs (
	mood_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    mood_level ENUM('Happy', 'Normal', 'Tired', 'Frustrated', 'Stressed'),
    note VARCHAR(100),
    created_at DATE,
    
    CONSTRAINT fk_mood_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS UserSettings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    notification_enabled BOOLEAN,
    dark_mode BOOLEAN,

    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);