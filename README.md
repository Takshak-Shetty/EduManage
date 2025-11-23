# Student Record Management System

MERN stack backend API for managing student records with role-based access control.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/student_records
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Seed admin user:
```bash
node seed.js
```

4. Start the server:
```bash
npm run dev
```

## Default Admin Credentials
- Email: admin@example.com
- Password: admin123

## API Endpoints

### Authentication
- POST `/api/auth/student/register` - Student registration
- POST `/api/auth/login` - Login (admin/student)

### Admin Routes (Bearer token required)
- POST `/api/admin/students` - Create student
- GET `/api/admin/students` - Get all students
- GET `/api/admin/students/:id` - Get student by ID
- PUT `/api/admin/students/:id` - Update student
- DELETE `/api/admin/students/:id` - Delete student
- POST `/api/admin/marks` - Create marks
- PUT `/api/admin/marks/:studentId` - Update marks

### Student Routes (Bearer token required)
- GET `/api/student/profile` - Get profile
- GET `/api/student/scorecard` - Get scorecard

## Authentication
All protected routes require Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```