import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Mail, Lock, Sun, Moon, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Card } from '../../components/ui/Card';

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
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[120px]" />

            <Card className="w-[320px] p-5 shadow-card animate-fade-in relative z-10 flex flex-col items-center text-center">
                {/* Header Row */}
                <div className="w-full flex items-center justify-between mb-4">
                    <Link to="/" className="flex items-center gap-1 text-secondary hover:text-primary transition group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-medium">Back</span>
                    </Link>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <img src="/cube.svg" alt="" style={{ width: 18, height: 18 }} />
                        <span className="text-sm font-bold gradient-text">Accescube</span>
                    </div>
                    <h1 className="text-lg font-bold">Welcome Back</h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-3">
                    {error && (
                        <div className="p-2 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-[10px] animate-scale-in">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="input-icon relative text-sm">
                            <Mail className="icon" size={16} />
                            <input
                                type="email"
                                className="input py-2"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-icon relative text-sm">
                            <Lock className="icon" size={16} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input py-2"
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

                    <div className="flex items-center justify-between text-[10px]">
                        <label className="flex items-center gap-1.5 cursor-pointer text-secondary">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded" />
                            <span>Stay signed in</span>
                        </label>
                        <Link to="/forgot-password" classname="text-primary-500 hover:underline">
                            Forgot?
                        </Link>
                    </div>

                    <div className="flex justify-center pt-1">
                        <Button
                            type="submit"
                            variant="primary"
                            className="px-8 py-2 text-sm font-bold"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </div>
                </form>

                <div className="w-full mt-4 pt-4 border-t border-light">
                    <span className="block text-[9px] text-tertiary uppercase tracking-widest font-bold mb-3">Quick Demo</span>
                    <div className="flex gap-2 justify-center">
                        <button
                            className="btn btn-secondary btn-sm text-[10px] py-1 px-4 h-auto"
                            onClick={() => { setEmail('agent@test.com'); setPassword('password123'); }}
                        >
                            Agent
                        </button>
                        <button
                            className="btn btn-secondary btn-sm text-[10px] py-1 px-4 h-auto"
                            onClick={() => { setEmail('provider@test.com'); setPassword('password123'); }}
                        >
                            Provider
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-[10px] text-secondary">
                        New?{' '}
                        <Link to="/register" className="text-primary-500 font-bold hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}

export default Login;
