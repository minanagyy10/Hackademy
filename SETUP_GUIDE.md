# Hackademy - Project Setup Guide

A cybersecurity training platform with student reports, instructor feedback, leaderboards, and admin management.

---

## 📋 Prerequisites

- **Node.js** v18+ 
- **MongoDB** running locally or MongoDB Atlas connection
- **npm** package manager

---

## 🗂️ Project Structure

```
Hackademy/
├── src/                          # Main Backend (Port 9999)
├── Hackademy Admin Panel/        # Admin Backend (Port 9001)
├── hackademy-frontend/           # React Frontend (Port 5173)
└── .env                          # Environment variables
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/hackademy

# JWT Secrets
JWT_SECRET_LOGIN=your_jwt_secret_here
JWT_SECRET_REFRESH=your_refresh_secret_here

# Ports
PORT=9999
ADMIN_PORT=9001

# Security
SALT=10
```

---

## 🚀 Installation Steps

### Step 1: Install Backend Dependencies

```bash
# From root directory
npm install
```

### Step 2: Install Admin Panel Dependencies

```bash
cd "Hackademy Admin Panel"
npm install
cd ..
```

### Step 3: Install Frontend Dependencies

```bash
cd hackademy-frontend
npm install
cd ..
```

---

## ▶️ Running the Application

You need to run **3 services** in separate terminals:

### Terminal 1: Main Backend Server (Port 9999)

```bash
npm start
```

**Expected output:**
```
Server is running on port 9999
Database connected
```

### Terminal 2: Admin Panel Server (Port 9001)

```bash
node "Hackademy Admin Panel/src/main.js"
```

**Expected output:**
```
Admin Panel app listening on port 9001
Database connected
```

### Terminal 3: Frontend Dev Server (Port 5173)

```bash
cd hackademy-frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React application |
| Main API | http://localhost:9999 | Student/Instructor APIs |
| Admin API | http://localhost:9001 | Admin management APIs |

---

## 👥 User Roles

### Student
- Submit vulnerability reports
- View grades and feedback
- Access practice challenges
- View leaderboard rankings

### Instructor
- Review student reports
- Assign scores and feedback
- Manage assigned students

### Admin
- View platform statistics
- Manage all users
- Register new students/instructors

---

## 🔐 Default Test Accounts

> Create accounts via Admin Panel at `/admin/register`

---

## 🛠️ Troubleshooting

### Port Already in Use

```bash
# Windows - Find and kill process on port 9999
netstat -ano | findstr :9999
taskkill /F /PID <PID>

# Same for port 9001
netstat -ano | findstr :9001
taskkill /F /PID <PID>
```

### MongoDB Connection Failed

1. Ensure MongoDB is running:
   ```bash
   mongod
   ```
2. Check your `MONGODB_URI` in `.env`

### Frontend Build Errors

```bash
cd hackademy-frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 📝 API Endpoints Summary

### Auth (`/api/auth`)
- `POST /login` - User login
- `POST /logout` - User logout

### Students (`/api/students`)
- `POST /submitReport` - Submit a report
- `GET /reports` - Get my reports
- `GET /totalScore` - Get my score

### Instructors (`/api/instructors`)
- `GET /students` - Get assigned students
- `GET /reports` - Get reports to review
- `PATCH /reports/:id/score` - Assign score
- `PATCH /reports/:id/feedback` - Assign feedback

### Admin (`/admin`)
- `GET /stats` - Dashboard statistics
- `GET /analytics` - Chart data
- `GET /users` - All users
- `DELETE /users/:id` - Delete user

---

## 🎨 Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Recharts (charts)
- Lucide React (icons)
- Axios

**Backend:**
- Node.js / Express
- MongoDB / Mongoose
- JWT Authentication
- bcrypt

---

## ✅ Quick Start Commands

```bash
# Install all dependencies
npm install && cd hackademy-frontend && npm install && cd ..

# Run everything (3 terminals needed)
# Terminal 1:
npm start

# Terminal 2:
node "Hackademy Admin Panel/src/main.js"

# Terminal 3:
cd hackademy-frontend && npm run dev
```

---

**Happy Hacking! 🛡️**
