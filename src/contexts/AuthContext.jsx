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

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (userData) => {
        // 1. Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
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

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {!loading && children}
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
