# Smart Planner & Burnout Prevention System ("Mindful Study")

## Project Description
<br />
Mindful Study, A Study Planner and Burnout Prevention System, is a web-based platform designed to help students manage their academic responsibilities while maintaining a healthy study-life balance. Many students struggle with organizing assignments, tracking deadlines, balancing personal schedules, and avoiding academic burnout due to heavy workloads and poor time management. This system provides an organized and user-friendly solution that supports both productivity and student well-being.

The platform allows users to create study schedules, manage tasks and assignments, track academic progress, and log daily burnout indicators. In addition, the system includes burnout prevention features such as configurable Pomodoro study timers, self-assessment logging, dynamic study streak tracking, and a live burnout index calculation with custom advice to encourage healthier study habits.

This is a cross-over project among 4 courses. It integrates the concepts from Human-Computer Interaction, Software Engineering, Database Administration, and Backend Development.
<br />

## Objectives
<br />
The objectives of this project are:
1. To help students effectively manage study schedules, assignments, and deadlines.
2. To provide tools that encourage healthier study habits and reduce academic burnout.
3. To design a user-friendly and accessible interface based on HCI principles.
4. To implement a functional backend system with secure user authentication and data management.
5. To develop a structured database system for storing user tasks, schedules, and productivity records.
<br />

## System Features
<br />

### Core Features
- **User Registration and Authentication**: Secure signup and signin workflow featuring JWT (JSON Web Tokens) and bcryptjs password hashing to safeguard student accounts.
- **Guidebook (Onboarding Tour)**: An interactive, multi-stage modal guide (`GuideModal.jsx`) that walks new users through the application (Welcome Screen, Dashboard, Smart Planner, Tasks & Study Sessions, and Analytics Insights). It triggers automatically upon a new user's first login and can be reopened at any time via the book icon in the top right.
- **Task and Assignment Management**: Full CRUD capabilities for student tasks, supporting priority classification (High, Medium, Low), category tags (Practice, Assignment, Project, Revision, Research, Others), and completion checkbox states.
- **Interactive Monthly Planner & Calendar**: A visual monthly calendar grid showing task deadlines and scheduled study sessions, complete with selected-date details, quick study session allocation, and a chronological backlog queue.
- **Theme Customization (Dark Mode)**: Integrated system preferences enabling seamless Light/Dark mode transitions, persisted in local storage.
- **Help & Support Center**: Interactive FAQ dropdown sections and a contact form allowing users to submit queries.

### Burnout Prevention & Analytics Features
- **Study Session Timer (Pomodoro)**: Countdown timer modal supporting standard focus durations (25 min), deep work (50 min), short focus (15 min), or custom settings-based focus blocks, integrated with break duration configurations and alarms.
- **Burnout-Risk Self-Assessments (Burnout Log)**: Daily check-in log entries where users record emotional mood, sleep hours, sleep quality, screen time, and custom reflection notes.
- **Live Burnout Index Calculation**: A dynamic algorithm mapping self-reported parameters (mood, sleep, screen time) alongside actual database workloads (pending tasks count, overdue task status, missed study sessions) to compute a live burnout risk index (0–100%) with custom wellness recommendations.
- **Dynamic Study Streak Tracking**: Consecutive day streak calculator that tracks active task completions or study sessions, displayed via a fire emoji streak counter in the top bar.
- **Productivity & Workload Analytics**: Detailed tracking charts and summaries outlining average focus levels, total hours studied, count of breaks taken, weekly history overview, and a distribution chart comparing categories.

## Technologies Used
<br />

### Frontend Development
- **React 19** for UI component development
- **Tailwind CSS v4** for modern utility-first styling and theme controls
- **Headless UI** for accessible overlay dialog components
- **Vite** for the build tool and dev server
- **Axios** for API requests

### Backend Development
- **Node.js** & **Express.js** for the REST API
- **jsonwebtoken (JWT)** for secure request authentication
- **bcryptjs** for secure password hashing
- **dotenv** for configuration environment variables

### Database
- **Aiven hosted MySQL cloud instance** for online data persistence
- **mysql2** client connection pooling
- **User privilege role scripts** for secure database administrator and user role constraints
<br />

## Requirements
<br />

### Human-Computer Interaction (HCI)
• Target user: University Students who desire a balancing academic life and personal life
• UX Research Conducted: Survey
• Pain point: Students often struggle with overlapping deadlines; procrastination,
distractions, and poor time management can lead to stress, exhaustion, reduced
productivity, and academic burnout.
• Persona
  - Short description: A 19-year-old student who studied in second year is struggling with management and stress.
  - Main goal: Stay organized with deadlines and Balanced responsibilities.
  - Key frustration: Overwhelmed by multiple deadlines and easily distracted by social
media.
  - Context: Uses laptops and smartphones daily, studies in a small room or library, under
    time pressure and stress.
  - Quote: "I feel like I'm running out of time."
• User story: As a student, I want to create and manage study tasks while monitoring my stress level so that I can avoid burnout and complete assignments on time.
• Screens: Authentication (Login/Signup), Dashboard, Task - Study Session Manager, Planner, Analytics, Settings, Helps & Support 
• Navigation/feedback: Clear Authentication flow, Guidebook, Dashboard Display, Task/Study Session Creation,  Visible task status, Burnout Assessment, and Calendar-like Schedules.

### Software Engineering
#### Development Methodology: Agile SCRUM
#### Functional
• Add and manage tasks
• Add and manage Study Session
• Display Calendar-like Schedule
• Record burnout level
• Recommend break
• Display Insights
• Manage Settings
#### Non-functional
• Easy to use
• Fast response
• Simple navigation

### Database Administration
• Database Implementation on online MySQL Database
• Database Design and Analysis: ERD and Relational Model (RM) designed appropriately
  - Primary keys and foreign keys correctly implemented
  - Relationships between entities properly designed
  - Constraints implemented where relevant
• SQL scripts provided for: table creation, insertion and queries (3rd normal form)
• Sample data available (Generation of million records of data)
• Database connected successfully to the application
• Meaningful queries demonstrated
• User access and control management: User Privilege and Roles
• Backup and recovery mechanisms (export scripts provided if requested)
• Query optimization techniques: indexing implemented properly
• Data encryption implemented where necessary

### Backend Development
• REST API implemented using Node.js and Express.js
• API routes separated properly (routes/controllers/services/repositories)
• Implement secure user authentication and authorization using JWT
• Protected routes requiring authentication
• Authorization / privilege management implemented (roles or permissions)
• API connected to a database
• CRUD operations implemented for main resources
• API tested using Postman or Swagger UI or ApiDog
• Swagger API documentation available with testable requests
• Proper HTTP status codes used
• Environment variables stored in .env
• Error handling middleware implemented
• Frontend integration with ReactJS
<br />

## Expected Outcome
<br />
The expected outcome of this project is a fully functional web application that helps students improve productivity, manage academic workloads, and maintain healthier study habits. The system is expected to demonstrate practical implementation of HCI principles alongside backend development, database management, and software engineering concepts.