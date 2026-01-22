import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { BottomNav } from '../../components/layout/Navigation';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    Sun,
    Moon,
    Ticket,
    Check
} from 'lucide-react';

function Community() {
    const { events, registerForEvent, unregisterFromEvent, isRegisteredForEvent } = useData();
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'All Events' },
        { id: 'networking', label: 'Networking' },
        { id: 'workshop', label: 'Workshops' },
        { id: 'meetup', label: 'Meetups' },
    ];

    const filteredEvents = activeTab === 'all'
        ? events
        : events.filter(e => e.type === activeTab);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleRegister = (event) => {
        if (!user) {
            toast.warning('Please login to register for events');
            navigate('/login');
            return;
        }

        if (isRegisteredForEvent(event.id, user.id)) {
            unregisterFromEvent(event.id, user.id);
            toast.info('Registration cancelled');
        } else {
            if (event.registered >= event.capacity) {
                toast.error('Event is fully booked');
                return;
            }
            registerForEvent(event.id, user.id);
            toast.success(`Registered for ${event.title}!`);
        }
    };

    const featuredEvent = events.find(e => e.featured);

    return (
        <div className="min-h-screen bg-primary pb-20 md:pb-0">
            {/* Header */}
            <header className="sticky top-0 glass z-40">
                <div className="container py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/cube.svg" alt="Accescube" style={{ width: 32, height: 32 }} />
                            <span className="text-lg font-bold gradient-text">Accescube</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={toggleTheme}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            {user ? (
                                <Link to="/dashboard" className="btn btn-primary btn-sm">
                                    Dashboard
                                </Link>
                            ) : (
                                <Link to="/login" className="btn btn-primary btn-sm">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold mb-1">Community Events</h1>
                        <p className="text-secondary">Discover local events, workshops, and networking opportunities</p>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="container py-4">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {/* Featured Event */}
            {featuredEvent && (
                <div className="container mb-6">
                    <div className="relative rounded-2xl overflow-hidden bg-gradient-hero p-6 md:p-8 text-white">
                        <div className="relative z-10">
                            <Badge variant="warning" className="mb-4">Featured Event</Badge>
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                {featuredEvent.title}
                            </h2>
                            <p className="opacity-90 mb-4 max-w-xl">
                                {featuredEvent.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
                                <span className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    {formatDate(featuredEvent.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {featuredEvent.time}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    {featuredEvent.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Users size={16} />
                                    {featuredEvent.registered}/{featuredEvent.capacity} registered
                                </span>
                            </div>
                            <Button
                                variant="secondary"
                                style={{ background: 'white', color: 'var(--primary-600)' }}
                                onClick={() => handleRegister(featuredEvent)}
                                icon={user && isRegisteredForEvent(featuredEvent.id, user.id) ? Check : Ticket}
                            >
                                {user && isRegisteredForEvent(featuredEvent.id, user.id) ? 'Registered ✓' : 'Register Now'}
                            </Button>
                        </div>
                        <div className="absolute top-0 right-0 opacity-20 text-9xl">
                            🎉
                        </div>
                    </div>
                </div>
            )}

            {/* Events Grid */}
            <main className="container pb-8">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-secondary">
                        <span className="font-semibold text-primary">{filteredEvents.length}</span> events found
                    </p>
                    <select className="input" style={{ width: 'auto' }}>
                        <option>Upcoming First</option>
                        <option>Most Popular</option>
                        <option>Free Events</option>
                    </select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => {
                        const isRegistered = user && isRegisteredForEvent(event.id, user.id);
                        const isFull = event.registered >= event.capacity;

                        return (
                            <div key={event.id} className="card card-interactive">
                                {/* Event Image/Banner */}
                                <div className="h-32 bg-gradient-card rounded-t-xl flex items-center justify-center text-4xl relative">
                                    {event.type === 'networking' && '🤝'}
                                    {event.type === 'workshop' && '📚'}
                                    {event.type === 'seminar' && '🎤'}
                                    {event.type === 'meetup' && '☕'}
                                    {event.type === 'open-house' && '🏠'}
                                    {event.price === 0 && (
                                        <Badge variant="success" className="absolute top-3 right-3">Free</Badge>
                                    )}
                                    {isRegistered && (
                                        <Badge variant="primary" className="absolute top-3 left-3">
                                            <Check size={12} /> Registered
                                        </Badge>
                                    )}
                                </div>

                                {/* Event Content */}
                                <div className="p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="neutral" className="capitalize">{event.type}</Badge>
                                    </div>

                                    <h3 className="font-semibold mb-2">{event.title}</h3>
                                    <p className="text-sm text-secondary line-clamp-2 mb-4">
                                        {event.description}
                                    </p>

                                    <div className="space-y-2 text-sm text-secondary mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="shrink-0" />
                                            <span>{formatDate(event.date)} at {event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="shrink-0" />
                                            <span>{event.registered}/{event.capacity} registered</span>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="progress mb-4" style={{ height: 4 }}>
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${Math.min((event.registered / event.capacity) * 100, 100)}%`,
                                                background: isFull ? 'var(--error-500)' : undefined
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold">
                                            {event.price === 0 ? (
                                                <span className="text-success-500">Free</span>
                                            ) : (
                                                <span className="text-primary-500">${event.price}</span>
                                            )}
                                        </div>
                                        <Button
                                            variant={isRegistered ? 'secondary' : 'primary'}
                                            size="sm"
                                            icon={isRegistered ? Check : Ticket}
                                            onClick={() => handleRegister(event)}
                                            disabled={isFull && !isRegistered}
                                        >
                                            {isRegistered ? 'Cancel' : isFull ? 'Full' : 'Register'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="empty-state py-16">
                        <Calendar size={64} className="text-tertiary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
                        <p className="text-secondary">Check back later for new events in your area</p>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}

export default Community;
