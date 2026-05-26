import { Link, NavLink, useNavigate } from 'react-router-dom';
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
    X,
    ArrowLeft
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
                <Link to="/">
                    <img
                        src="/logo-src.png"
                        alt="Accescube Logo"
                        style={{
                            height: '40px',
                            width: 'auto',
                            maxWidth: '180px',
                            objectFit: 'contain',
                            display: 'block',
                            filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)'
                        }}
                    />
                </Link>
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
export function TopHeader({ title, isDashboard = false, backTo, actions }) {
    const { theme, toggleTheme } = useTheme();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { user } = useAuth();
    return (
        <>
            <header className={isDashboard ? "top-header" : "public-header"}>
                <div className={isDashboard ? "w-full flex items-center justify-between" : "w-full max-w-6xl mx-auto px-6 flex items-center justify-between"}>
                    <div className="flex items-center gap-4">
                        {backTo && (
                            <>
                                <Link to={backTo} className="flex items-center gap-2 text-white/95 hover:text-white transition-colors duration-200">
                                    <ArrowLeft size={20} />
                                    <span className="hidden sm:inline font-semibold text-sm">Back</span>
                                </Link>
                                <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
                            </>
                        )}
                        <Link to="/" className={isDashboard ? "flex items-center h-full md:hidden" : "flex items-center h-full"}>
                            <img
                                src="/logo-src.png"
                                alt="Accescube Logo"
                                style={{
                                    height: '40px',
                                    width: 'auto',
                                    maxWidth: '160px',
                                    objectFit: 'contain',
                                    display: 'block',
                                    filter: 'brightness(0) invert(1)'
                                }}
                            />
                        </Link>
                        {title && <h1 className="header-title text-white text-lg font-semibold ml-4">{title}</h1>}
                    </div>
                    <div className="flex items-center gap-4">
                        {actions}
                        <button aria-label="Toggle theme" className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200" onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun size={22} className="drop-shadow-md" /> : <Moon size={22} className="drop-shadow-md" />}
                        </button>
                        {!isDashboard && (
                            user ? (
                                <Link
                                    to="/dashboard"
                                    className="bg-primary-500 hover:bg-primary-400 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-primary-400"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-semibold text-white px-3 py-2 hover:text-primary-300 transition-colors hidden sm:block drop-shadow-md"
                                    >
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-primary-500 hover:bg-primary-400 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-primary-400"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </div>
            </header>
            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setShowMobileMenu(false)}>
                    <div className="absolute left-0 top-0 bottom-0 w-72 bg-elevated p-6 animate-slide-in-left" onClick={e => e.stopPropagation()}>
                        <button className="btn btn-ghost btn-icon absolute top-4 right-4" onClick={() => setShowMobileMenu(false)}>
                            <X size={24} />
                        </button>
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
            <TopHeader title={title} isDashboard={true} />
            <main className="main-content">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
