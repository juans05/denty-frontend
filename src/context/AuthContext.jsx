import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';
import SessionExpiredModal from '../components/SessionExpiredModal';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [activeBranch, setActiveBranch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const storedUser = localStorage.getItem('user');
                const storedBranch = localStorage.getItem('activeBranch');

                if (token && storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                        
                        if (storedBranch) {
                            setActiveBranch(JSON.parse(storedBranch));
                        } else if (parsedUser.availableBranches?.length === 1) {
                            const singleBranch = parsedUser.availableBranches[0];
                            setActiveBranch(singleBranch);
                            localStorage.setItem('activeBranch', JSON.stringify(singleBranch));
                        }
                    } catch (parseError) {
                        console.error('Error parsing stored session data:', parseError);
                        logout();
                    }
                }
            } catch (error) {
                console.error('Error checking user session:', error);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    // Listen for session expired events from api interceptor
    useEffect(() => {
        const handler = () => {
            setUser(null);
            setActiveBranch(null);
            setSessionExpired(true);
        };
        window.addEventListener('auth:session-expired', handler);
        return () => window.removeEventListener('auth:session-expired', handler);
    }, []);

    const handleSessionExpiredRedirect = useCallback(() => {
        setSessionExpired(false);
        window.location.href = '/login';
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('auth/login', { email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            // If only one branch, set it immediately
            if (userData.availableBranches?.length === 1) {
                const branch = userData.availableBranches[0];
                setActiveBranch(branch);
                localStorage.setItem('activeBranch', JSON.stringify(branch));
            } else {
                setActiveBranch(null);
                localStorage.removeItem('activeBranch');
            }

            setSessionExpired(false);
            return { 
                success: true, 
                hasMultipleBranches: (userData.availableBranches?.length || 0) > 1,
                isAdmin: userData.role === 'ADMIN' || userData.profile === 'ADMINISTRADOR'
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const switchBranch = (branch) => {
        setActiveBranch(branch);
        localStorage.setItem('activeBranch', JSON.stringify(branch));
        // Optional: refresh if needed or just let components react to context change
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('activeBranch');
        setUser(null);
        setActiveBranch(null);
    };

    const completeSetup = () => {
        const updated = { ...user, needsSetup: false };
        localStorage.setItem('user', JSON.stringify(updated));
        setUser(updated);
    };

    const hasPermission = useCallback((permissionKey) => {
        if (!user) return false;
        if (user.role === 'ADMIN') return true;
        return user.permissions?.includes(permissionKey);
    }, [user]);

    const value = {
        user,
        activeBranch,
        login,
        logout,
        switchBranch,
        completeSetup,
        hasPermission,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
            {sessionExpired && (
                <SessionExpiredModal onContinue={handleSessionExpiredRedirect} />
            )}
        </AuthContext.Provider>
    );
};
