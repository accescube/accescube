import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
    Lock, User, Building2, Briefcase, Sun, Moon,
    ArrowLeft, Users, Check
} from 'lucide-react';

const ROLES = [
    {
        id: 'agent',
        title: 'Agent',
        description: 'Offer your professional services and skills',
        icon: Users
    },
    {
        id: 'space',
        title: 'Space Provider',
        description: 'List your desk, cabin, or workspace',
        icon: Building2
    },
    {
        id: 'employer',
        title: 'Employer',
        description: 'Hire skilled talent and manage projects',
        icon: Briefcase
    },
];

function Register() {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(searchParams.get('role') || '');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleRoleSelect = (roleId) => {
        setRole(roleId);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await register({
                name: formData.name,
                username: formData.username,
                password: formData.password,
                role: role,
            });
            navigate('/dashboard');
        } catch (err) {
            console.error("Registration Error:", err);
            const message = err.message || 'Registration failed. Please try again.';
            const displayMessage = message.replace('Firebase: ', '').replace('auth/', '');
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
                    <button
                        onClick={() => step === 1 ? navigate('/') : setStep(1)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-primary transition"
                    >
                        <ArrowLeft size={16} />
                        <span>{step === 1 ? 'Back to Home' : 'Change Role'}</span>
                    </button>
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
                    <h1 className="text-xl font-bold tracking-tight mb-1">Create Account</h1>
                    <p className="text-xs text-secondary">
                        {step === 1 ? 'Select your primary account profile' : `Complete your ${ROLES.find(r => r.id === role)?.title} profile`}
                    </p>
                </div>

                {/* Step 1: Role Selection */}
                {step === 1 && (
                    <div className="space-y-3 mb-4">
                        {ROLES.map((r) => {
                            const Icon = r.icon;
                            return (
                                <button
                                    key={r.id}
                                    onClick={() => handleRoleSelect(r.id)}
                                    className={`w-full p-4 rounded-xl text-left border transition flex items-center gap-4 ${
                                        role === r.id
                                            ? 'border-primary-500 bg-primary-500/10 text-primary-500 shadow-sm'
                                            : 'border-light bg-secondary hover:border-medium text-primary'
                                    }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm mb-0.5 text-primary">{r.title}</h3>
                                        <p className="text-xs text-secondary">{r.description}</p>
                                    </div>
                                </button>
                            );
                        })}

                        <div className="pt-4 text-center border-t border-light mt-6">
                            <p className="text-xs text-secondary">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary-500 font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Account Details */}
                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg bg-error-500/10 border border-error-500/20 text-error-500 text-xs">
                                {error}
                            </div>
                        )}

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-semibold mb-1">
                            <Check size={14} /> Selected: {ROLES.find(r => r.id === role)?.title}
                        </div>

                        <Input
                            label={role === 'space' ? 'Space Name' : role === 'employer' ? 'Company Name' : 'Full Name'}
                            type="text"
                            placeholder={role === 'space' ? 'Your Workspace Name' : role === 'employer' ? 'Company Name' : 'John Doe'}
                            icon={User}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />

                        <Input
                            label="Username"
                            type="text"
                            placeholder="choose_username"
                            icon={User}
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Create a password (min 6 chars)"
                            icon={Lock}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            icon={Lock}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            required
                        />

                        <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                            <input type="checkbox" className="w-4 h-4 mt-0.5 rounded text-primary-500" required />
                            <span className="text-xs text-secondary leading-tight">
                                I agree to the <a href="#" className="text-primary-500 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
                            </span>
                        </label>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-3 font-bold shadow-md text-sm"
                                loading={loading}
                            >
                                Complete Registration
                            </Button>
                        </div>

                        <div className="text-center pt-2 border-t border-light">
                            <p className="text-xs text-secondary">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary-500 font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
}

export default Register;
