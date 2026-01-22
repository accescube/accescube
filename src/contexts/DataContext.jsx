import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
    // Core Entities - Initialize from LocalStorage or empty array
    const [agents, setAgents] = useState(() => {
        const saved = localStorage.getItem('accescube-agents');
        return saved ? JSON.parse(saved) : [];
    });

    const [spaces, setSpaces] = useState(() => {
        const saved = localStorage.getItem('accescube-spaces');
        return saved ? JSON.parse(saved) : [];
    });

    const [employers, setEmployers] = useState(() => {
        const saved = localStorage.getItem('accescube-employers');
        return saved ? JSON.parse(saved) : [];
    });

    const [events, setEvents] = useState(() => {
        const saved = localStorage.getItem('accescube-events');
        return saved ? JSON.parse(saved) : [];
    });

    // Bookings for spaces
    const [bookings, setBookings] = useState(() => {
        const saved = localStorage.getItem('accescube-bookings');
        return saved ? JSON.parse(saved) : [];
    });

    // Leads for agents
    const [leads, setLeads] = useState(() => {
        const saved = localStorage.getItem('accescube-leads');
        return saved ? JSON.parse(saved) : [];
    });

    // Messages
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('accescube-messages');
        return saved ? JSON.parse(saved) : [];
    });

    // Reviews
    const [reviews, setReviews] = useState(() => {
        const saved = localStorage.getItem('accescube-reviews');
        return saved ? JSON.parse(saved) : [];
    });

    // Wallet
    const [wallet, setWallet] = useState(() => {
        const saved = localStorage.getItem('accescube-wallet');
        return saved ? JSON.parse(saved) : {
            balance: 0,
            transactions: []
        };
    });

    // Favorites
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('accescube-favorites');
        return saved ? JSON.parse(saved) : [];
    });

    // Event Registrations
    const [eventRegistrations, setEventRegistrations] = useState(() => {
        const saved = localStorage.getItem('accescube-event-registrations');
        return saved ? JSON.parse(saved) : [];
    });

    // Hired Agents
    const [hiredAgents, setHiredAgents] = useState(() => {
        const saved = localStorage.getItem('accescube-hired-agents');
        return saved ? JSON.parse(saved) : [];
    });

    // Employer Spaces (Long-term rentals)
    const [employerSpaces, setEmployerSpaces] = useState(() => {
        const saved = localStorage.getItem('accescube-employer-spaces');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('accescube-agents', JSON.stringify(agents));
    }, [agents]);

    useEffect(() => {
        localStorage.setItem('accescube-spaces', JSON.stringify(spaces));
    }, [spaces]);

    useEffect(() => {
        localStorage.setItem('accescube-employers', JSON.stringify(employers));
    }, [employers]);

    useEffect(() => {
        localStorage.setItem('accescube-events', JSON.stringify(events));
    }, [events]);

    useEffect(() => {
        localStorage.setItem('accescube-bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        localStorage.setItem('accescube-leads', JSON.stringify(leads));
    }, [leads]);

    useEffect(() => {
        localStorage.setItem('accescube-messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('accescube-reviews', JSON.stringify(reviews));
    }, [reviews]);

    useEffect(() => {
        localStorage.setItem('accescube-wallet', JSON.stringify(wallet));
    }, [wallet]);

    useEffect(() => {
        localStorage.setItem('accescube-favorites', JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => {
        localStorage.setItem('accescube-event-registrations', JSON.stringify(eventRegistrations));
    }, [eventRegistrations]);

    useEffect(() => {
        localStorage.setItem('accescube-hired-agents', JSON.stringify(hiredAgents));
    }, [hiredAgents]);

    useEffect(() => {
        localStorage.setItem('accescube-employer-spaces', JSON.stringify(employerSpaces));
    }, [employerSpaces]);

    // ============ AGENT FUNCTIONS ============
    const addAgent = (agent) => {
        const newAgent = { ...agent, id: Date.now().toString(), createdAt: new Date().toISOString() };
        setAgents(prev => [...prev, newAgent]);
        return newAgent;
    };

    const updateAgent = (id, updates) => {
        setAgents(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const deleteAgent = (id) => {
        setAgents(prev => prev.filter(a => a.id !== id));
    };

    // ============ SPACE FUNCTIONS ============
    const addSpace = (space) => {
        const newSpace = { ...space, id: Date.now().toString(), createdAt: new Date().toISOString() };
        setSpaces(prev => [...prev, newSpace]);
        return newSpace;
    };

    const updateSpace = (id, updates) => {
        setSpaces(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const deleteSpace = (id) => {
        setSpaces(prev => prev.filter(s => s.id !== id));
    };

    // ============ EMPLOYER FUNCTIONS ============
    const addEmployer = (employer) => {
        const newEmployer = { ...employer, id: Date.now().toString(), createdAt: new Date().toISOString() };
        setEmployers(prev => [...prev, newEmployer]);
        return newEmployer;
    };

    const updateEmployer = (id, updates) => {
        setEmployers(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    };

    const deleteEmployer = (id) => {
        setEmployers(prev => prev.filter(e => e.id !== id));
    };

    const hireAgent = (employerId, agentData) => {
        const newHired = {
            id: Date.now().toString(),
            employerId,
            status: 'active',
            hiredAt: new Date().toISOString(),
            ...agentData
        };
        setHiredAgents(prev => [...prev, newHired]);
        return newHired;
    };

    const removeHiredAgent = (id) => {
        setHiredAgents(prev => prev.filter(a => a.id !== id));
    };

    const getHiredAgents = (employerId) => {
        return hiredAgents.filter(a => a.employerId === employerId);
    };

    const rentSpace = (employerId, spaceData) => {
        const newRental = {
            id: Date.now().toString(),
            employerId,
            status: 'active',
            rentedAt: new Date().toISOString(),
            ...spaceData
        };
        setEmployerSpaces(prev => [...prev, newRental]);
        return newRental;
    };

    const cancelSpaceRental = (id) => {
        setEmployerSpaces(prev => prev.filter(s => s.id !== id));
    };

    const getEmployerSpaces = (employerId) => {
        return employerSpaces.filter(s => s.employerId === employerId);
    };

    // ============ BOOKING FUNCTIONS ============
    const createBooking = (booking) => {
        const newBooking = {
            ...booking,
            id: Date.now().toString(),
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };
        setBookings(prev => [...prev, newBooking]);
        return newBooking;
    };

    const updateBooking = (id, updates) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const cancelBooking = (id) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    };

    const getBookingsForSpace = (spaceId) => {
        return bookings.filter(b => b.spaceId === spaceId);
    };

    const getBookingsForUser = (userId) => {
        return bookings.filter(b => b.userId === userId);
    };

    // ============ LEAD FUNCTIONS ============
    const createLead = (lead) => {
        const newLead = {
            ...lead,
            id: Date.now().toString(),
            status: 'new',
            createdAt: new Date().toISOString(),
        };
        setLeads(prev => [...prev, newLead]);
        return newLead;
    };

    const updateLead = (id, updates) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    };

    const acceptLead = (id) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'accepted' } : l));
    };

    const rejectLead = (id) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
    };

    const getLeadsForAgent = (agentId) => {
        return leads.filter(l => l.agentId === agentId);
    };

    const deleteLead = (id) => {
        setLeads(prev => prev.filter(l => l.id !== id));
    };

    // ============ MESSAGE FUNCTIONS ============
    const sendMessage = (to, content, from = 'You') => {
        const newMessage = {
            id: Date.now().toString(),
            from,
            to,
            content,
            read: false,
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    };

    const markMessageRead = (id) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    };

    const markAllMessagesRead = () => {
        setMessages(prev => prev.map(m => ({ ...m, read: true })));
    };

    const getUnreadCount = () => {
        return messages.filter(m => !m.read).length;
    };

    // ============ REVIEW FUNCTIONS ============
    const addReview = (review) => {
        const newReview = {
            ...review,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setReviews(prev => [...prev, newReview]);

        // Update rating on the target
        const targetReviews = [...reviews, newReview].filter(r => r.targetId === review.targetId);
        const avgRating = targetReviews.reduce((acc, r) => acc + r.rating, 0) / targetReviews.length;

        if (review.targetType === 'agent') {
            updateAgent(review.targetId, { rating: avgRating.toFixed(1), reviews: targetReviews.length });
        } else if (review.targetType === 'space') {
            updateSpace(review.targetId, { rating: avgRating.toFixed(1), reviews: targetReviews.length });
        }

        return newReview;
    };

    const getReviewsFor = (targetType, targetId) => {
        return reviews.filter(r => r.targetType === targetType && r.targetId === targetId);
    };

    // ============ WALLET FUNCTIONS ============
    const addTransaction = (type, amount, description) => {
        const newTransaction = {
            id: Date.now().toString(),
            type,
            amount,
            description,
            date: new Date().toISOString(),
        };

        setWallet(prev => ({
            balance: type === 'credit' ? prev.balance + amount : prev.balance - amount,
            transactions: [newTransaction, ...prev.transactions],
        }));

        return newTransaction;
    };

    const getWalletBalance = () => wallet.balance;
    const getTransactions = () => wallet.transactions;

    // ============ FAVORITE FUNCTIONS ============
    const toggleFavorite = (type, id) => {
        const key = `${type}-${id}`;
        setFavorites(prev =>
            prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]
        );
    };

    const isFavorite = (type, id) => {
        return favorites.includes(`${type}-${id}`);
    };

    const getFavorites = (type) => {
        return favorites.filter(f => f.startsWith(type)).map(f => f.split('-')[1]);
    };

    // ============ EVENT FUNCTIONS ============
    const registerForEvent = (eventId, userId) => {
        const registration = { eventId, userId, registeredAt: new Date().toISOString() };
        setEventRegistrations(prev => [...prev, registration]);

        // Update event registered count
        setEvents(prev => prev.map(e =>
            e.id === eventId ? { ...e, registered: e.registered + 1 } : e
        ));

        return registration;
    };

    const unregisterFromEvent = (eventId, userId) => {
        setEventRegistrations(prev => prev.filter(r => !(r.eventId === eventId && r.userId === userId)));

        setEvents(prev => prev.map(e =>
            e.id === eventId ? { ...e, registered: Math.max(0, e.registered - 1) } : e
        ));
    };

    const isRegisteredForEvent = (eventId, userId) => {
        return eventRegistrations.some(r => r.eventId === eventId && r.userId === userId);
    };

    // ============ SEARCH FUNCTIONS ============
    const searchAgents = (query, filters = {}) => {
        return agents.filter(agent => {
            const matchesQuery = !query ||
                agent.name.toLowerCase().includes(query.toLowerCase()) ||
                agent.title.toLowerCase().includes(query.toLowerCase()) ||
                agent.skills.some(s => s.toLowerCase().includes(query.toLowerCase()));

            const matchesLocation = !filters.location ||
                agent.location.toLowerCase().includes(filters.location.toLowerCase());

            const matchesCategory = !filters.category ||
                agent.category === filters.category;

            const matchesPriceRange = !filters.priceRange || (() => {
                const [min, max] = filters.priceRange.split('-').map(Number);
                if (filters.priceRange.includes('+')) {
                    return agent.hourlyRate >= parseInt(filters.priceRange);
                }
                return agent.hourlyRate >= min && agent.hourlyRate <= max;
            })();

            return matchesQuery && matchesLocation && matchesCategory && matchesPriceRange;
        });
    };

    const searchSpaces = (query, filters = {}) => {
        return spaces.filter(space => {
            const matchesQuery = !query ||
                space.name.toLowerCase().includes(query.toLowerCase()) ||
                space.type.toLowerCase().includes(query.toLowerCase()) ||
                space.location.toLowerCase().includes(query.toLowerCase());

            const matchesLocation = !filters.location ||
                space.location.toLowerCase().includes(filters.location.toLowerCase());

            const matchesType = !filters.type ||
                space.type === filters.type;

            return matchesQuery && matchesLocation && matchesType;
        });
    };

    const searchEmployers = (query, filters = {}) => {
        return employers.filter(employer => {
            const matchesQuery = !query ||
                employer.name.toLowerCase().includes(query.toLowerCase()) ||
                employer.industry.toLowerCase().includes(query.toLowerCase());

            const matchesIndustry = !filters.industry ||
                employer.industry === filters.industry;

            return matchesQuery && matchesIndustry;
        });
    };

    return (
        <DataContext.Provider value={{
            // Data
            agents, spaces, employers, events, bookings, leads, messages, reviews, wallet, favorites,

            // Agent functions
            addAgent, updateAgent, deleteAgent,

            // Space functions
            addSpace, updateSpace, deleteSpace,

            // Employer functions
            addEmployer, updateEmployer, deleteEmployer,
            hireAgent, removeHiredAgent, getHiredAgents,
            rentSpace, cancelSpaceRental, getEmployerSpaces,

            // Booking functions
            createBooking, updateBooking, cancelBooking, getBookingsForSpace, getBookingsForUser,

            // Lead functions
            createLead, updateLead, acceptLead, rejectLead, getLeadsForAgent, deleteLead,

            // Message functions
            sendMessage, markMessageRead, markAllMessagesRead, getUnreadCount,

            // Review functions
            addReview, getReviewsFor,

            // Wallet functions
            addTransaction, getWalletBalance, getTransactions,

            // Favorite functions
            toggleFavorite, isFavorite, getFavorites,

            // Event functions
            registerForEvent, unregisterFromEvent, isRegisteredForEvent,

            // Search functions
            searchAgents, searchSpaces, searchEmployers,
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within DataProvider');
    }
    return context;
}
