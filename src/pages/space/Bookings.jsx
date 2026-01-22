import { useState } from 'react';
import { AppLayout } from '../../components/layout/Navigation';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge, Avatar } from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    MoreHorizontal,
    Search,
    Filter
} from 'lucide-react';

function Bookings() {
    const { bookings, updateBooking, cancelBooking } = useData();
    const { toast } = useToast();
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // In a real app we'd filter by space ownerId, but for now show all bookings
    const myBookings = bookings.filter(booking => {
        const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
        const matchesSearch = booking.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.space.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleAction = (id, action) => {
        if (action === 'confirm') {
            updateBooking(id, { status: 'confirmed' });
            toast.success('Booking confirmed');
        } else if (action === 'cancel') {
            if (window.confirm('Are you sure you want to cancel this booking?')) {
                cancelBooking(id);
                toast.info('Booking cancelled');
            }
        } else if (action === 'complete') {
            updateBooking(id, { status: 'completed' });
            toast.success('Booking marked as completed');
        }
    };

    return (
        <AppLayout title="Bookings">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Bookings</h1>
                    <p className="text-secondary">Manage incoming reservations for your spaces.</p>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary" size={18} />
                        <input
                            type="text"
                            className="input pl-10 w-full md:w-64"
                            placeholder="Search bookings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="input w-auto"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {myBookings.length === 0 ? (
                    <Card className="text-center py-12">
                        <Calendar size={48} className="mx-auto mb-4 text-tertiary opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                        <p className="text-secondary">
                            {searchQuery || filterStatus !== 'all'
                                ? "Try adjusting your filters."
                                : "You don't have any bookings yet."}
                        </p>
                    </Card>
                ) : (
                    myBookings.map((booking) => (
                        <Card key={booking.id} className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <Avatar name={booking.guest} size="md" />
                                <div className="min-w-0">
                                    <h4 className="font-bold truncate">{booking.guest}</h4>
                                    <p className="text-sm text-secondary truncate">{booking.space}</p>
                                    <div className="flex items-center gap-2 mt-1 md:hidden">
                                        <Badge
                                            variant={
                                                booking.status === 'confirmed' ? 'success' :
                                                    booking.status === 'pending' ? 'warning' :
                                                        booking.status === 'cancelled' ? 'error' : 'secondary'
                                            }
                                            size="sm"
                                        >
                                            {booking.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 w-full md:w-auto">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex items-center gap-2 text-secondary">
                                        <Calendar size={14} />
                                        {booking.date.split(',')[0]}
                                    </div>
                                    <div className="flex items-center gap-2 text-secondary">
                                        <Clock size={14} />
                                        {booking.date.split(',')[1] || 'All Day'}
                                    </div>
                                </div>

                                <div className="font-bold text-lg md:text-right w-24">
                                    {booking.amount}
                                </div>

                                <div className="hidden md:block">
                                    <Badge
                                        variant={
                                            booking.status === 'confirmed' ? 'success' :
                                                booking.status === 'active' ? 'success' :
                                                    booking.status === 'pending' ? 'warning' :
                                                        booking.status === 'cancelled' ? 'error' : 'secondary'
                                        }
                                    >
                                        {booking.status}
                                    </Badge>
                                </div>

                                <div className="flex gap-2 justify-end w-full md:w-auto border-t md:border-t-0 border-light pt-3 md:pt-0">
                                    {booking.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="primary"
                                            icon={CheckCircle}
                                            onClick={() => handleAction(booking.id, 'confirm')}
                                        >
                                            Confirm
                                        </Button>
                                    )}
                                    {(booking.status === 'active' || booking.status === 'confirmed') && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-error-600 hover:bg-error-50"
                                            icon={XCircle}
                                            onClick={() => handleAction(booking.id, 'cancel')}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    {booking.status === 'cancelled' && (
                                        <span className="text-sm text-secondary italic px-3 py-1">Cancelled</span>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </AppLayout>
    );
}

export default Bookings;
