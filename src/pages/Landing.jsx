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
            {/* WhatsApp Inspired Top Header */}
            <header className="sticky top-0 z-50 bg-primary-500 text-white shadow-md">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-white text-primary-500 flex items-center justify-center font-bold text-xl shadow-sm">
                            A
                        </div>
                        <Link to="/" className="font-bold text-lg tracking-tight">
                            Accescube
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <Link
                            to="/login"
                            className="text-sm font-medium px-3 py-1.5 hover:bg-white/10 rounded-full transition hidden sm:block"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="bg-white text-primary-600 font-semibold text-xs md:text-sm px-5 py-2 rounded-full shadow-sm hover:bg-primary-100 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* Full Width Background Hero Section */}
            <section 
                className="relative pt-24 pb-32 px-4 flex items-center justify-center min-h-[600px] overflow-hidden"
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
        
                    {/* WhatsApp style search & quick navigation tab */}
                    <div className="w-full max-w-2xl mx-auto bg-elevated/95 backdrop-blur-xl text-primary rounded-2xl p-4 shadow-2xl mb-8 text-left border border-light">
                        <div className="flex border-b border-light mb-4">
                            <button
                                type="button"
                                onClick={() => setActiveTab('agents')}
                                className={`flex-1 py-3 text-center text-sm md:text-base font-bold border-b-2 transition flex items-center justify-center gap-2 ${
                                    activeTab === 'agents'
                                        ? 'border-primary-500 text-primary-500'
                                        : 'border-transparent text-secondary hover:text-primary'
                                }`}
                            >
                                <Users size={18} /> Find Agents
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('spaces')}
                                className={`flex-1 py-3 text-center text-sm md:text-base font-bold border-b-2 transition flex items-center justify-center gap-2 ${
                                    activeTab === 'spaces'
                                        ? 'border-primary-500 text-primary-500'
                                        : 'border-transparent text-secondary hover:text-primary'
                                }`}
                            >
                                <Building2 size={18} /> Workspaces
                            </button>
                        </div>
        
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary" size={20} />
                                <input
                                    type="text"
                                    placeholder={activeTab === 'agents' ? "Search skill, role, or username..." : "Search office, desk, or location..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-secondary text-base rounded-full text-primary placeholder-tertiary border border-transparent focus:border-primary-500 focus:outline-none transition shadow-inner"
                                />
                            </div>
                            <Button type="submit" variant="primary" className="!px-8 !py-3 !rounded-full !text-base shadow-lg hover:shadow-xl font-bold">
                                Search
                            </Button>
                        </form>
                    </div>
        
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-200 font-medium drop-shadow-md">
                        <span className="flex items-center gap-1.5"><Check size={16} className="text-success-500" /> No hidden fees</span>
                        <span className="flex items-center gap-1.5"><Check size={16} className="text-success-500" /> Instant connect</span>
                        <span className="flex items-center gap-1.5"><Check size={16} className="text-success-500" /> Verified profiles</span>
                    </div>
                </div>
            </section>

            {/* Quick Action Cards (WhatsApp Style Panel) */}
            <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20 mb-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-elevated p-6 rounded-2xl shadow-card border border-light flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 font-bold">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base mb-1">Skilled Agents</h3>
                            <p className="text-secondary text-xs mb-3 leading-relaxed">List your expertise or hire elite verified professionals on demand.</p>
                            <Link to="/register?role=agent" className="text-xs font-bold text-primary-500 inline-flex items-center gap-1 hover:underline">
                                Join as Agent <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-elevated p-6 rounded-2xl shadow-card border border-light flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 font-bold">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base mb-1">Space Cubes</h3>
                            <p className="text-secondary text-xs mb-3 leading-relaxed">Monetize extra office desks or find premium workspaces instantly.</p>
                            <Link to="/register?role=space" className="text-xs font-bold text-primary-500 inline-flex items-center gap-1 hover:underline">
                                List Workspace <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-elevated p-6 rounded-2xl shadow-card border border-light flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 font-bold">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-base mb-1">Company Cubes</h3>
                            <p className="text-secondary text-xs mb-3 leading-relaxed">Build your virtual team, manage projects, and scale your business.</p>
                            <Link to="/register?role=employer" className="text-xs font-bold text-primary-500 inline-flex items-center gap-1 hover:underline">
                                Register Company <ArrowRight size={14} />
                            </Link>
                        </div>
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
