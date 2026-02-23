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
    }
};
