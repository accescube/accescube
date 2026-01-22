import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import {
    Mail, Lock, User, Building2, Briefcase, Sun, Moon,
    ArrowLeft, ArrowRight, Users, Check
} from 'lucide-react';

const ROLES = [
    {
        id: 'agent',
        title: 'Agent',
        description: 'Offer your services and skills',
        icon: Users,
        features: ['Create personal cube', 'List services', 'Accept leads', 'Earn money']
    },
    {
        id: 'space',
        title: 'Space Provider',
        description: 'List your workspace',
        icon: Building2,
        features: ['List workspaces', 'Manage bookings', 'Set pricing', 'Track revenue']
    },
    {
        id: 'employer',
        title: 'Employer',
        description: 'Build your virtual company',
        icon: Briefcase,
        features: ['Create company cube', 'Hire agents', 'Rent spaces', 'Manage projects']
    },
];

function Register() {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(searchParams.get('role') || '');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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
                email: formData.email,
                password: formData.password,
                role: role,
            });
            navigate('/dashboard');
        } catch (err) {
            console.error("Registration Error:", err);
            // Show the actual error message from Firebase
            const message = err.message || 'Registration failed. Please try again.';
            // Clean up common firebase error prefixes
            const displayMessage = message.replace('Firebase: ', '').replace('auth/', '');
            setError(displayMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            {/* Left Panel - Form */}
            <div className="flex-1 flex flex-col p-6 lg:p-12 w-full max-w-full lg:max-w-[50%] z-10">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => step === 1 ? navigate('/') : setStep(1)}
                        className="flex items-center gap-2 text-secondary hover:text-primary transition"
                    >
                        <ArrowLeft size={20} />
                        <span>{step === 1 ? 'Back' : 'Choose Role'}</span>
                    </button>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={toggleTheme}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center w-full">
                    <div className="w-full max-w-lg mx-auto">
                        {/* Step 1: Role Selection */}
                        {step === 1 && (
                            <>
                                <div className="text-center mb-8">
                                    <Link to="/" className="inline-flex items-center gap-3 mb-6">
                                        <img src="/cube.svg" alt="Accescube" style={{ width: 48, height: 48 }} />
                                    </Link>
                                    <h1 className="text-2xl font-bold mb-2">Join Accescube</h1>
                                    <p className="text-secondary">Choose how you want to use the platform</p>
                                </div>

                                <div className="grid gap-4">
                                    {ROLES.map((r) => (
                                        <button
                                            key={r.id}
                                            onClick={() => handleRoleSelect(r.id)}
                                            className={`card card-interactive text-left p-6 ${role === r.id ? 'border-primary-500' : ''}`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient flex items-center justify-center text-white shrink-0">
                                                    <r.icon size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-1">{r.title}</h3>
                                                    <p className="text-secondary text-sm mb-3">{r.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {r.features.map((f, i) => (
                                                            <span key={i} className="badge badge-neutral text-xs">
                                                                {f}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <ArrowRight size={20} className="text-tertiary" />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-secondary">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-primary-500 font-medium hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Step 2: Account Details */}
                        {step === 2 && (
                            <>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-500 text-sm font-medium mb-4">
                                        <Check size={16} />
                                        {ROLES.find(r => r.id === role)?.title}
                                    </div>
                                    <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                                    <p className="text-secondary">Fill in your details to get started</p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    {error && (
                                        <div className="p-4 rounded-lg bg-error-500/10 border border-error-500/30 text-error-500 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <Input
                                        label={role === 'space' ? 'Space Name' : role === 'employer' ? 'Company Name' : 'Full Name'}
                                        type="text"
                                        placeholder={role === 'space' ? 'Your Space Name' : role === 'employer' ? 'Your Company' : 'John Doe'}
                                        icon={User}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Email"
                                        type="email"
                                        placeholder="you@example.com"
                                        icon={Mail}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />

                                    <Input
                                        label="Password"
                                        type="password"
                                        placeholder="Create a password"
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

                                    <label className="flex items-start gap-3 cursor-pointer mt-2">
                                        <input type="checkbox" className="w-5 h-5 mt-0.5 rounded" required />
                                        <span className="text-sm text-secondary">
                                            I agree to the{' '}
                                            <a href="#" className="text-primary-500 hover:underline">Terms of Service</a>
                                            {' '}and{' '}
                                            <a href="#" className="text-primary-500 hover:underline">Privacy Policy</a>
                                        </span>
                                    </label>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full mt-2"
                                        loading={loading}
                                    >
                                        Create Account
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-secondary">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-primary-500 font-medium hover:underline">
                                            Sign in
                                        </Link>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="hidden lg:flex flex-1 bg-gradient-hero relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-12">
                        <div className="text-6xl mb-6 animate-float">
                            {role === 'agent' && '👤'}
                            {role === 'space' && '🏢'}
                            {role === 'employer' && '🏛️'}
                            {!role && '✨'}
                        </div>
                        <h2 className="text-3xl font-bold mb-4">
                            {role ? `Welcome, ${ROLES.find(r => r.id === role)?.title}!` : 'Start Your Journey'}
                        </h2>
                        <p className="text-lg opacity-90 max-w-md">
                            {role === 'agent' && 'Showcase your skills and connect with clients worldwide'}
                            {role === 'space' && 'Turn your workspace into a thriving business hub'}
                            {role === 'employer' && 'Build your dream team with top talent from Accescube'}
                            {!role && 'Choose your path and unlock your potential'}
                        </p>
                    </div>
                </div>
                <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 animate-float" />
                <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1s' }} />
            </div>
        </div>
    );
}

export default Register;
