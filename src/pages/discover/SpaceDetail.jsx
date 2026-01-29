import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { BottomNav } from '../../components/layout/Navigation';
import { Badge, Rating, Avatar } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import {
    ArrowLeft,
    MapPin,
    Clock,
    Star,
    Heart,
    Share2,
    Calendar,
    Users,
    Wifi,
    Coffee,
    Monitor,
    Phone,
    Lock,
    Printer,
    Sun,
    Moon,
    CheckCircle,
    DollarSign
} from 'lucide-react';

const AMENITY_ICONS = {
    'High-Speed WiFi': Wifi,
    'WiFi': Wifi,
    'Coffee & Tea': Coffee,
    'Free Coffee': Coffee,
    'Meeting Rooms': Users,
    'Phone Booths': Phone,
    '24/7 Access': Clock,
    'Lockable Storage': Lock,
    'Printing': Printer,
    'Monitor': Monitor,
};

function SpaceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { spaces, toggleFavorite, isFavorite, createBooking } = useData();
    const { theme, toggleTheme } = useTheme();
    const { toast } = useToast();

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        date: '',
        startTime: '09:00',
        endTime: '17:00',
        type: 'daily',
    });

    const space = spaces.find(s => s.id === id);

    if (!space) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Space Not Found</h2>
                    <Link to="/discover?tab=spaces" className="btn btn-primary">Browse Spaces</Link>
                </div>
            </div>
        );
    }

    const getLowestPrice = () => {
        if (space.pricing.hourly) return { amount: space.pricing.hourly, unit: 'hour' };
        if (space.pricing.daily) return { amount: space.pricing.daily, unit: 'day' };
        if (space.pricing.monthly) return { amount: space.pricing.monthly, unit: 'month' };
        return { amount: 0, unit: 'hour' };
    };

    const price = getLowestPrice();

    const handleBooking = () => {
        if (!user) {
            toast.warning('Please login to book a space');
            navigate('/login');
            return;
        }
        setShowBookingModal(true);
    };

    const confirmBooking = () => {
        if (!bookingData.date) {
            toast.error('Please select a date');
            return;
        }

        const booking = createBooking({
            spaceId: space.id,
            spaceName: space.name,
            userId: user.id,
            userName: user.name,
            date: bookingData.date,
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            type: bookingData.type,
            amount: bookingData.type === 'hourly' ? space.pricing.hourly :
                bookingData.type === 'daily' ? space.pricing.daily : space.pricing.monthly,
        });

        toast.success(`Booking confirmed for ${space.name}!`);
        setShowBookingModal(false);
        setBookingData({ date: '', startTime: '09:00', endTime: '17:00', type: 'daily' });
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: space.name,
                text: `Check out ${space.name} on Accescube!`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const handleFavorite = () => {
        toggleFavorite('space', space.id);
        toast.success(isFavorite('space', space.id) ? 'Removed from favorites' : 'Added to favorites!');
    };

    return (
        <div className="min-h-screen bg-primary pb-20 md:pb-0">
            {/* Header */}
            <header className="sticky top-0 glass z-40">
                <div className="container py-4 flex items-center justify-between">
                    <Link to="/discover?tab=spaces" className="flex items-center gap-2 text-secondary hover:text-primary">
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
                                fill={isFavorite('space', space.id) ? 'var(--error-500)' : 'none'}
                                color={isFavorite('space', space.id) ? 'var(--error-500)' : 'currentColor'}
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

            {/* Hero Image */}
            <div className="h-64 md:h-80 bg-gradient-card flex items-center justify-center text-6xl relative">
                🏢
            </div>

            <main className="container py-6">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Info */}
                        <div className="card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {space.featured && <Badge variant="primary">Featured</Badge>}
                                        {space.discount && <Badge variant="warning">{space.discount.percent}% Off</Badge>}
                                    </div>
                                    <h1 className="text-2xl font-bold mb-2">{space.name}</h1>
                                    <p className="text-lg text-secondary capitalize">{space.type}</p>
                                </div>
                                <Rating value={space.rating} count={space.reviews} size="lg" />
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    {space.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users size={16} />
                                    Up to {space.capacity} people
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {space.operatingHours.open} - {space.operatingHours.close}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold mb-4">About This Space</h2>
                            <p className="text-secondary leading-relaxed">{space.description}</p>
                            <p className="mt-4 text-secondary">
                                <strong>Address:</strong> {space.address}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold mb-4">Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {space.amenities.map((amenity, i) => {
                                    const IconComponent = AMENITY_ICONS[amenity] || CheckCircle;
                                    return (
                                        <div key={i} className="flex items-center gap-3 text-sm">
                                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                                                <IconComponent size={20} />
                                            </div>
                                            <span>{amenity}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Space Owner */}
                        <div className="card p-6">
                            <h2 className="text-lg font-semibold mb-4">Space Owner</h2>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary">
                                <Avatar name={space.providerName || "Space Provider"} size="lg" />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{space.providerName || "Official Provider"}</h3>
                                    <p className="text-sm text-secondary">Verified Member since 2023</p>
                                </div>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => toast.info(`Chat with ${space.providerName || "Provider"} coming soon!`)}
                                >
                                    Message
                                </Button>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">Reviews</h2>
                                <span className="text-secondary">{space.reviews} reviews</span>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-xl bg-tertiary">
                                <div className="text-center">
                                    <div className="text-4xl font-bold">{space.rating}</div>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i <= Math.round(space.rating) ? 'var(--warning-400)' : 'none'}
                                                color="var(--warning-400)"
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm text-secondary mt-1">Excellent</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Booking */}
                    <div className="space-y-6">
                        <div className="card p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-primary-500">
                                    ${price.amount}
                                    <span className="text-base font-normal text-secondary">/{price.unit}</span>
                                </div>
                                {space.discount && (
                                    <div className="mt-2 text-sm text-success-500">
                                        Save {space.discount.percent}% with code {space.discount.code}
                                    </div>
                                )}
                            </div>

                            {/* Pricing Options */}
                            <div className="space-y-3 mb-6">
                                {space.pricing.hourly && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-tertiary">
                                        <span>Hourly</span>
                                        <span className="font-semibold">${space.pricing.hourly}/hr</span>
                                    </div>
                                )}
                                {space.pricing.daily && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-tertiary">
                                        <span>Daily</span>
                                        <span className="font-semibold">${space.pricing.daily}/day</span>
                                    </div>
                                )}
                                {space.pricing.monthly && (
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-tertiary">
                                        <span>Monthly</span>
                                        <span className="font-semibold">${space.pricing.monthly}/mo</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm mb-6">
                                <span className="text-secondary">Availability</span>
                                <Badge variant={space.available ? 'success' : 'error'}>
                                    {space.available ? 'Available' : 'Unavailable'}
                                </Badge>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    icon={Calendar}
                                    disabled={!space.available}
                                    onClick={handleBooking}
                                >
                                    Book Now
                                </Button>
                                <Button variant="secondary" className="w-full">
                                    Request Tour
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            <Modal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                title={`Book ${space.name}`}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => setShowBookingModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={confirmBooking}>
                            Confirm Booking
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="input-group">
                        <label className="input-label">Booking Type</label>
                        <select
                            className="input"
                            value={bookingData.type}
                            onChange={(e) => setBookingData({ ...bookingData, type: e.target.value })}
                        >
                            {space.pricing.hourly && <option value="hourly">Hourly (${space.pricing.hourly}/hr)</option>}
                            {space.pricing.daily && <option value="daily">Daily (${space.pricing.daily}/day)</option>}
                            {space.pricing.monthly && <option value="monthly">Monthly (${space.pricing.monthly}/mo)</option>}
                        </select>
                    </div>

                    <Input
                        label="Date"
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        icon={Calendar}
                    />

                    {bookingData.type === 'hourly' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="input-group">
                                <label className="input-label">Start Time</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={bookingData.startTime}
                                    onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">End Time</label>
                                <input
                                    type="time"
                                    className="input"
                                    value={bookingData.endTime}
                                    onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="p-4 rounded-lg bg-secondary">
                        <div className="flex items-center justify-between">
                            <span className="text-secondary">Total</span>
                            <span className="text-xl font-bold text-primary-500">
                                ${bookingData.type === 'hourly' ? space.pricing.hourly :
                                    bookingData.type === 'daily' ? space.pricing.daily : space.pricing.monthly}
                            </span>
                        </div>
                    </div>
                </div>
            </Modal>

            <BottomNav />
        </div>
    );
}

export default SpaceDetail;
