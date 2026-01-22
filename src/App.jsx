import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Discover from './pages/discover/Discover';
import AgentDetail from './pages/discover/AgentDetail';
import SpaceDetail from './pages/discover/SpaceDetail';
import Community from './pages/community/Community';
import Messages from './pages/Messages';
import Profile from './pages/Profile';

// Agent Pages
import AgentDashboard from './pages/agent/Dashboard';
import AgentMyCube from './pages/agent/MyCube';
import AgentLeads from './pages/agent/Leads';

// Space Provider Pages
import SpaceDashboard from './pages/space/Dashboard';
import MyCubes from './pages/space/MyCubes';
import Bookings from './pages/space/Bookings';

// Employer Pages
// Employer Pages
import EmployerDashboard from './pages/employer/Dashboard';
import HiredAgents from './pages/employer/HiredAgents';
import MySpaces from './pages/employer/MySpaces';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';

// Protected Route Component
function ProtectedRoute({ children, roles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

// Dashboard Router - routes to correct dashboard based on role
function DashboardRouter() {
    const { user } = useAuth();

    switch (user?.role) {
        case 'agent':
            return <AgentDashboard />;
        case 'space':
            return <SpaceDashboard />;
        case 'employer':
            return <EmployerDashboard />;
        case 'admin':
            return <AdminDashboard />;
        default:
            return <Navigate to="/login" replace />;
    }
}

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

            {/* Discovery Routes - Public */}
            <Route path="/discover" element={<Discover />} />
            <Route path="/discover/agents/:id" element={<AgentDetail />} />
            <Route path="/discover/spaces/:id" element={<SpaceDetail />} />
            <Route path="/community" element={<Community />} />

            {/* Messages Route */}
            <Route
                path="/messages"
                element={
                    <ProtectedRoute>
                        <Messages />
                    </ProtectedRoute>
                }
            />

            {/* Profile Route */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            {/* Protected - Dashboard */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardRouter />
                    </ProtectedRoute>
                }
            />

            {/* Agent Routes */}
            <Route
                path="/agent/*"
                element={
                    <ProtectedRoute roles={['agent']}>
                        <Routes>
                            <Route path="cube" element={<AgentMyCube />} />
                            <Route path="leads" element={<AgentLeads />} />
                            <Route path="*" element={<AgentDashboard />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Space Provider Routes */}
            <Route
                path="/space/*"
                element={
                    <ProtectedRoute roles={['space']}>
                        <Routes>
                            <Route path="cubes" element={<MyCubes />} />
                            <Route path="bookings" element={<Bookings />} />
                            <Route path="*" element={<SpaceDashboard />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Employer Routes */}
            <Route
                path="/employer/*"
                element={
                    <ProtectedRoute roles={['employer']}>
                        <Routes>
                            <Route path="agents" element={<HiredAgents />} />
                            <Route path="spaces" element={<MySpaces />} />
                            <Route path="*" element={<EmployerDashboard />} />
                        </Routes>
                    </ProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute roles={['admin']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <DataProvider>
                        <ToastProvider>
                            <AppRoutes />
                        </ToastProvider>
                    </DataProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
