// src/features/auth/types/auth.types.ts
export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
}

export interface User {
    id: string;
    email: string;
    role: UserRole;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (response: AuthResponse) => void;
    logout: () => void;
    checkTokenExpiry: () => boolean;
}
