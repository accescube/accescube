import { useState } from 'react';
import { AppLayout } from '../../components/layout/Navigation';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge, Avatar } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
    Plus,
    Trash2,
    Briefcase,
    Search,
    Star,
    DollarSign,
    MoreHorizontal
} from 'lucide-react';

function HiredAgents() {
    const { user } = useAuth();
    const { hiredAgents, agents, getHiredAgents, hireAgent, removeHiredAgent } = useData();
    const { toast } = useToast();

    const [showHireModal, setShowHireModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Get agents hired by current employer
    const myAgents = getHiredAgents(user?.id || '3'); // Default to '3' (TechStart) for demo if no user

    // Available agents (not already hired)
    const availableAgents = agents.filter(a =>
        !myAgents.some(ma => ma.agentId === a.id) &&
        (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleHire = (agent) => {
        hireAgent(user?.id || '3', {
            agentId: agent.id,
            name: agent.name,
            role: agent.title,
            rate: `$${agent.hourlyRate}/hr`,
            avatar: agent.avatar
        });
        toast.success(`Allocated ${agent.name} to your team!`);
        setShowHireModal(false);
    };

    const handleRemove = (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name} from your team?`)) {
            removeHiredAgent(id);
            toast.info(`${name} removed from team.`);
        }
    };

    const handleSeedAgents = async () => {
        const sampleAgents = [
            {
                name: 'Alex Rivera',
                title: 'Full Stack Developer',
                bio: 'Passionate developer with 5+ years of experience in React and Node.js.',
                location: 'New York, NY',
                hourlyRate: 85,
                rating: 4.9,
                reviews: 124,
                skills: ['React', 'Node.js', 'Firebase', 'TypeScript'],
                avatar: null,
                category: 'developer',
                verified: true
            },
            {
                name: 'Sarah Chen',
                title: 'UI/UX Designer',
                bio: 'Creating beautiful and functional user experiences for mobile and web.',
                location: 'San Francisco, CA',
                hourlyRate: 75,
                rating: 4.8,
                reviews: 89,
                skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
                avatar: null,
                category: 'designer',
                verified: true
            },
            {
                name: 'Marcus Thorne',
                title: 'Digital Marketing Expert',
                bio: 'Helping brands grow through data-driven marketing strategies.',
                location: 'London, UK',
                hourlyRate: 65,
                rating: 4.7,
                reviews: 56,
                skills: ['SEO', 'SEM', 'Content Strategy', 'Analytics'],
                avatar: null,
                category: 'marketing',
                verified: false
            }
        ];

        try {
            for (const agent of sampleAgents) {
                await addAgent({
                    ...agent,
                    userId: `seed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    createdAt: new Date().toISOString()
                });
            }
            toast.success('Marketplace seeded with demo agents!');
        } catch (error) {
            toast.error('Failed to seed agents');
        }
    };

    return (
        <AppLayout title="Hired Agents">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-1">My Team</h1>
                    <p className="text-secondary">Manage your hired agents and freelancers.</p>
                </div>
                <div className="flex gap-2">
                    {agents.length === 0 && (
                        <Button variant="ghost" onClick={handleSeedAgents} className="text-secondary hover:text-primary">
                            Seed Demo Agents
                        </Button>
                    )}
                    <Button variant="primary" icon={Plus} onClick={() => setShowHireModal(true)}>
                        Hire Agent
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAgents.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-secondary">
                        <p>No agents hired yet.</p>
                        <Button variant="ghost" className="mt-2 text-primary-600" onClick={() => setShowHireModal(true)}>
                            Browse Available Agents
                        </Button>
                    </div>
                ) : (
                    myAgents.map((agent) => (
                        <Card key={agent.id} className="relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-error-500 hover:text-error-600 btn-icon"
                                    onClick={() => handleRemove(agent.id, agent.name)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>

                            <div className="flex flex-col items-center text-center mb-4">
                                <Avatar name={agent.name} size="lg" className="mb-3" />
                                <h3 className="font-bold text-lg">{agent.name}</h3>
                                <p className="text-secondary">{agent.role}</p>
                                <Badge variant="success" className="mt-2">Active</Badge>
                            </div>

                            <div className="border-t border-light pt-4 mt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-secondary">Rate</span>
                                    <span className="font-semibold">{agent.rate}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-2">
                                    <span className="text-secondary">Hired Date</span>
                                    <span className="font-medium">{new Date(agent.hiredAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <Button variant="secondary" className="w-full mt-4">
                                View Performance
                            </Button>
                        </Card>
                    ))
                )}
            </div>

            {/* Hire Agent Modal */}
            <Modal
                isOpen={showHireModal}
                onClose={() => setShowHireModal(false)}
                title="Hire New Agent"
                className="max-w-2xl"
                footer={
                    <Button variant="secondary" onClick={() => setShowHireModal(false)}>Cancel</Button>
                }
            >
                <div>
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                        <Input
                            className="pl-10"
                            placeholder="Search agents by name or skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                        {availableAgents.map((agent) => (
                            <div key={agent.id} className="flex items-center gap-4 p-4 rounded-xl border border-light hover:border-primary-200 transition-colors">
                                <Avatar name={agent.name} size="md" />
                                <div className="flex-1">
                                    <h4 className="font-bold">{agent.name}</h4>
                                    <p className="text-sm text-secondary">{agent.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" size="sm" className="text-xs">
                                            ${agent.hourlyRate}/hr
                                        </Badge>
                                        <div className="flex items-center text-xs text-warning-500 font-medium">
                                            <Star size={12} fill="currentColor" className="mr-0.5" />
                                            {agent.rating}
                                        </div>
                                    </div>
                                </div>
                                <Button size="sm" variant="primary" onClick={() => handleHire(agent)}>
                                    Hire
                                </Button>
                            </div>
                        ))}
                        {availableAgents.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-secondary">No agents found matching your search.</p>
                                {agents.length === 0 && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="mt-4"
                                        onClick={handleSeedAgents}
                                    >
                                        Seed Marketplace with Demo Agents
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </AppLayout>
    );
}

export default HiredAgents;
