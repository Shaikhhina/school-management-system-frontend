This project is a Full Stack School Management System built using:

 Frontend: React.js + Tailwind CSS
 Backend: Node.js + Express.js
 Database: MongoDB
 Runtime: Nodemon (for backend development)

git clone https://github.com/Shaikhhina/school-management-system-frontend

git clone https://github.com/Shaikhhina/school-management-system-backend

npm install --- both for frontend and backend

frontend run --- npm start                
(http://localhost:3000)

backend run --- nodemon
(http://localhost:5001)

db name in backend db file mentioned : school-management-system


Project Workflow (Admin Dashboard System)
1. Admin Registration
Admin first creates an account using the Register page
Required fields:
Name
Email
Password

After successful registration, admin data is saved in the database

3. Admin Login
Admin logs in using registered credentials
On successful login:
Authentication token is generated
Admin is redirected to the Dashboard

5. Dashboard Access

After login, admin can access the main dashboard which includes:

Students Management
Assignment Management

4. Student Management

Admin can perform the following actions:

➤ Add New Student
Fill student details:
Full Name
Email
Student ID
Grade
Section
Submit form → student is saved in database
➤ View All Students
Admin can view complete student list in a table
Options available:
Edit student details
Delete student
5. Task Assignment System

Admin can assign tasks to specific students:

Select student from dropdown
Enter task details:
Title
Description
Due Date
Assign task → stored in database with default status: Pending
6. Task Management

Admin can view tasks 

➤ All Tasks
Displays all assigned tasks in a table
Shows:
Student name
Class
Task details
Status (Pending / Completed)
➤ Pending Tasks
Shows tasks that are not yet completed
➤ Completed Tasks
Shows tasks marked as completed
7. Task Status Update
When student completes a task, admin can:
Click checkbox/button in table
Update status from Pending → Completed
Status is updated in backend and reflected instantly in UI
8. Logout Functionality
Admin can logout from dashboard
On logout:
Token is cleared from localStorage
admin is redirected to login page

