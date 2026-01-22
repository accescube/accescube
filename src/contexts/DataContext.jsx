import { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const DataContext = createContext();

export function DataProvider({ children }) {
    // ============ STATE DEFINITIONS ============
    const [agents, setAgents] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [leads, setLeads] = useState([]);
    const [messages, setMessages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
    const [favorites, setFavorites] = useState([]);
    const [eventRegistrations, setEventRegistrations] = useState([]);
    const [hiredAgents, setHiredAgents] = useState([]);
    const [employerSpaces, setEmployerSpaces] = useState([]);

    // ============ FIRESTORE LISTENERS ============
    // Helper to subscribe to a collection
    const subscribe = (collectionName, setter) => {
        const q = query(collection(db, collectionName));
        return onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setter(data);
        }, (error) => {
            console.error(`Error reading ${collectionName}:`, error);
        });
    };

    useEffect(() => {
        const unsubAgents = subscribe('agents', setAgents);
        const unsubSpaces = subscribe('spaces', setSpaces);
        const unsubEmployers = subscribe('employers', setEmployers);
        const unsubEvents = subscribe('events', setEvents);
        const unsubBookings = subscribe('bookings', setBookings);
        const unsubLeads = subscribe('leads', setLeads);
        const unsubMessages = subscribe('messages', setMessages);
        const unsubReviews = subscribe('reviews', setReviews);
        const unsubFavorites = subscribe('favorites', (data) => setFavorites(data.map(f => f.key))); // Store as keys for compatibility
        const unsubEventRegs = subscribe('eventRegistrations', setEventRegistrations);
        const unsubHiredAgents = subscribe('hiredAgents', setHiredAgents);
        const unsubEmployerSpaces = subscribe('employerSpaces', setEmployerSpaces);

        // Wallet is special (transactions)
        const unsubTransactions = subscribe('transactions', (txs) => {
            const balance = txs.reduce((acc, tx) =>
                tx.type === 'credit' ? acc + (Number(tx.amount) || 0) : acc - (Number(tx.amount) || 0), 0
            );
            setWallet({ balance, transactions: txs.sort((a, b) => new Date(b.date) - new Date(a.date)) });
        });

        return () => {
            unsubAgents();
            unsubSpaces();
            unsubEmployers();
            unsubEvents();
            unsubBookings();
            unsubLeads();
            unsubMessages();
            unsubReviews();
            unsubFavorites();
            unsubEventRegs();
            unsubHiredAgents();
            unsubEmployerSpaces();
            unsubTransactions();
        };
    }, []);


    // ============ GENERIC HELPERS ============
    const addToDb = async (coll, data) => {
        try {
            const docRef = await addDoc(collection(db, coll), {
                ...data,
                createdAt: new Date().toISOString() // Use ISO string for consistency with app logic
            });
            return { id: docRef.id, ...data };
        } catch (e) {
            console.error(`Error adding to ${coll}:`, e);
            throw e;
        }
    };

    const updateInDb = async (coll, id, updates) => {
        try {
            const docRef = doc(db, coll, id);
            await updateDoc(docRef, updates);
        } catch (e) {
            console.error(`Error updating ${coll}:`, e);
            throw e;
        }
    };

    const deleteFromDb = async (coll, id) => {
        try {
            await deleteDoc(doc(db, coll, id));
        } catch (e) {
            console.error(`Error deleting from ${coll}:`, e);
            throw e;
        }
    };

    // ============ AGENT FUNCTIONS ============
    const addAgent = (agent) => addToDb('agents', agent);
    const updateAgent = (id, updates) => updateInDb('agents', id, updates);
    const deleteAgent = (id) => deleteFromDb('agents', id);

    // ============ SPACE FUNCTIONS ============
    const addSpace = (space) => addToDb('spaces', space);
    const updateSpace = (id, updates) => updateInDb('spaces', id, updates);
    const deleteSpace = (id) => deleteFromDb('spaces', id);

    // ============ EMPLOYER FUNCTIONS ============
    const addEmployer = (employer) => addToDb('employers', employer);
    const updateEmployer = (id, updates) => updateInDb('employers', id, updates);
    const deleteEmployer = (id) => deleteFromDb('employers', id);

    const hireAgent = (employerId, agentData) => addToDb('hiredAgents', {
        employerId,
        status: 'active',
        hiredAt: new Date().toISOString(),
        ...agentData
    });

    const removeHiredAgent = (id) => deleteFromDb('hiredAgents', id);

    const getHiredAgents = (employerId) => hiredAgents.filter(a => a.employerId === employerId);

    const rentSpace = (employerId, spaceData) => addToDb('employerSpaces', {
        employerId,
        status: 'active',
        rentedAt: new Date().toISOString(),
        ...spaceData
    });

    const cancelSpaceRental = (id) => deleteFromDb('employerSpaces', id);

    const getEmployerSpaces = (employerId) => employerSpaces.filter(s => s.employerId === employerId);

    // ============ BOOKING FUNCTIONS ============
    const createBooking = (booking) => addToDb('bookings', {
        ...booking,
        status: 'confirmed'
    });

    const updateBooking = (id, updates) => updateInDb('bookings', id, updates);

    const cancelBooking = (id) => updateInDb('bookings', id, { status: 'cancelled' });

    const getBookingsForSpace = (spaceId) => bookings.filter(b => b.spaceId === spaceId);

    const getBookingsForUser = (userId) => bookings.filter(b => b.userId === userId);

    // ============ LEAD FUNCTIONS ============
    const createLead = (lead) => addToDb('leads', {
        ...lead,
        status: 'new'
    });

    const updateLead = (id, updates) => updateInDb('leads', id, updates);

    const acceptLead = (id) => updateInDb('leads', id, { status: 'accepted' });

    const rejectLead = (id) => updateInDb('leads', id, { status: 'rejected' });

    const getLeadsForAgent = (agentId) => leads.filter(l => l.agentId === agentId);

    const deleteLead = (id) => deleteFromDb('leads', id);

    // ============ MESSAGE FUNCTIONS ============
    const sendMessage = (to, content, from = 'You') => addToDb('messages', {
        from,
        to,
        content,
        read: false
    });

    const markMessageRead = (id) => updateInDb('messages', id, { read: true });

    const markAllMessagesRead = () => {
        // This acts on local state to batch update but Firestore requires individual updates
        // For efficiency in this demo, might need iteration. 
        // Real app would use a batch write.
        messages.filter(m => !m.read).forEach(m => {
            updateInDb('messages', m.id, { read: true });
        });
    };

    const getUnreadCount = () => messages.filter(m => !m.read).length;

    // ============ REVIEW FUNCTIONS ============
    const addReview = async (review) => {
        const newReview = await addToDb('reviews', review);

        // Update rating on the target
        // Note: 'reviews' state might not update immediately here due to async listener
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
    const addTransaction = (type, amount, description) => addToDb('transactions', {
        type,
        amount,
        description,
        date: new Date().toISOString()
    });

    const getWalletBalance = () => wallet.balance;
    const getTransactions = () => wallet.transactions;

    // ============ FAVORITE FUNCTIONS ============
    const toggleFavorite = async (type, id) => {
        const key = `${type}-${id}`;
        // Check if exists in local state (which comes from DB)
        const exists = favorites.includes(key);

        if (exists) {
            // Need to find the doc ID to delete it. complex mapping.
            // Simplified: we'll query for it.
            // For now, this is a limitation without direct ID mapping. 
            // Workaround: We fetch the doc we need to delete.
            // Ideally favorites collection should have predictable IDs: `userId_type_id`.
            // Let's assume global favorites for demo simplicity or use compound ID.
            const docId = key; // Use key as ID
            try {
                // If we used addDoc logic above we can't do this easily.
                // Let's switch logic: use setDoc with custom ID.
                await deleteDoc(doc(db, 'favorites', key));
            } catch (e) {
                // ignore, maybe didn't exist
            }
        } else {
            await import('firebase/firestore').then(mod =>
                mod.setDoc(mod.doc(db, 'favorites', key), { key, type, itemId: id })
            );
        }
    };

    const isFavorite = (type, id) => favorites.includes(`${type}-${id}`);

    const getFavorites = (type) => favorites
        .filter(f => f.startsWith(type))
        .map(f => f.split('-')[1]);

    // ============ EVENT FUNCTIONS ============
    const registerForEvent = async (eventId, userId) => {
        const reg = await addToDb('eventRegistrations', { eventId, userId, registeredAt: new Date().toISOString() });

        // Update event count (non-atomic for demo, transaction better for prod)
        const event = events.find(e => e.id === eventId);
        if (event) {
            updateInDb('events', eventId, { registered: (event.registered || 0) + 1 });
        }
        return reg;
    };

    const unregisterFromEvent = async (eventId, userId) => {
        // Find registration to delete
        const reg = eventRegistrations.find(r => r.eventId === eventId && r.userId === userId);
        if (reg) {
            await deleteFromDb('eventRegistrations', reg.id);
            const event = events.find(e => e.id === eventId);
            if (event) {
                updateInDb('events', eventId, { registered: Math.max(0, (event.registered || 0) - 1) });
            }
        }
    };

    const isRegisteredForEvent = (eventId, userId) => {
        return eventRegistrations.some(r => r.eventId === eventId && r.userId === userId);
    };

    // ============ SEARCH FUNCTIONS ============
    // Kept client-side for now since datasets are small in demo
    const searchAgents = (queryText, filters = {}) => {
        return agents.filter(agent => {
            const matchesQuery = !queryText ||
                agent.name?.toLowerCase().includes(queryText.toLowerCase()) ||
                agent.title?.toLowerCase().includes(queryText.toLowerCase()) ||
                agent.skills?.some(s => s.toLowerCase().includes(queryText.toLowerCase()));

            const matchesLocation = !filters.location ||
                agent.location?.toLowerCase().includes(filters.location.toLowerCase());

            const matchesCategory = !filters.category ||
                agent.category === filters.category;

            const matchesPriceRange = !filters.priceRange || (() => {
                const [min, max] = filters.priceRange.split('-').map(Number);
                if (filters.priceRange.includes('+')) {
                    return (agent.hourlyRate || 0) >= parseInt(filters.priceRange);
                }
                return (agent.hourlyRate || 0) >= min && (agent.hourlyRate || 0) <= max;
            })();

            return matchesQuery && matchesLocation && matchesCategory && matchesPriceRange;
        });
    };

    const searchSpaces = (queryText, filters = {}) => {
        return spaces.filter(space => {
            const matchesQuery = !queryText ||
                space.name?.toLowerCase().includes(queryText.toLowerCase()) ||
                space.type?.toLowerCase().includes(queryText.toLowerCase()) ||
                space.location?.toLowerCase().includes(queryText.toLowerCase());

            const matchesLocation = !filters.location ||
                space.location?.toLowerCase().includes(filters.location.toLowerCase());

            const matchesType = !filters.type ||
                space.type === filters.type;

            return matchesQuery && matchesLocation && matchesType;
        });
    };

    const searchEmployers = (queryText, filters = {}) => {
        return employers.filter(employer => {
            const matchesQuery = !queryText ||
                employer.name?.toLowerCase().includes(queryText.toLowerCase()) ||
                employer.industry?.toLowerCase().includes(queryText.toLowerCase());

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
