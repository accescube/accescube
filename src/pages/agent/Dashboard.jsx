import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge, VerifiedBadge, Avatar } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import {
    DollarSign,
    TrendingUp,
    Users,
    Star,
    Briefcase,
    Clock,
    ArrowRight,
    MessageSquare,
    Calendar,
    CheckCircle,
    AlertCircle,
    Check,
    X,
    Eye
} from 'lucide-react';

function AgentDashboard() {
    const { user } = useAuth();
    const { leads, acceptLead, rejectLead, wallet, getUnreadCount } = useData();
    const { toast } = useToast();
    const [selectedLead, setSelectedLead] = useState(null);
    const [showLeadModal, setShowLeadModal] = useState(false);

    // Calculate real stats from data
    const stats = {
        earnings: {
            value: `$${wallet.balance.toLocaleString()}`,
            change: '+12.5%',
            type: 'positive'
        },
        leads: {
            value: leads.filter(l => l.status !== 'rejected').length.toString(),
            change: `+${leads.filter(l => l.status === 'new').length} new`,
            type: 'positive'
        },
        rating: { value: '4.9', change: '127 reviews', type: 'neutral' },
        projects: {
            value: leads.filter(l => l.status === 'accepted').length.toString(),
            change: `${leads.filter(l => l.status === 'accepted').length} active`,
            type: 'neutral'
        },
    };

    const recentLeads = leads.slice(0, 5);

    const upcomingTasks = [
        { id: 1, task: 'Client call with TechStart', time: 'Today, 3:00 PM', type: 'meeting' },
        { id: 2, task: 'Submit project milestone', time: 'Tomorrow, 11:00 AM', type: 'deadline' },
        { id: 3, task: 'Review design mockups', time: 'Wed, 2:00 PM', type: 'task' },
    ];

    const handleAcceptLead = (leadId) => {
        acceptLead(leadId);
        toast.success('Lead accepted! You can now start the project.');
        setShowLeadModal(false);
    };

    const handleRejectLead = (leadId) => {
        rejectLead(leadId);
        toast.info('Lead declined.');
        setShowLeadModal(false);
    };

    const openLeadDetails = (lead) => {
        setSelectedLead(lead);
        setShowLeadModal(true);
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;

        if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return `${Math.floor(diff / 86400000)} days ago`;
    };

    return (
        <AppLayout title="Dashboard">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    {user?.verified && <VerifiedBadge size={24} />}
                </div>
                <p className="text-secondary">Here's what's happening with your cube today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Earnings (This Month)"
                    value={stats.earnings.value}
                    change={stats.earnings.change}
                    changeType={stats.earnings.type}
                    icon={DollarSign}
                />
                <StatCard
                    label="Active Leads"
                    value={stats.leads.value}
                    change={stats.leads.change}
                    changeType={stats.leads.type}
                    icon={Users}
                />
                <StatCard
                    label="Rating"
                    value={stats.rating.value}
                    change={stats.rating.change}
                    changeType={stats.rating.type}
                    icon={Star}
                />
                <StatCard
                    label="Projects"
                    value={stats.projects.value}
                    change={stats.projects.change}
                    changeType={stats.projects.type}
                    icon={Briefcase}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Leads */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Recent Leads</h2>
                            <Link to="/agent/leads" className="btn btn-ghost btn-sm">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {recentLeads.length === 0 ? (
                                <p className="text-center text-secondary py-8">No leads yet. Keep your cube updated!</p>
                            ) : (
                                recentLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary hover:bg-tertiary transition cursor-pointer"
                                        onClick={() => openLeadDetails(lead)}
                                    >
                                        <Avatar name={lead.company} size="md" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium truncate">{lead.company}</span>
                                                <Badge
                                                    variant={
                                                        lead.status === 'new' ? 'primary' :
                                                            lead.status === 'accepted' ? 'success' :
                                                                lead.status === 'rejected' ? 'error' : 'warning'
                                                    }
                                                >
                                                    {lead.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-secondary truncate">{lead.project}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-primary-500">${lead.budget.toLocaleString()}</div>
                                            <div className="text-xs text-tertiary">{formatTime(lead.createdAt)}</div>
                                        </div>
                                        {lead.status === 'new' && (
                                            <div className="flex gap-2">
                                                <button
                                                    className="btn btn-ghost btn-icon text-success-500"
                                                    onClick={(e) => { e.stopPropagation(); handleAcceptLead(lead.id); }}
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-icon text-error-500"
                                                    onClick={(e) => { e.stopPropagation(); handleRejectLead(lead.id); }}
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Profile Completion */}
                    <Card>
                        <h3 className="font-semibold mb-4">Profile Completion</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="progress flex-1">
                                <div className="progress-bar" style={{ width: '75%' }} />
                            </div>
                            <span className="font-semibold">75%</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <CheckCircle size={16} className="text-success-500" />
                                <span className="text-secondary">Add portfolio items</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <AlertCircle size={16} className="text-warning-500" />
                                <span className="text-secondary">Complete verification</span>
                            </div>
                        </div>
                    </Card>

                    {/* Upcoming Tasks */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">Upcoming</h3>
                            <Calendar size={18} className="text-tertiary" />
                        </div>
                        <div className="space-y-3">
                            {upcomingTasks.map((task) => (
                                <div key={task.id} className="flex items-start gap-3">
                                    <div className={`w-2 h-2 rounded-full mt-2 ${task.type === 'meeting' ? 'bg-primary-500' :
                                        task.type === 'deadline' ? 'bg-error-500' : 'bg-success-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-medium">{task.task}</p>
                                        <p className="text-xs text-tertiary">{task.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link to="/agent/cube" className="btn btn-secondary w-full justify-start">
                                <Briefcase size={18} />
                                Edit My Cube
                            </Link>
                            <Link to="/messages" className="btn btn-secondary w-full justify-start">
                                <MessageSquare size={18} />
                                Messages {getUnreadCount() > 0 && <Badge variant="primary">{getUnreadCount()}</Badge>}
                            </Link>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                icon={TrendingUp}
                                onClick={() => toast.info('Earnings report downloaded successfully.')}
                            >
                                Earnings Report
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Lead Details Modal */}
            <Modal
                isOpen={showLeadModal}
                onClose={() => setShowLeadModal(false)}
                title="Lead Details"
                footer={
                    selectedLead?.status === 'new' || selectedLead?.status === 'pending' ? (
                        <>
                            <Button variant="ghost" onClick={() => handleRejectLead(selectedLead.id)}>
                                Decline
                            </Button>
                            <Button variant="primary" onClick={() => handleAcceptLead(selectedLead.id)}>
                                Accept Lead
                            </Button>
                        </>
                    ) : (
                        <Button variant="secondary" onClick={() => setShowLeadModal(false)}>
                            Close
                        </Button>
                    )
                }
            >
                {selectedLead && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar name={selectedLead.company} size="lg" />
                            <div>
                                <h3 className="font-semibold text-lg">{selectedLead.company}</h3>
                                <p className="text-secondary">{selectedLead.project}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-secondary">
                                <p className="text-sm text-tertiary">Budget</p>
                                <p className="font-semibold text-lg text-primary-500">${selectedLead.budget.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary">
                                <p className="text-sm text-tertiary">Status</p>
                                <Badge variant={
                                    selectedLead.status === 'new' ? 'primary' :
                                        selectedLead.status === 'accepted' ? 'success' :
                                            selectedLead.status === 'rejected' ? 'error' : 'warning'
                                }>
                                    {selectedLead.status}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-tertiary mb-2">Message</p>
                            <p className="p-3 rounded-lg bg-secondary text-sm">{selectedLead.message}</p>
                        </div>

                        <div className="text-sm text-tertiary">
                            Received: {formatTime(selectedLead.createdAt)}
                        </div>
                    </div>
                )}
            </Modal>
        </AppLayout>
    );
}

export default AgentDashboard;
