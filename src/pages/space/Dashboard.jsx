import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { Card, StatCard } from '../../components/ui/Card';
import { Badge, Avatar } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
    DollarSign,
    TrendingUp,
    Building2,
    Calendar,
    Users,
    ArrowRight,
    Plus,
    Eye,
    Edit
} from 'lucide-react';

function SpaceDashboard() {
    const { user } = useAuth();
    const { spaces, bookings } = useData();
    const { toast } = useToast();

    // Use dynamic data
    const mySpaces = spaces.slice(0, 3);
    const recentBookings = bookings.slice(0, 5);

    const stats = {
        revenue: { value: '$12,840', change: '+18.2%', type: 'positive' },
        bookings: { value: bookings.length.toString(), change: '+12 this week', type: 'positive' },
        occupancy: { value: '78%', change: '+5%', type: 'positive' },
        spaces: { value: spaces.length.toString(), change: '2 featured', type: 'neutral' },
    };

    return (
        <AppLayout title="Space Dashboard">
            {/* Welcome */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-secondary">Manage your workspaces and bookings.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Revenue (This Month)"
                    value={stats.revenue.value}
                    change={stats.revenue.change}
                    changeType={stats.revenue.type}
                    icon={DollarSign}
                />
                <StatCard
                    label="Total Bookings"
                    value={stats.bookings.value}
                    change={stats.bookings.change}
                    changeType={stats.bookings.type}
                    icon={Calendar}
                />
                <StatCard
                    label="Occupancy Rate"
                    value={stats.occupancy.value}
                    change={stats.occupancy.change}
                    changeType={stats.occupancy.type}
                    icon={TrendingUp}
                />
                <StatCard
                    label="Active Spaces"
                    value={stats.spaces.value}
                    change={stats.spaces.change}
                    changeType={stats.spaces.type}
                    icon={Building2}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Bookings */}
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold">Recent Bookings</h2>
                            <Link to="/space/bookings" className="btn btn-ghost btn-sm">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-secondary border-b border-light">
                                        <th className="pb-3 font-medium">Guest</th>
                                        <th className="pb-3 font-medium">Space</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.id} className="border-b border-light last:border-b-0">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={booking.guest} size="sm" />
                                                    <span className="font-medium">{booking.guest}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-secondary">{booking.space}</td>
                                            <td className="py-4 text-secondary text-sm">{booking.date}</td>
                                            <td className="py-4">
                                                <Badge
                                                    variant={
                                                        booking.status === 'active' ? 'success' :
                                                            booking.status === 'confirmed' ? 'primary' : 'warning'
                                                    }
                                                >
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                            <td className="py-4 text-right font-semibold">{booking.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions & My Spaces */}
                <div className="space-y-6">
                    <Card>
                        <h3 className="font-semibold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link to="/space/cubes" className="btn btn-primary w-full justify-start">
                                <Plus size={18} className="mr-2" />
                                Add New Space
                            </Link>
                            <Link to="/space/bookings" className="btn btn-secondary w-full justify-start">
                                <Calendar size={18} className="mr-2" />
                                View Calendar
                            </Link>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                icon={TrendingUp}
                                onClick={() => toast.info('Revenue report generated and sent to your email.')}
                            >
                                Revenue Report
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold">My Spaces</h3>
                            <Link to="/space/cubes" className="btn btn-ghost btn-sm">All</Link>
                        </div>
                        <div className="space-y-3">
                            {mySpaces.map((space) => (
                                <div key={space.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-card flex items-center justify-center">
                                        🏢
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">{space.name}</h4>
                                        <p className="text-xs text-secondary capitalize">{space.type}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="btn btn-ghost btn-icon btn-sm">
                                            <Eye size={14} />
                                        </button>
                                        <button className="btn btn-ghost btn-icon btn-sm">
                                            <Edit size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

export default SpaceDashboard;
