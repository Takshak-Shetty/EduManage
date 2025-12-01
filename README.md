<div align="center">
  <img src="./logo/edumanage-dark.svg" alt="EduManage Logo" width="300">
</div>

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)

</div>
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive **MERN stack** application for managing student records with role-based access control, featuring a modern dark-themed UI and robust authentication system.

## 🚀 Features

- **Role-Based Access Control**: Separate admin and student dashboards
- **Student Management**: Complete CRUD operations for student records
- **Academic Records**: Marks management with automatic grade calculation
- **USN Validation**: Smart enrollment number validation with department detection
- **Modern UI**: Dark-themed responsive interface
- **Secure Authentication**: JWT-based authentication system
- **API Documentation**: Complete Swagger/OpenAPI specification

## 🛠️ Tech Stack

**Frontend:**
- React 18+
- React Router DOM
- Axios
- CSS3 (Dark Theme)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn package manager

## ⚡ Quick Start

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Takshak-Shetty/EduManage.git
   cd EduManage/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/student_records
   JWT_SECRET=your_secure_jwt_secret_key
   NODE_ENV=development
   ```

4. **Initialize Database**
   ```bash
   node seed.js
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend Application**
   ```bash
   npm start
   ```

4. **Access Application**
   - Frontend: `http://localhost:3001`
   - Backend API: `http://localhost:3000`

## 👤 Default Credentials

**Admin Access:**
- Email: `admin@example.com`
- Password: `admin123`

> ⚠️ **Security Note**: Change default credentials in production environment

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/student/register` | Student registration |
| POST | `/api/auth/login` | User login (admin/student) |

### Admin Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/students` | Create new student | ✅ |
| GET | `/api/admin/students` | Get all students | ✅ |
| GET | `/api/admin/students/:enrollmentNumber` | Get student by enrollment | ✅ |
| PUT | `/api/admin/students/:enrollmentNumber` | Update student | ✅ |
| DELETE | `/api/admin/students/:enrollmentNumber` | Delete student | ✅ |
| POST | `/api/admin/marks` | Create student marks | ✅ |
| PUT | `/api/admin/marks/:enrollmentNumber` | Update student marks | ✅ |

### Student Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/student/profile` | Get student profile | ✅ |
| GET | `/api/student/scorecard` | Get academic scorecard | ✅ |

### Authentication Header
```http
Authorization: Bearer <jwt_token>
```

## 🎯 USN Format

The system supports USN validation with the format: `NNM<YY><DEPT><ROLL>`

**Example:** `NNM21CS001`
- `NNM`: Institution code
- `21`: Admission year (2021)
- `CS`: Department code (Computer Science)
- `001`: Roll number

**Supported Departments:**
- AD, AM, BT, CV, CC, CS, CB, EE, EC, VL, AC, IS, ME, RI

## 🔧 Project Structure

```
EduManage/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── seed.js         # Database seeder
│   └── server.js       # Express server
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── context/    # React context
│   │   └── services/   # API services
│   └── public/         # Static assets
└── swagger.yaml        # API documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Takshak Shetty**
- GitHub: [@Takshak-Shetty](https://github.com/Takshak-Shetty)

## 🙏 Acknowledgments

- Built with MERN stack
- Inspired by modern educational management systems
- Dark theme design for better user experience