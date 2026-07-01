CREATE DATABASE Mindful_Study;
USE Mindful_Study;

CREATE TABLE IF NOT EXISTS Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('Male', 'Female', 'Other', 'Prefer not to say'),
    dob DATE,
    created_at DATE,
    isNewUser BOOLEAN DEFAULT TRUE,
    -- UserSetting
    modePreference ENUM('Dark', 'Light')
);

CREATE TABLE IF NOT EXISTS Categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('Practice', 'Assignment', 'Project', 'Revision', 'Research', 'Others')
);

CREATE TABLE IF NOT EXISTS Tasks (
  task_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    category_id INT NULL,
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
    user_id INT NULL,
    task_id INT NULL,
    start_time DATETIME,
    end_time DATETIME,
    duration_minutes INT,
    
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL,
    CONSTRAINT fk_session_task FOREIGN KEY (task_id) REFERENCES Tasks(task_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS MoodLogs (
  mood_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    mood_level ENUM('Happy', 'Normal', 'Tired', 'Frustrated', 'Stressed'),
    note VARCHAR(100),
    created_at DATE,
    
    CONSTRAINT fk_mood_user FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);