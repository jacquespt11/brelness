import { apiClient, handleApiError } from '@/core/api/axios.config';
import { User, UserRole } from '@/features/auth/types/auth.types';

export interface GetUsersQuery {
    role?: UserRole;
}

export const usersService = {
    getAll: async (query?: GetUsersQuery): Promise<User[]> => {
        try {
            const response = await apiClient.get<User[]>('/users', { params: query });
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
    create: async (data: any): Promise<User> => {
        try {
            const response = await apiClient.post<User>('/users', data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
    update: async (id: string | number, data: any): Promise<User> => {
        try {
            const response = await apiClient.patch<User>(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
    delete: async (id: string | number): Promise<void> => {
        try {
            await apiClient.delete(`/users/${id}`);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};
