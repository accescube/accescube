import { useState } from 'react';
import { AppLayout } from '../../components/layout/Navigation';
import { useData } from '../../contexts/DataContext';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge, Avatar } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import {
    DollarSign,
    Users,
    Building2,
    Calendar,
    ArrowRight,
    Check,
    X,
    Eye,
    Search,
    TrendingUp,
    ShieldCheck,
    AlertTriangle
} from 'lucide-react';

function AdminDashboard() {
    const { agents, spaces, employers, events } = useData();
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'users', label: 'Users' },
        { id: 'cubes', label: 'Cubes' },
        { id: 'revenue', label: 'Revenue' },
    ];

    const stats = {
        revenue: { value: '$48,250', change: '+22%', type: 'positive' },
        users: { value: '2,847', change: '+156', type: 'positive' },
        cubes: { value: '892', change: '+43', type: 'positive' },
        events: { value: '24', change: '8 upcoming', type: 'neutral' },
    };

    const pendingApprovals = [
        { id: 1, type: 'agent', name: 'John Smith', email: 'john@email.com', date: '2 hours ago' },
        { id: 2, type: 'space', name: 'Modern Offices Co', email: 'info@modern.com', date: '5 hours ago' },
        { id: 3, type: 'employer', name: 'StartupXYZ', email: 'hire@startup.com', date: '1 day ago' },
    ];

    const recentTransactions = [
        { id: 1, description: 'Agent Commission', user: 'Alex Johnson', amount: '+$127.50', type: 'income' },
        { id: 2, description: 'Space Booking Fee', user: 'Urban Work Hub', amount: '+$45.00', type: 'income' },
        { id: 3, description: 'Refund Processed', user: 'Sarah Chen', amount: '-$85.00', type: 'refund' },
        { id: 4, description: 'Featured Listing', user: 'TechStart Inc', amount: '+$99.00', type: 'income' },
    ];

    return (
        <AppLayout title="Admin Dashboard">
            {/* Welcome */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">Platform Overview</h1>
                    <Badge variant="primary">Admin</Badge>
                </div>
                <p className="text-secondary">Monitor and manage the Accescube platform.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Total Revenue"
                    value={stats.revenue.value}
                    change={stats.revenue.change}
                    changeType={stats.revenue.type}
                    icon={DollarSign}
                />
                <StatCard
                    label="Total Users"
                    value={stats.users.value}
                    change={stats.users.change}
                    changeType={stats.users.type}
                    icon={Users}
                />
                <StatCard
                    label="Active Cubes"
                    value={stats.cubes.value}
                    change={stats.cubes.change}
                    changeType={stats.cubes.type}
                    icon={Building2}
                />
                <StatCard
                    label="Events"
                    value={stats.events.value}
                    change={stats.events.change}
                    changeType={stats.events.type}
                    icon={Calendar}
                />
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'overview' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Pending Approvals */}
                    <div className="lg:col-span-2">
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Pending Approvals</h2>
                                <Badge variant="warning">{pendingApprovals.length} pending</Badge>
                            </div>

                            <div className="space-y-4">
                                {pendingApprovals.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                                        <Avatar name={item.name} size="md" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{item.name}</span>
                                                <Badge variant="neutral" className="capitalize">{item.type}</Badge>
                                            </div>
                                            <p className="text-sm text-secondary">{item.email}</p>
                                        </div>
                                        <div className="text-sm text-tertiary">{item.date}</div>
                                        <div className="flex gap-2">
                                            <button className="btn btn-ghost btn-icon text-success-500">
                                                <Check size={18} />
                                            </button>
                                            <button className="btn btn-ghost btn-icon text-error-500">
                                                <X size={18} />
                                            </button>
                                            <button className="btn btn-ghost btn-icon">
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Quick Stats & Actions */}
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-semibold mb-4">Platform Health</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-success-500/10">
                                    <ShieldCheck size={20} className="text-success-500" />
                                    <div>
                                        <div className="font-medium text-sm">All Systems Operational</div>
                                        <div className="text-xs text-tertiary">Last checked: 2 min ago</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-500/10">
                                    <AlertTriangle size={20} className="text-warning-500" />
                                    <div>
                                        <div className="font-medium text-sm">3 Reports Pending</div>
                                        <div className="text-xs text-tertiary">Requires attention</div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <Button variant="secondary" className="w-full justify-start" icon={Users}>
                                    Manage Users
                                </Button>
                                <Button variant="secondary" className="w-full justify-start" icon={Building2}>
                                    Review Cubes
                                </Button>
                                <Button variant="secondary" className="w-full justify-start" icon={TrendingUp}>
                                    View Analytics
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'revenue' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                                <Button variant="ghost" size="sm">
                                    Export <ArrowRight size={16} />
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-secondary border-b border-light">
                                            <th className="pb-3 font-medium">Description</th>
                                            <th className="pb-3 font-medium">User</th>
                                            <th className="pb-3 font-medium text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.id} className="border-b border-light last:border-b-0">
                                                <td className="py-4 font-medium">{tx.description}</td>
                                                <td className="py-4 text-secondary">{tx.user}</td>
                                                <td className={`py-4 text-right font-semibold ${tx.type === 'income' ? 'text-success-500' : 'text-error-500'
                                                    }`}>
                                                    {tx.amount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    <Card>
                        <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary">Agent Commissions</span>
                                <span className="font-semibold">$18,420</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary">Space Bookings</span>
                                <span className="font-semibold">$12,850</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary">Featured Listings</span>
                                <span className="font-semibold">$8,200</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary">Subscriptions</span>
                                <span className="font-semibold">$5,980</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary">Events</span>
                                <span className="font-semibold">$2,800</span>
                            </div>
                            <div className="divider" />
                            <div className="flex items-center justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-lg text-primary-500">$48,250</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {(activeTab === 'users' || activeTab === 'cubes') && (
                <Card>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">
                            {activeTab === 'users' ? 'User Management' : 'Cube Management'}
                        </h2>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" />
                                <input
                                    type="text"
                                    className="input pl-10"
                                    placeholder="Search..."
                                    style={{ width: '200px' }}
                                />
                            </div>
                            <select className="input" style={{ width: 'auto' }}>
                                <option>All Types</option>
                                <option>Agents</option>
                                <option>Spaces</option>
                                <option>Employers</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-center py-12 text-secondary">
                        <Building2 size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Select filters to view {activeTab}</p>
                    </div>
                </Card>
            )}
        </AppLayout>
    );
}

export default AdminDashboard;
