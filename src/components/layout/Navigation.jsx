import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
    Home,
    Search,
    Calendar,
    MessageSquare,
    User,
    LayoutDashboard,
    Users,
    Building2,
    Briefcase,
    Settings,
    LogOut,
    Sun,
    Moon,
    Menu,
    Bell,
    X
} from 'lucide-react';
import { useState } from 'react';

// Mobile Bottom Navigation
export function BottomNav() {
    const { user } = useAuth();

    const getNavItems = () => {
        if (!user) {
            return [
                { to: '/', icon: Home, label: 'Home' },
                { to: '/discover', icon: Search, label: 'Discover' },
                { to: '/community', icon: Calendar, label: 'Events' },
                { to: '/login', icon: User, label: 'Login' },
            ];
        }

        return [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/discover', icon: Search, label: 'Discover' },
            { to: '/community', icon: Calendar, label: 'Events' },
            { to: '/messages', icon: MessageSquare, label: 'Messages' },
            { to: '/profile', icon: User, label: 'Profile' },
        ];
    };

    return (
        <nav className="bottom-nav">
            {getNavItems().map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                    <item.icon className="nav-icon" />
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}

// Desktop Sidebar
export function Sidebar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const getNavItems = () => {
        const base = [
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/discover', icon: Search, label: 'Discover' },
        ];

        switch (user?.role) {
            case 'agent':
                return [
                    ...base,
                    { to: '/agent/cube', icon: User, label: 'My Cube' },
                    { to: '/agent/leads', icon: Briefcase, label: 'Leads' },
                    { to: '/messages', icon: MessageSquare, label: 'Messages' },
                    { to: '/community', icon: Calendar, label: 'Community' },
                ];
            case 'space':
                return [
                    ...base,
                    { to: '/space/cubes', icon: Building2, label: 'My Spaces' },
                    { to: '/space/bookings', icon: Calendar, label: 'Bookings' },
                    { to: '/messages', icon: MessageSquare, label: 'Messages' },
                ];
            case 'employer':
                return [
                    ...base,
                    { to: '/employer/agents', icon: Users, label: 'Hired Agents' },
                    { to: '/employer/spaces', icon: Building2, label: 'My Spaces' },
                    { to: '/messages', icon: MessageSquare, label: 'Messages' },
                ];
            case 'admin':
                return [
                    ...base,
                    { to: '/admin/users', icon: Users, label: 'Users' },
                    { to: '/admin/cubes', icon: Building2, label: 'Cubes' },
                    { to: '/admin/revenue', icon: Briefcase, label: 'Revenue' },
                    { to: '/admin/events', icon: Calendar, label: 'Events' },
                ];
            default:
                return base;
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <img src="/cube.svg" alt="Accescube" />
                <span className="sidebar-logo-text">Accescube</span>
            </div>

            <nav className="sidebar-nav">
                {getNavItems().map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="sidebar-link"
                    onClick={toggleTheme}
                    style={{ width: '100%', textAlign: 'left' }}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <NavLink to="/settings" className="sidebar-link">
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>

                <button
                    className="sidebar-link"
                    onClick={handleLogout}
                    style={{ width: '100%', textAlign: 'left', color: 'var(--error-500)' }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}

// Top Header
export function TopHeader({ title }) {
    const { theme, toggleTheme } = useTheme();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <>
            <header className="top-header">
                <button
                    className="btn btn-ghost btn-icon md:hidden"
                    onClick={() => setShowMobileMenu(true)}
                >
                    <Menu size={24} />
                </button>

                <h1 className="header-title">{title}</h1>

                <div className="header-actions">
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={toggleTheme}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="btn btn-ghost btn-icon">
                        <Bell size={20} />
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 md:hidden"
                    onClick={() => setShowMobileMenu(false)}
                >
                    <div
                        className="absolute left-0 top-0 bottom-0 w-72 bg-elevated p-6 animate-slide-in-left"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="btn btn-ghost btn-icon absolute top-4 right-4"
                            onClick={() => setShowMobileMenu(false)}
                        >
                            <X size={24} />
                        </button>
                        {/* Mobile menu content would go here */}
                    </div>
                </div>
            )}
        </>
    );
}

// Layout Component for Authenticated Pages
export function AppLayout({ children, title }) {
    return (
        <div className="min-h-screen">
            <Sidebar />
            <TopHeader title={title} />
            <main className="main-content">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
