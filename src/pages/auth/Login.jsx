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
            setError('Invalid email or password. Try: agent@demo.com / 1234');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex flex-col p-6 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center gap-2 text-secondary hover:text-primary transition">
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </Link>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={toggleTheme}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <Link to="/" className="inline-flex items-center gap-3 mb-6">
                                <img src="/cube.svg" alt="Accescube" style={{ width: 48, height: 48 }} />
                            </Link>
                            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                            <p className="text-secondary">Sign in to access your dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {error && (
                                <div className="p-4 rounded-lg bg-error-500/10 border border-error-500/30 text-error-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
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
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ paddingRight: '3rem' }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded" />
                                    <span className="text-secondary">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-primary-500 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full mt-2"
                                loading={loading}
                            >
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-secondary">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-primary-500 font-medium hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>

                        {/* Demo Accounts */}
                        <div className="mt-8 p-4 rounded-xl bg-secondary border border-light">
                            <p className="text-sm font-medium mb-3">Demo Accounts:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 rounded bg-tertiary">
                                    <div className="font-medium">Agent</div>
                                    <div className="text-tertiary">agent@demo.com</div>
                                </div>
                                <div className="p-2 rounded bg-tertiary">
                                    <div className="font-medium">Space</div>
                                    <div className="text-tertiary">space@demo.com</div>
                                </div>
                                <div className="p-2 rounded bg-tertiary">
                                    <div className="font-medium">Employer</div>
                                    <div className="text-tertiary">employer@demo.com</div>
                                </div>
                                <div className="p-2 rounded bg-tertiary">
                                    <div className="font-medium">Admin</div>
                                    <div className="text-tertiary">admin@demo.com</div>
                                </div>
                            </div>
                            <p className="text-xs text-tertiary mt-2">Password: any 4+ characters</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Gradient Background */}
            <div className="hidden lg:flex flex-1 bg-gradient-hero relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-12">
                        <div className="text-6xl mb-6 animate-float">🧊</div>
                        <h2 className="text-3xl font-bold mb-4">Build Your Cube</h2>
                        <p className="text-lg opacity-90 max-w-md">
                            Join the next-generation platform connecting professionals worldwide
                        </p>
                    </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 animate-float" />
                <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-white/5 animate-float" style={{ animationDelay: '2s' }} />
            </div>
        </div>
    );
}

export default Login;
