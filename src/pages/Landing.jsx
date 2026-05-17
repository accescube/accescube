import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { CubeCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import {
    Sun,
    Moon,
    Users,
    Building2,
    Briefcase,
    Search,
    ArrowRight,
    Star,
    ShieldCheck,
    MessageSquare,
    Zap,
    Check,
    Lock
} from 'lucide-react';

function Landing() {
    const { theme, toggleTheme } = useTheme();
    const { agents, spaces } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('agents');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/discover?tab=${activeTab}&q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen bg-secondary text-primary font-ui">
            {/* Fixed Glassmorphism Navbar */}
            <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/40 border-b border-white/10 shadow-lg">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/">
                            <img
                                src="/logo-src.png"
                                alt="Accescube Logo"
                                style={{
                                    height: '50px',
                                    width: 'auto',
                                    maxWidth: '160px',
                                    objectFit: 'contain',
                                    display: 'block',
                                    filter: 'brightness(0) invert(1)'
                                }}
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                        >
                            {theme === 'dark' ? <Sun size={22} className="drop-shadow-md" /> : <Moon size={22} className="drop-shadow-md" />}
                        </button>
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
                    </div>
                </div>
            </header>

            {/* Full Width Background Hero Section */}
            <section 
                className="relative pt-36 pb-24 px-4 flex items-center justify-center min-h-screen overflow-hidden"
                style={{
                    backgroundImage: 'url(/hero-agent.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Dark Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

                <div className="container mx-auto max-w-4xl relative z-10 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider mb-6 text-white border border-white/30 shadow-lg">
                        <ShieldCheck size={14} /> Professional Business Platform
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white drop-shadow-lg">
                        Connect & Collaborate <br />
                        <span className="text-primary-400 font-bold drop-shadow-md">Instantly.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 font-normal leading-relaxed drop-shadow-md">
                        A seamless, fast, and secure network connecting skilled agents, premium workspaces, and growing companies in India and beyond.
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-300 font-medium drop-shadow-md mt-2">
                        <span className="flex items-center gap-2"><Check size={18} className="text-success-400" /> No hidden fees</span>
                        <span className="flex items-center gap-2"><Check size={18} className="text-success-400" /> Instant connect</span>
                        <span className="flex items-center gap-2"><Check size={18} className="text-success-400" /> Verified profiles</span>
                    </div>
                </div>
            </section>



            {/* Quick Action Cards */}
            <section className="max-w-6xl mx-auto px-4 py-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-elevated p-8 rounded-2xl shadow-xl border border-light flex flex-col items-center text-center transition hover:shadow-2xl hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold mb-4">
                            <Users size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Skilled Agents</h3>
                        <p className="text-secondary text-sm mb-4 leading-relaxed flex-grow">List your expertise or hire elite verified professionals on demand.</p>
                        <Link to="/register?role=agent" className="text-sm font-bold text-primary-500 inline-flex items-center gap-1.5 hover:underline">
                            Join as Agent <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="bg-elevated p-8 rounded-2xl shadow-xl border border-light flex flex-col items-center text-center transition hover:shadow-2xl hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-2xl bg-success-500/10 text-success-500 flex items-center justify-center font-bold mb-4">
                            <Building2 size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Space Cubes</h3>
                        <p className="text-secondary text-sm mb-4 leading-relaxed flex-grow">Monetize extra office desks or find premium workspaces instantly.</p>
                        <Link to="/register?role=space" className="text-sm font-bold text-success-500 inline-flex items-center gap-1.5 hover:underline">
                            List Workspace <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="bg-elevated p-8 rounded-2xl shadow-xl border border-light flex flex-col items-center text-center transition hover:shadow-2xl hover:-translate-y-1">
                        <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold mb-4">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="font-bold text-lg mb-2">Company Cubes</h3>
                        <p className="text-secondary text-sm mb-4 leading-relaxed flex-grow">Build your virtual team, manage projects, and scale your business.</p>
                        <Link to="/register?role=employer" className="text-sm font-bold text-primary-500 inline-flex items-center gap-1.5 hover:underline">
                            Register Company <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Agents Section */}
            <section className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Verified Professionals</h2>
                        <p className="text-xs md:text-sm text-secondary">Discover skilled agents ready for new projects</p>
                    </div>
                    <Link to="/discover?tab=agents" className="text-xs md:text-sm font-semibold text-primary-500 flex items-center gap-1 hover:underline">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {agents.slice(0, 4).map((agent) => (
                        <CubeCard key={agent.id} type="agent" data={agent} />
                    ))}
                </div>
            </section>

            {/* Featured Workspaces Section */}
            <section className="max-w-6xl mx-auto px-4 py-12 border-t border-light mt-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">Top Workspaces</h2>
                        <p className="text-xs md:text-sm text-secondary">Book desks, meeting rooms, or private cabins</p>
                    </div>
                    <Link to="/discover?tab=spaces" className="text-xs md:text-sm font-semibold text-primary-500 flex items-center gap-1 hover:underline">
                        Explore Spaces <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {spaces.filter(s => s.featured).slice(0, 4).map((space) => (
                        <CubeCard key={space.id} type="space" data={space} />
                    ))}
                </div>
            </section>

            {/* Why Accescube - Simple 3 Column List */}
            <section className="bg-primary-500/5 py-16 border-y border-light mt-8">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Designed for Simplicity & Speed</h2>
                    <p className="text-sm md:text-base text-secondary max-w-xl mx-auto mb-12">
                        Get straight to business without complex onboarding or unnecessary roadblocks.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="bg-elevated p-6 rounded-2xl shadow-sm border border-light">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mb-4">
                                <MessageSquare size={20} />
                            </div>
                            <h3 className="font-bold text-base mb-2">Instant Messaging</h3>
                            <p className="text-secondary text-xs leading-relaxed">
                                Connect directly with professionals or space hosts through our clean, real-time chat interface.
                            </p>
                        </div>

                        <div className="bg-elevated p-6 rounded-2xl shadow-sm border border-light">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mb-4">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="font-bold text-base mb-2">Verified Trust</h3>
                            <p className="text-secondary text-xs leading-relaxed">
                                Every professional and workspace goes through thorough verification to ensure quality and reliability.
                            </p>
                        </div>

                        <div className="bg-elevated p-6 rounded-2xl shadow-sm border border-light">
                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold mb-4">
                                <Zap size={20} />
                            </div>
                            <h3 className="font-bold text-base mb-2">Zero Hassle Booking</h3>
                            <p className="text-secondary text-xs leading-relaxed">
                                Secure workspaces or hire talent in just three clicks with streamlined, straightforward agreements.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="bg-gradient-primary text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
                    <h2 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight">Ready to Get Started?</h2>
                    <p className="text-primary-100 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed font-normal">
                        Join our fast-growing network of top talent and premium workspaces today.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold px-8 py-3.5 rounded-full text-sm shadow-lg hover:bg-primary-100 transition duration-200"
                    >
                        Create Your Free Account <ArrowRight size={16} />
                    </Link>
                </div>
            </section>

            {/* Clean Footer */}
            <footer className="bg-elevated border-t border-light py-10 px-4 text-xs text-secondary font-medium">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xs">
                            A
                        </div>
                        <span className="font-bold text-primary text-sm">Accescube</span>
                        <span className="text-tertiary">| Fast Business Network</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-secondary">
                        <Link to="/discover" className="hover:text-primary-500 transition">Find Agents</Link>
                        <Link to="/discover?tab=spaces" className="hover:text-primary-500 transition">Workspaces</Link>
                        <Link to="/community" className="hover:text-primary-500 transition">Events</Link>
                        <Link to="/login" className="hover:text-primary-500 transition font-semibold text-primary">Sign in</Link>
                    </div>

                    <div className="text-tertiary">
                        &copy; {new Date().getFullYear()} Accescube. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;
