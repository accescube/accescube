import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { User, Lock, Sun, Moon, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../components/ui/Card';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, seedDemoUsers } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            console.error("Login Error:", err);

            if ((username === 'agent' || username === 'provider') &&
                (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
                try {
                    setError('Initializing demo account...');
                    await seedDemoUsers();
                    await login(username, password);
                    navigate('/dashboard');
                    return;
                } catch (seedErr) {
                    console.error("Seed error:", seedErr);
                }
            }

            let displayMessage = 'Failed to sign in. Please check your credentials.';

            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                displayMessage = 'Invalid username or password.';

                if (username === 'agent' || username === 'provider') {
                    displayMessage = `Demo account "${username}" not found. Please try registering first.`;
                }
            } else if (err.code === 'auth/too-many-requests') {
                displayMessage = 'Too many failed attempts. Please try again later.';
            } else {
                displayMessage = err.message.replace('Firebase: ', '').replace('auth/', '');
            }

            setError(displayMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4 relative overflow-hidden font-ui">
            <Card className="w-full max-w-[420px] p-6 shadow-xl animate-scale-in relative z-10 flex flex-col border border-light rounded-2xl bg-elevated text-primary">
                {/* Header Row */}
                <div className="w-full flex items-center justify-between mb-6 border-b border-light pb-4">
                    <Link to="/" className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition">
                        <ArrowLeft size={16} />
                        <span>Back to Home</span>
                    </Link>
                    <button
                        className="p-1.5 rounded-full text-secondary hover:text-primary hover:bg-secondary transition"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>

                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-sm">
                            A
                        </div>
                        <span className="text-base font-bold tracking-tight text-primary">Accescube</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight mb-1">Welcome Back</h1>
                    <p className="text-xs text-secondary">Sign in to your account</p>
                </div>

                <form id="login-form" onSubmit={handleSubmit} className="w-full space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-xs animate-scale-in leading-relaxed">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="input-icon relative text-sm">
                            <User className="icon" size={16} />
                            <input
                                type="text"
                                className="input py-2.5"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-icon relative text-sm">
                            <Lock className="icon" size={16} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input py-2.5"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '2.5rem' }}
                            />
                            <button
                                type="button"
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition p-2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-secondary pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-primary-500" />
                            <span>Stay signed in</span>
                        </label>
                        <Link to="/forgot-password" className="text-primary-500 font-semibold hover:underline">
                            Forgot?
                        </Link>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3 font-bold shadow-md text-sm"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </div>
                </form>

                <div className="w-full mt-6 pt-6 border-t border-light text-center">
                    <span className="block text-[10px] text-tertiary uppercase tracking-widest font-bold mb-3">Quick Demo Login</span>
                    <div className="flex gap-2 justify-center mb-2">
                        <button
                            type="button"
                            className="btn btn-secondary text-xs py-1.5 px-4 flex-1 rounded-xl font-semibold border border-light"
                            onClick={() => {
                                setUsername('agent');
                                setPassword('password123');
                                setTimeout(() => document.getElementById('login-form').requestSubmit(), 50);
                            }}
                        >
                            Agent Demo
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary text-xs py-1.5 px-4 flex-1 rounded-xl font-semibold border border-light"
                            onClick={() => {
                                setUsername('provider');
                                setPassword('password123');
                                setTimeout(() => document.getElementById('login-form').requestSubmit(), 50);
                            }}
                        >
                            Space Demo
                        </button>
                    </div>
                    <p className="text-[10px] text-tertiary leading-tight">
                        Clicking either button will automatically sign in or initialize the demo account.
                    </p>
                </div>

                <div className="mt-6 pt-4 border-t border-light text-center">
                    <p className="text-xs text-secondary">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-500 font-bold hover:underline">
                            Create one
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default Login;
