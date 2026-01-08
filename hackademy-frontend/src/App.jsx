import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import MainLayout from './components/layout/MainLayout';

// Route Guards
import {
  ProtectedRoute,
  StudentRoute,
  InstructorRoute,
  AdminRoute
} from './components/routes/ProtectedRoutes';

// Pages
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Leaderboard from './pages/Leaderboard';
import Practice from './pages/Practice';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitReport from './pages/student/SubmitReport';
import Badges from './pages/student/Badges';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import RegisterUser from './pages/admin/RegisterUser';

// Shared Pages
import ReportDetails from './pages/shared/ReportDetails';

// Home redirect based on role
const HomeRedirect = () => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  switch (role) {
    case 'student':
      return <Navigate to="/student/dashboard" replace />;
    case 'instructor':
      return <Navigate to="/instructor/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />

          {/* Home Redirect */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Protected Routes with Layout */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            {/* Shared Routes (All authenticated users) */}
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/reports/:reportId" element={<ReportDetails />} />

            {/* Student Routes */}
            <Route path="/student" element={<StudentRoute />}>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="submit-report" element={<SubmitReport />} />
              <Route path="badges" element={<Badges />} />
            </Route>

            {/* Instructor Routes */}
            <Route path="/instructor" element={<InstructorRoute />}>
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="students" element={<InstructorDashboard />} />
              <Route path="reports" element={<InstructorDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="register" element={<RegisterUser />} />
            </Route>
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
