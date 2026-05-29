import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile as updateAuthProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useTheme } from './ThemeContext';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in, fetch additional profile data from Firestore
                try {
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        // Merge Auth object with Firestore data
                        setUser({ ...firebaseUser, ...userDoc.data(), id: firebaseUser.uid });
                    } else {
                        // Fallback if firestore doc missing (shouldn't happen usually)
                        setUser({ ...firebaseUser, id: firebaseUser.uid });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    // Still set the basic auth user so they aren't locked out
                    setUser(firebaseUser);
                }
            } else {
                // User is signed out
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (username, password) => {
        const dummyEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@accescube.local`;
        return signInWithEmailAndPassword(auth, dummyEmail, password);
    };

    const register = async (userData) => {
        // 1. Create user in Firebase Auth
        const dummyEmail = `${userData.username.toLowerCase().replace(/[^a-z0-9]/g, '')}@accescube.local`;
        const userCredential = await createUserWithEmailAndPassword(auth, dummyEmail, userData.password);
        const firebaseUser = userCredential.user;

        // 2. Prepare profile data (exclude password)
        const { password, ...profileData } = userData;

        const newTimestamp = new Date().toISOString();
        const userProfile = {
            ...profileData,
            id: firebaseUser.uid,
            verified: false,
            avatar: null,
            createdAt: newTimestamp,
            updatedAt: newTimestamp
        };

        // 3. Save detailed profile to Firestore
        await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);

        // 4. Update display name in Auth for convenience
        if (userData.name) {
            await updateAuthProfile(firebaseUser, { displayName: userData.name });
        }

        // State update handled by onAuthStateChanged
        return firebaseUser;
    };

    const logout = () => {
        return signOut(auth);
    };

    const updateProfile = async (updates) => {
        if (!user) return;

        try {
            // Update Firestore document
            const userDocRef = doc(db, 'users', user.id);
            await updateDoc(userDocRef, updates);

            // Update local state immediately for UI responsiveness
            setUser(prev => ({ ...prev, ...updates }));

            // If name changed, optionally update Auth profile too
            if (updates.name) {
                await updateAuthProfile(auth.currentUser, { displayName: updates.name });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    const seedDemoUsers = async () => {
        const demoUsers = [
            { name: 'Demo Agent', username: 'agent', password: 'password123', role: 'agent' },
            { name: 'Demo Provider', username: 'provider', password: 'password123', role: 'space' }
        ];

        for (const u of demoUsers) {
            try {
                await register(u);
                console.log(`Registered ${u.username}`);
            } catch (error) {
                // If it already exists, that's fine
                if (error.code !== 'auth/email-already-in-use') {
                    console.error(`Error seeding ${u.username}:`, error);
                }
            }
        }
    };

    const { theme } = useTheme();

    if (loading) {
        return (
            <div className="min-h-screen bg-primary flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <img
                        src="/logo-src.png"
                        alt="Accescube Logo"
                        className="animate-pulse"
                        style={{
                            height: '50px',
                            width: 'auto',
                            maxWidth: '200px',
                            objectFit: 'contain',
                            filter: theme === 'dark' ? 'brightness(0) invert(1)' : 'brightness(0)',
                        }}
                    />
                    <div className="spinner mt-4"></div>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, seedDemoUsers }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
