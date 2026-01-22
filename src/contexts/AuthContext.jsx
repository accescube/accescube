import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('accescube-user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Get all registered users
                const users = JSON.parse(localStorage.getItem('accescube-users') || '[]');

                // Find user with matching credentials
                const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

                if (foundUser) {
                    // Remove password from session data
                    const { password: _, ...userWithoutPassword } = foundUser;
                    setUser(userWithoutPassword);
                    localStorage.setItem('accescube-user', JSON.stringify(userWithoutPassword));
                    resolve(userWithoutPassword);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 800);
        });
    };

    const register = async (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('accescube-users') || '[]');

                // Check if email already exists
                if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
                    reject(new Error('Email already registered'));
                    return;
                }

                const newUser = {
                    id: Date.now().toString(),
                    ...userData,
                    verified: false,
                    avatar: null,
                    createdAt: new Date().toISOString()
                };

                // Save to users list (including password)
                const updatedUsers = [...users, newUser];
                localStorage.setItem('accescube-users', JSON.stringify(updatedUsers));

                // Save to session (excluding password)
                const { password: _, ...userSession } = newUser;
                setUser(userSession);
                localStorage.setItem('accescube-user', JSON.stringify(userSession));

                resolve(userSession);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('accescube-user');
    };

    const updateProfile = (updates) => {
        const updatedUser = { ...user, ...updates };

        // Update session
        setUser(updatedUser);
        localStorage.setItem('accescube-user', JSON.stringify(updatedUser));

        // Update in users database
        const users = JSON.parse(localStorage.getItem('accescube-users') || '[]');
        const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...updates } : u);
        localStorage.setItem('accescube-users', JSON.stringify(updatedUsers));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
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
