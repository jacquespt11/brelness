// src/features/auth/services/auth.service.ts
import { api } from '@/api/axios.config';
import { LoginDto } from '../dto/login.dto';
import { AuthResponse } from '../types/auth.types';

export const authService = {
    login: async (loginData: LoginDto): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', loginData);
        return response.data;
    },
};
