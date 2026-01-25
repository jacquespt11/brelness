// src/types/admin.ts
export interface DashboardStats {
    totalReservations: number;
    pendingReservations: number;
    completedReservations: number;
    totalRevenue: number;
    monthlyGrowth: number;
    popularProduct: string;
}

export interface RecentActivity {
    id: number;
    type: 'reservation' | 'payment' | 'user';
    description: string;
    time: string;
    user: string;
}

export interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
}