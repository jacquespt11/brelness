// src/features/auth/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { AuthState, AuthResponse, User, UserRole } from '../types/auth.types';

interface DecodedToken {
    email: string;
    sub: string;
    role: UserRole;
    exp: number;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (response: AuthResponse) => {
                try {
                    const decoded = jwtDecode<DecodedToken>(response.access_token);

                    // The backend might return user info in response.user, 
                    // but we can also sync with decoded token for extra safety
                    const userData: User = {
                        id: decoded.sub || response.user.id,
                        email: decoded.email || response.user.email,
                        role: decoded.role || response.user.role
                    };

                    set({
                        user: userData,
                        token: response.access_token,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    console.error('Erreur lors du décodage du token:', error);
                    // Fallback if decoding fails but response is valid
                    set({
                        user: response.user,
                        token: response.access_token,
                        isAuthenticated: true,
                    });
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
                // Storage is automatically cleared by persist middleware usually,
                // but we can manually clean objects if needed.
            },

            // Utility to check token expiration
            checkTokenExpiry: () => {
                const token = get().token;
                if (!token) return false;

                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp < currentTime) {
                        get().logout();
                        return true; // Token expired
                    }
                    return false;
                } catch {
                    get().logout();
                    return true;
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
