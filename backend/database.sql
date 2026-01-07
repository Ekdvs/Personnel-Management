-- ================================
-- Skills & Resource Management DB
-- ================================

-- Create Database
CREATE DATABASE IF NOT EXISTS skills_management;
USE skills_management;

-- ================================
-- Personnel Table
-- ================================
CREATE TABLE personnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100),
    experience_level ENUM('Junior', 'Mid-Level', 'Senior') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Skills Table
-- ================================
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100),
    description TEXT
);

-- ================================
-- Personnel Skills (Many-to-Many)
-- ================================
CREATE TABLE personnel_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personnel_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency ENUM('Beginner','Intermediate','Advanced','Expert') NOT NULL,

    CONSTRAINT fk_personnel
        FOREIGN KEY (personnel_id)
        REFERENCES personnel(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE,

    UNIQUE (personnel_id, skill_id)
);

-- ================================
-- Projects Table
-- ================================
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('Planning','Active','Completed') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- Project Required Skills
-- ================================
CREATE TABLE project_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    min_proficiency ENUM('Beginner','Intermediate','Advanced','Expert') NOT NULL,

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_skill
        FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE,

    UNIQUE (project_id, skill_id)
);

-- ================================
-- Indexes (Performance Optimization)
-- ================================
CREATE INDEX idx_personnel_experience ON personnel(experience_level);
CREATE INDEX idx_skill_category ON skills(category);
CREATE INDEX idx_project_status ON projects(status);

-- ================================
-- OPTIONAL SEED DATA (Good for Demo)
-- ================================

-- Skills
INSERT INTO skills (name, category, description) VALUES
('React', 'Framework', 'Frontend JavaScript library'),
('Node.js', 'Runtime', 'Backend JavaScript runtime'),
('MySQL', 'Database', 'Relational database system'),
('AWS', 'Cloud', 'Cloud computing platform');

-- Personnel
INSERT INTO personnel (name, email, role, experience_level) VALUES
('Vishwa Sampath', 'vishwa@example.com', 'Full Stack Developer', 'Mid-Level'),
('John Perera', 'john@example.com', 'Backend Developer', 'Senior');

-- Personnel Skills
INSERT INTO personnel_skills (personnel_id, skill_id, proficiency) VALUES
(1, 1, 'Advanced'),
(1, 2, 'Advanced'),
(1, 3, 'Intermediate'),
(2, 2, 'Expert'),
(2, 4, 'Advanced');

-- Projects
INSERT INTO projects (name, description, start_date, end_date, status) VALUES
('Internal HR System', 'Build HR management system', '2026-01-01', '2026-03-31', 'Planning');

-- Project Required Skills
INSERT INTO project_skills (project_id, skill_id, min_proficiency) VALUES
(1, 1, 'Intermediate'),
(1, 2, 'Intermediate');
