import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { BottomNav } from '../../components/layout/Navigation';
import { Badge, Rating, Avatar, VerifiedBadge, SkillBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
    ArrowLeft,
    MapPin,
    Clock,
    CheckCircle,
    Star,
    Heart,
    Share2,
    MessageSquare,
    Calendar,
    Briefcase,
    Sun,
    Moon,
    Send
} from 'lucide-react';

function AgentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { agents, toggleFavorite, isFavorite, createLead, sendMessage } = useData();
    const { theme, toggleTheme } = useTheme();
    const { toast } = useToast();

    const [showHireModal, setShowHireModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [hireData, setHireData] = useState({
        project: '',
        budget: '',
        message: '',
    });
    const [messageText, setMessageText] = useState('');

    const agent = agents.find(a => a.id === id);

    if (!agent) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
                    <Link to="/discover" className="btn btn-primary">Browse Agents</Link>
                </div>
            </div>
        );
    }

    const handleHire = () => {
        if (!user) {
            toast.warning('Please login to hire agents');
            navigate('/login');
            return;
        }
        setShowHireModal(true);
    };

    const submitHireRequest = () => {
        if (!hireData.project || !hireData.budget) {
            toast.error('Please fill in all required fields');
            return;
        }

        createLead({
            agentId: agent.id,
            company: user.name,
            project: hireData.project,
            budget: parseFloat(hireData.budget),
            message: hireData.message,
        });

        toast.success('Hire request sent! The agent will review your project.');
        setShowHireModal(false);
        setHireData({ project: '', budget: '', message: '' });
    };

    const handleSendMessage = () => {
        if (!user) {
            toast.warning('Please login to send messages');
            navigate('/login');
            return;
        }
        setShowMessageModal(true);
    };

    const submitMessage = () => {
        if (!messageText.trim()) {
            toast.error('Please enter a message');
            return;
        }

        sendMessage(agent.name, messageText.trim());
        toast.success('Message sent!');
        setShowMessageModal(false);
        setMessageText('');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: agent.name,
                text: `Check out ${agent.name} on Accescube!`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const handleFavorite = () => {
        toggleFavorite('agent', agent.id);
        toast.success(isFavorite('agent', agent.id) ? 'Removed from favorites' : 'Added to favorites!');
    };

    return (
        <div className="min-h-screen bg-primary pb-20 md:pb-0">
            {/* Header */}
            <header className="sticky top-0 glass z-40">
                <div className="container py-4 flex items-center justify-between">
                    <Link to="/discover" className="flex items-center gap-2 text-secondary hover:text-primary">
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={handleFavorite}
                        >
                            <Heart
                                size={20}
                                fill={isFavorite('agent', agent.id) ? 'var(--error-500)' : 'none'}
                                color={isFavorite('agent', agent.id) ? 'var(--error-500)' : 'currentColor'}
                            />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={handleShare}>
                            <Share2 size={20} />
                        </button>
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={toggleTheme}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="container py-6">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Header */}
                        <div className="card p-6">
                            <div className="flex flex-col sm:flex-row gap-6">
                                <Avatar name={agent.name} size="2xl" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h1 className="text-2xl font-bold">{agent.name}</h1>
                                        {agent.verified && <VerifiedBadge size={20} />}
                                    </div>
                                    <p className="text-lg text-secondary mb-3">{agent.title}</p>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-secondary mb-4">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={16} />
                                            {agent.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={16} />
                                            Responds {agent.responseTime}
                                        </span>
                                        <Rating value={agent.rating} count={agent.reviews} />
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {agent.skills.slice(0, 5).map((skill, i) => (
                                            <SkillBadge key={i}>{skill}</SkillBadge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold mb-4">About</h2>
                            <p className="text-secondary leading-relaxed">{agent.bio}</p>
                        </div>

                        {/* Portfolio */}
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {agent.portfolio.map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-tertiary">
                                        <h3 className="font-medium mb-2">{item.title}</h3>
                                        <p className="text-sm text-secondary">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Reviews</h2>
                                <span className="text-secondary">{agent.reviews} reviews</span>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-tertiary mb-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold">{agent.rating}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i <= Math.round(agent.rating) ? 'var(--warning-400)' : 'none'}
                                                color="var(--warning-400)"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    {[5, 4, 3, 2, 1].map(stars => (
                                        <div key={stars} className="flex items-center gap-2 text-sm">
                                            <span className="w-3">{stars}</span>
                                            <Star size={12} fill="var(--warning-400)" color="var(--warning-400)" />
                                            <div className="flex-1 progress h-2">
                                                <div
                                                    className="progress-bar"
                                                    style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : 3}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sample Reviews */}
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl border border-light">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Avatar name="John D" size="sm" />
                                        <div>
                                            <div className="font-medium text-sm">John D.</div>
                                            <div className="text-xs text-tertiary">2 weeks ago</div>
                                        </div>
                                        <div className="ml-auto flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} size={12} fill="var(--warning-400)" color="var(--warning-400)" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-secondary">
                                        Excellent work! Delivered the project ahead of schedule with great attention to detail.
                                        Communication was fantastic throughout. Highly recommended!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Booking Card */}
                        <div className="card p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-primary-500">
                                    ${agent.hourlyRate}
                                    <span className="text-base font-normal text-secondary">/hour</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">Completed Projects</span>
                                    <span className="font-semibold">{agent.completedProjects}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">Response Time</span>
                                    <span className="font-semibold">{agent.responseTime}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">Availability</span>
                                    <Badge variant={agent.available ? 'success' : 'neutral'}>
                                        {agent.available ? 'Available' : 'Busy'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    icon={Briefcase}
                                    onClick={handleHire}
                                    disabled={!agent.available}
                                >
                                    Hire Now
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    icon={MessageSquare}
                                    onClick={handleSendMessage}
                                >
                                    Send Message
                                </Button>
                                <Button variant="ghost" className="w-full" icon={Calendar}>
                                    Schedule Call
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Hire Modal */}
            <Modal
                isOpen={showHireModal}
                onClose={() => setShowHireModal(false)}
                title={`Hire ${agent.name}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowHireModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={submitHireRequest}>
                            Send Request
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <Input
                        label="Project Name *"
                        placeholder="e.g. Website Redesign"
                        value={hireData.project}
                        onChange={(e) => setHireData({ ...hireData, project: e.target.value })}
                    />
                    <Input
                        label="Budget ($) *"
                        type="number"
                        placeholder="e.g. 2500"
                        value={hireData.budget}
                        onChange={(e) => setHireData({ ...hireData, budget: e.target.value })}
                    />
                    <div className="input-group">
                        <label className="input-label">Project Description</label>
                        <textarea
                            className="input"
                            rows={4}
                            placeholder="Describe your project requirements..."
                            value={hireData.message}
                            onChange={(e) => setHireData({ ...hireData, message: e.target.value })}
                        />
                    </div>
                </div>
            </Modal>

            {/* Message Modal */}
            <Modal
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                title={`Message ${agent.name}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowMessageModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={submitMessage} icon={Send}>
                            Send
                        </Button>
                    </>
                }
            >
                <div className="input-group">
                    <label className="input-label">Your Message</label>
                    <textarea
                        className="input"
                        rows={4}
                        placeholder="Hi! I'd like to discuss a potential project..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />
                </div>
            </Modal>

            <BottomNav />
        </div>
    );
}

export default AgentDetail;
