import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    MapPin,
    ArrowRight,
    Star,
    CheckCircle,
    Sparkles,
    Zap,
    Shield,
    Globe
} from 'lucide-react';

function Landing() {
    const { theme, toggleTheme } = useTheme();
    const { agents, spaces } = useData();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 glass z-50">
                <div className="container flex items-center justify-between py-3 md:py-4 gap-2">
                    <Link to="/" className="flex items-center shrink-0">
                        <span className="text-xl md:text-2xl font-black tracking-tighter" style={{ textTransform: 'uppercase', color: 'var(--primary-500)' }}>ACCESCUBE</span>
                    </Link>

                    <div className="flex items-center gap-2 md:gap-6">
                        <button
                            className="p-2 text-secondary hover:text-white transition-colors"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <Link to="/login" className="font-semibold text-xs md:text-sm hover:text-primary transition-colors hidden sm:block">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary !text-[10px] md:!text-sm !py-2 md:!py-3 !px-4 md:!px-8 shadow-glow whitespace-nowrap">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>Next-Gen Business Platform</span>
                    </div>

                    <h1 className="hero-title">
                        Building the Future of
                        <br />
                        <span className="text-primary-500">Business Collaboration.</span>
                    </h1>

                    <p className="hero-description text-xl opacity-70">
                        Join the elite ecosystem connecting top agencies, innovative employers, and premium workspaces.
                    </p>

                    {/* Search Bar */}
                    <div className="search-wrapper mb-8 animate-fade-in-up stagger-4">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search agents, spaces, or companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="hero-cta mb-16">
                        <Link to="/register?role=agent" className="btn btn-primary btn-lg">
                            <Users size={20} />
                            I'm an Agent
                        </Link>
                        <Link to="/register?role=space" className="btn btn-secondary btn-lg">
                            <Building2 size={20} />
                            List My Space
                        </Link>
                        <Link to="/register?role=employer" className="btn btn-primary btn-lg">
                            <Briefcase size={20} />
                            Hire Talent
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 md:mt-24 border-t border-light pt-12 md:pt-16">
                        <div className="text-center group flex-1 min-w-[120px]">
                            <div className="text-3xl md:text-5xl font-black text-white group-hover:text-neon-cyan transition-colors">10K+</div>
                            <div className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-secondary mt-2">Elite Agents</div>
                        </div>
                        <div className="text-center group flex-1 min-w-[120px]">
                            <div className="text-3xl md:text-5xl font-black text-white group-hover:text-neon-violet transition-colors">500+</div>
                            <div className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-secondary mt-2">Workspaces</div>
                        </div>
                        <div className="text-center group flex-1 min-w-[120px]">
                            <div className="text-3xl md:text-5xl font-black text-white group-hover:text-neon-pink transition-colors">2K+</div>
                            <div className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-secondary mt-2">Companies</div>
                        </div>
                        <div className="text-center group flex-1 min-w-[120px]">
                            <div className="text-3xl md:text-5xl font-black text-white group-hover:text-neon-cyan transition-colors">$5M+</div>
                            <div className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-secondary mt-2">Volume</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-secondary border-y border-light">
                <div className="container">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
                            Elevate Your <span className="text-gradient">Business Game.</span>
                        </h2>
                        <p className="text-secondary text-xl max-w-3xl mx-auto">
                            Stop settling. Start scaling with the world's most advanced professional ecosystem.
                        </p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-card group">
                            <div className="feature-icon bg-zinc-900 group-hover:bg-primary-500 text-white transition-colors">
                                <Users size={28} />
                            </div>
                            <h3 className="feature-title text-2xl">Elite Agents</h3>
                            <p className="feature-description text-base">
                                Access a curated network of top-tier professional agents ready to scale your business.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Building2 size={28} />
                            </div>
                            <h3 className="feature-title">Space Cubes</h3>
                            <p className="feature-description">
                                List desks, cabins, or offices. Manage bookings, set dynamic pricing,
                                and reach professionals looking for workspaces.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Briefcase size={28} />
                            </div>
                            <h3 className="feature-title">Employer Cubes</h3>
                            <p className="feature-description">
                                Build virtual companies. Hire agents, rent spaces, manage teams,
                                and track projects all in one place.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Zap size={28} />
                            </div>
                            <h3 className="feature-title">Smart Matching</h3>
                            <p className="feature-description">
                                AI-powered recommendations connect you with the right agents,
                                spaces, or opportunities based on your needs.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield size={28} />
                            </div>
                            <h3 className="feature-title">Verified Trust</h3>
                            <p className="feature-description">
                                Verified badges, reviews, and credibility scores build trust
                                and help you make confident decisions.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <Globe size={28} />
                            </div>
                            <h3 className="feature-title">Local Community</h3>
                            <p className="feature-description">
                                Area-based discovery, local events, workshops, and networking
                                opportunities grow your local presence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Agents */}
            <section className="py-16 container">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold">Top Agents</h2>
                        <p className="text-secondary">Browse verified professionals</p>
                    </div>
                    <Link to="/discover?tab=agents" className="btn btn-ghost">
                        View All <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {agents.slice(0, 4).map((agent) => (
                        <CubeCard
                            key={agent.id}
                            type="agent"
                            data={agent}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Spaces */}
            <section className="py-24 border-t border-medium">
                <div className="container">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-black">Premium Spaces</h2>
                            <p className="text-secondary mt-2">Elite workspaces for elite professionals.</p>
                        </div>
                        <Link to="/discover?tab=spaces" className="btn btn-outline">
                            Browse All <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {spaces.filter(s => s.featured).slice(0, 4).map((space) => (
                            <CubeCard
                                key={space.id}
                                type="space"
                                data={space}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 container">
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Loved by Professionals</h2>
                    <p className="text-secondary">Join thousands of satisfied users</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="testimonial-card">
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="var(--warning-400)" color="var(--warning-400)" />)}
                        </div>
                        <p className="testimonial-quote">
                            "Accescube transformed my freelance career. I've tripled my client base
                            and the verification badge really builds trust."
                        </p>
                        <div className="testimonial-author">
                            <div className="avatar avatar-md">AJ</div>
                            <div>
                                <div className="testimonial-name">Alex Johnson</div>
                                <div className="testimonial-role">Full Stack Developer</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="var(--warning-400)" color="var(--warning-400)" />)}
                        </div>
                        <p className="testimonial-quote">
                            "Managing our co-working space is so much easier now. The booking system
                            and analytics help us maximize revenue."
                        </p>
                        <div className="testimonial-author">
                            <div className="avatar avatar-md">UH</div>
                            <div>
                                <div className="testimonial-name">Urban Work Hub</div>
                                <div className="testimonial-role">Space Provider</div>
                            </div>
                        </div>
                    </div>

                    <div className="testimonial-card">
                        <div className="flex items-center gap-1 mb-3">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="var(--warning-400)" color="var(--warning-400)" />)}
                        </div>
                        <p className="testimonial-quote">
                            "Finding qualified freelancers was always a challenge. Accescube's
                            verification system ensures we hire the best talent."
                        </p>
                        <div className="testimonial-author">
                            <div className="avatar avatar-md">TS</div>
                            <div>
                                <div className="testimonial-name">TechStart Inc</div>
                                <div className="testimonial-role">Employer</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2 className="cta-title">Ready to Build Your Cube?</h2>
                <p className="cta-description">
                    Join thousands of professionals growing their business on Accescube
                </p>
                <Link to="/register" className="cta-button">
                    Get Started Free
                </Link>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="flex items-center gap-3 mb-4">
                            <img src="/cube.svg" alt="ACCESCUBE" style={{ width: 32, height: 32 }} />
                            <span className="text-lg font-extrabold tracking-wider" style={{ textTransform: 'uppercase' }}>ACCESCUBE</span>
                        </div>
                        <p className="text-sm text-secondary mb-4">
                            The next-generation platform connecting agents, employers, and workspaces.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-secondary hover:text-primary">Twitter</a>
                            <a href="#" className="text-secondary hover:text-primary">LinkedIn</a>
                            <a href="#" className="text-secondary hover:text-primary">Instagram</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Platform</h4>
                        <div className="footer-links">
                            <Link to="/discover" className="footer-link">Find Agents</Link>
                            <Link to="/discover?tab=spaces" className="footer-link">Find Spaces</Link>
                            <Link to="/community" className="footer-link">Community</Link>
                            <Link to="/pricing" className="footer-link">Pricing</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Company</h4>
                        <div className="footer-links">
                            <a href="#" className="footer-link">About Us</a>
                            <a href="#" className="footer-link">Careers</a>
                            <a href="#" className="footer-link">Blog</a>
                            <a href="#" className="footer-link">Contact</a>
                        </div>
                    </div>

                    <div>
                        <h4 className="footer-title">Legal</h4>
                        <div className="footer-links">
                            <a href="#" className="footer-link">Privacy Policy</a>
                            <a href="#" className="footer-link">Terms of Service</a>
                            <a href="#" className="footer-link">Cookie Policy</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    © 2024 Accescube. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Landing;
