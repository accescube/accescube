import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, StatCard, CubeCard } from '../../components/ui/Card';
import { Badge, Avatar } from '../../components/ui/Badge';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import {
    DollarSign,
    Users,
    Building2,
    Briefcase,
    ArrowRight,
    Plus,
    Search,
    TrendingUp
} from 'lucide-react';

function EmployerDashboard() {
    const { user } = useAuth();
    const { agents, spaces, getHiredAgents, getEmployerSpaces } = useData();
    const { toast } = useToast();

    const hiredAgents = getHiredAgents(user?.id || '3');
    const mySpaces = getEmployerSpaces(user?.id || '3');

    const stats = {
        budget: { value: '$25,000', change: '$18,500 spent', type: 'neutral' },
        team: { value: hiredAgents.length.toString(), change: '+2 this month', type: 'positive' },
        projects: { value: '4', change: '2 active', type: 'neutral' },
        spaces: { value: mySpaces.length.toString(), change: '$1,200/mo', type: 'neutral' },
    };

    const activeProjects = [
        { id: 1, name: 'Platform Redesign', progress: 65, team: 3, budget: '$8,500' },
        { id: 2, name: 'Mobile App MVP', progress: 40, team: 2, budget: '$12,000' },
    ];

    return (
        <AppLayout title="Company Dashboard">
            {/* Welcome */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{user?.name}</h1>
                    <Badge variant="primary">Employer Cube</Badge>
                </div>
                <p className="text-secondary">Manage your virtual company, team, and projects.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Monthly Budget"
                    value={stats.budget.value}
                    change={stats.budget.change}
                    changeType={stats.budget.type}
                    icon={DollarSign}
                />
                <StatCard
                    label="Team Members"
                    value={stats.team.value}
                    change={stats.team.change}
                    changeType={stats.team.type}
                    icon={Users}
                />
                <StatCard
                    label="Active Projects"
                    value={stats.projects.value}
                    change={stats.projects.change}
                    changeType={stats.projects.type}
                    icon={Briefcase}
                />
                <StatCard
                    label="Rented Spaces"
                    value={stats.spaces.value}
                    change={stats.spaces.change}
                    changeType={stats.spaces.type}
                    icon={Building2}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Team Members */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Team Members</h2>
                            <Link to="/employer/agents" className="btn btn-primary btn-sm">
                                <Plus size={16} className="mr-2" />
                                Manage Team
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {hiredAgents.length === 0 ? (
                                <p className="text-secondary text-center py-4">No agents hired yet.</p>
                            ) : (
                                hiredAgents.slice(0, 3).map((member) => (
                                    <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                                        <Avatar name={member.name} size="md" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{member.name}</span>
                                                <Badge variant="success">Active</Badge>
                                            </div>
                                            <p className="text-sm text-secondary">{member.role}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold">{member.rate}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {hiredAgents.length > 3 && (
                                <Link to="/employer/agents" className="block text-center text-primary-600 text-sm hover:underline mt-2">
                                    View All Team Members
                                </Link>
                            )}
                        </div>
                    </Card>

                    {/* Active Projects */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Active Projects</h2>
                            <Button variant="ghost" size="sm">
                                View All <ArrowRight size={16} />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {activeProjects.map((project) => (
                                <div key={project.id} className="p-4 rounded-xl bg-secondary">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium">{project.name}</h3>
                                        <span className="text-sm text-secondary">{project.progress}%</span>
                                    </div>
                                    <div className="progress mb-3">
                                        <div className="progress-bar" style={{ width: `${project.progress}%` }} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-secondary">
                                        <span className="flex items-center gap-1">
                                            <Users size={14} />
                                            {project.team} members
                                        </span>
                                        <span className="font-semibold text-primary">{project.budget}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link to="/discover?tab=agents" className="btn btn-primary w-full justify-start">
                                <Search size={18} className="mr-2" />
                                Find Agents
                            </Link>
                            <Link to="/discover?tab=spaces" className="btn btn-secondary w-full justify-start">
                                <Building2 size={18} className="mr-2" />
                                Browse Spaces
                            </Link>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                icon={TrendingUp}
                                onClick={() => toast.info('Detailed reports coming soon!')}
                            >
                                View Reports
                            </Button>
                        </div>
                    </Card>

                    {/* Recommended Agents */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Recommended</h3>
                            <Button variant="ghost" size="sm">All</Button>
                        </div>
                        <div className="space-y-3">
                            {agents.slice(0, 3).map((agent) => (
                                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                                    <Avatar name={agent.name} size="sm" />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">{agent.name}</h4>
                                        <p className="text-xs text-secondary truncate">{agent.title}</p>
                                    </div>
                                    <div className="text-xs font-semibold text-primary-500">
                                        ${agent.hourlyRate}/hr
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Budget Overview */}
                    <Card>
                        <h3 className="font-semibold mb-4">Budget Overview</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-secondary">Total Budget</span>
                                <span className="font-semibold">$25,000</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-secondary">Spent</span>
                                <span className="font-semibold">$18,500</span>
                            </div>
                            <div className="progress">
                                <div className="progress-bar" style={{ width: '74%' }} />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-secondary">Remaining</span>
                                <span className="font-semibold text-success-500">$6,500</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default EmployerDashboard;
