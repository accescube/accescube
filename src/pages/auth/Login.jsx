import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Mail, Lock, Sun, Moon, ArrowLeft, Eye, EyeOff } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error("Login Error:", err);
            // Show the actual error message from Firebase or a generic one
            const message = err.message || 'Failed to sign in. Please check your credentials.';
            // Clean up common firebase error prefixes
            const displayMessage = message.replace('Firebase: ', '').replace('auth/', '');
            setError(displayMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="w-full max-w-6xl flex shadow-2xl rounded-3xl overflow-hidden bg-elevated border border-light animate-fade-in min-h-[600px]">
                {/* Left Side: Form */}
                <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-12">
                        <Link to="/" className="flex items-center gap-2 text-secondary hover:text-primary transition group">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back</span>
                        </Link>
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={toggleTheme}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    <div className="w-full max-w-sm mx-auto">
                        <div className="text-center mb-10">
                            <Link to="/" className="inline-flex items-center gap-3 mb-8 hover:scale-110 transition-transform">
                                <img src="/cube.svg" alt="Accescube" className="w-16 h-16 drop-shadow-glow" />
                            </Link>
                            <h1 className="text-3xl font-bold mb-3 tracking-tight">Welcome Back</h1>
                            <p className="text-secondary">Sign in to access your dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            {error && (
                                <div className="p-4 rounded-xl bg-error-500/10 border border-error-500/20 text-error-500 text-sm animate-scale-in">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Email address"
                                type="email"
                                placeholder="name@company.com"
                                icon={Mail}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <div className="input-icon relative">
                                    <Lock className="icon" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="input"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ paddingRight: '3.5rem' }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition p-2"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm mt-1">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-light text-primary-500 focus:ring-primary-500" />
                                    <span className="text-secondary group-hover:text-primary transition">Remember me</span>
                                </label>
                                <Link to="/forgot-password" name="forgot-password-link" className="text-primary-500 font-medium hover:underline decoration-2 underline-offset-4">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full mt-4 py-4 text-lg"
                                loading={loading}
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-secondary">
                                New to Accescube?{' '}
                                <Link to="/register" className="text-primary-500 font-bold hover:underline decoration-2 underline-offset-4">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visual Panel */}
                <div className="hidden lg:flex flex-1 bg-gradient-hero relative overflow-hidden items-center justify-center p-12">
                    <div className="relative z-10 text-center text-white">
                        <div className="text-8xl mb-10 animate-float drop-shadow-2xl">🧊</div>
                        <h2 className="text-4xl font-extrabold mb-6 leading-tight">Your Digital HQ<br />Starts Here</h2>
                        <p className="text-xl text-white/80 max-w-sm mx-auto leading-relaxed">
                            Join the next-generation platform connecting professionals worldwide.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
