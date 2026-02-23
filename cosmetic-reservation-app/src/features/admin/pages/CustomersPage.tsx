// src/features/admin/pages/CustomersPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useReservationStore } from '@/features/reservations/store/reservationStore';
import { LoadingState, EmptyState, ErrorState, Button } from '@/shared/components/ui';
import {
    Users,
    UserX,
    Search,
    Phone,
    Mail,
    RefreshCw,
    ShoppingBag,
    TrendingUp,
    UserCheck,
    Star,
    Calendar,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

// Derived customer type from reservations
interface DerivedCustomer {
    id: string; // customerPhone used as unique key
    name: string;
    phone: string;
    email?: string;
    reservationCount: number;
    totalSpent: number;
    lastActivity: Date;
    status: 'ACTIF' | 'INACTIF';
}

type FilterType = 'all' | 'actif' | 'inactif' | 'top';
type SortKey = 'name' | 'reservationCount' | 'totalSpent' | 'lastActivity';

export function CustomersPage() {
    const { reservations, fetchReservations, loading, error } = useReservationStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortKey, setSortKey] = useState<SortKey>('lastActivity');
    const [sortDesc, setSortDesc] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    // Aggregate reservations into unique customers keyed by phone
    const customers = useMemo<DerivedCustomer[]>(() => {
        const map = new Map<string, DerivedCustomer>();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        for (const r of reservations) {
            const key = r.customerPhone;
            if (!key) continue;

            const existing = map.get(key);
            const reservationDate = new Date(r.createdAt);
            const totalPrice = Number(r.totalPrice) || 0;

            if (existing) {
                existing.reservationCount += 1;
                existing.totalSpent += totalPrice;
                if (reservationDate > existing.lastActivity) {
                    existing.lastActivity = reservationDate;
                }
                // Update email if we find one
                if (!existing.email && r.customerEmail) {
                    existing.email = r.customerEmail;
                }
            } else {
                map.set(key, {
                    id: key,
                    name: r.customerName,
                    phone: r.customerPhone,
                    email: r.customerEmail || undefined,
                    reservationCount: 1,
                    totalSpent: totalPrice,
                    lastActivity: reservationDate,
                    status: 'ACTIF', // will be recomputed below
                });
            }
        }

        // Compute status
        return Array.from(map.values()).map((c) => ({
            ...c,
            status: c.lastActivity >= thirtyDaysAgo ? 'ACTIF' : 'INACTIF',
        }));
    }, [reservations]);

    // Stats
    const stats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const activeCount = customers.filter((c) => c.status === 'ACTIF').length;
        const newThisMonth = customers.filter((c) => c.lastActivity >= startOfMonth).length;
        const topClient = customers.reduce<DerivedCustomer | null>((best, c) => {
            if (!best || c.reservationCount > best.reservationCount) return c;
            return best;
        }, null);
        return { total: customers.length, activeCount, newThisMonth, topClient };
    }, [customers]);

    // Filter + search + sort
    const filteredCustomers = useMemo(() => {
        let list = customers;

        // Filter by status/type
        if (filter === 'actif') list = list.filter((c) => c.status === 'ACTIF');
        else if (filter === 'inactif') list = list.filter((c) => c.status === 'INACTIF');
        else if (filter === 'top') list = [...list].sort((a, b) => b.reservationCount - a.reservationCount).slice(0, 10);

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            list = list.filter(
                (c) =>
                    c.name.toLowerCase().includes(term) ||
                    c.phone.includes(term) ||
                    (c.email && c.email.toLowerCase().includes(term))
            );
        }

        // Sort
        list = [...list].sort((a, b) => {
            let diff = 0;
            if (sortKey === 'name') diff = a.name.localeCompare(b.name);
            else if (sortKey === 'reservationCount') diff = a.reservationCount - b.reservationCount;
            else if (sortKey === 'totalSpent') diff = a.totalSpent - b.totalSpent;
            else if (sortKey === 'lastActivity') diff = a.lastActivity.getTime() - b.lastActivity.getTime();
            return sortDesc ? -diff : diff;
        });

        return list;
    }, [customers, filter, searchTerm, sortKey, sortDesc]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDesc((p) => !p);
        else { setSortKey(key); setSortDesc(true); }
    };

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <ChevronDown size={14} className="text-gray-300" />;
        return sortDesc
            ? <ChevronDown size={14} className="text-purple-600" />
            : <ChevronUp size={14} className="text-purple-600" />;
    };

    if (loading && customers.length === 0) return <LoadingState message="Chargement des clients..." />;
    if (error && customers.length === 0) return <ErrorState message={error} onRetry={fetchReservations} />;
    if (!loading && customers.length === 0) {
        return (
            <EmptyState
                icon={UserX}
                title="Aucun client"
                description="Aucun client enregistré pour le moment. Les clients apparaissent dès qu'une réservation est créée."
            />
        );
    }

    const formatDate = (d: Date) =>
        d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

    const formatCurrency = (n: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

    const filterBtnClass = (f: FilterType) =>
        `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f
            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
        }`;

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white shadow-lg shadow-blue-500/25">
                            <Users size={20} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                                Clients
                            </span>
                        </h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium ml-1">
                        {customers.length} client{customers.length > 1 ? 's' : ''} au total
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="md"
                    onClick={() => fetchReservations()}
                    isLoading={loading}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total clients', value: stats.total, icon: Users, color: 'blue' },
                    { label: 'Clients actifs', value: stats.activeCount, icon: UserCheck, color: 'green' },
                    { label: 'Nouveaux ce mois', value: stats.newThisMonth, icon: Calendar, color: 'purple' },
                    {
                        label: 'Client le + actif',
                        value: stats.topClient?.name.split(' ')[0] ?? '—',
                        icon: Star,
                        color: 'amber',
                        sub: stats.topClient ? `${stats.topClient.reservationCount} résas` : '',
                    },
                ].map(({ label, value, icon: Icon, color, sub }) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                        <div className={`inline-flex p-2 rounded-xl mb-3 bg-${color}-100 dark:bg-${color}-900/20`}>
                            <Icon size={18} className={`text-${color}-600 dark:text-${color}-400`} />
                        </div>
                        <p className="text-2xl font-black text-gray-800 dark:text-white">{value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{label}</p>
                        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
                    </motion.div>
                ))}
            </div>

            {/* Filters + Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, téléphone ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {(['all', 'actif', 'inactif', 'top'] as FilterType[]).map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={filterBtnClass(f)}>
                            {f === 'all' ? 'Tous' : f === 'top' ? '⭐ Top' : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <th className="text-left px-5 py-3.5">
                                    <button
                                        onClick={() => toggleSort('name')}
                                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                                    >
                                        Client <SortIcon k="name" />
                                    </button>
                                </th>
                                <th className="text-left px-5 py-3.5 hidden md:table-cell">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Contact
                                    </span>
                                </th>
                                <th className="text-center px-5 py-3.5">
                                    <button
                                        onClick={() => toggleSort('reservationCount')}
                                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors mx-auto"
                                    >
                                        Résas <SortIcon k="reservationCount" />
                                    </button>
                                </th>
                                <th className="text-right px-5 py-3.5 hidden lg:table-cell">
                                    <button
                                        onClick={() => toggleSort('totalSpent')}
                                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors ml-auto"
                                    >
                                        Total généré <SortIcon k="totalSpent" />
                                    </button>
                                </th>
                                <th className="text-right px-5 py-3.5 hidden xl:table-cell">
                                    <button
                                        onClick={() => toggleSort('lastActivity')}
                                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors ml-auto"
                                    >
                                        Dernière activité <SortIcon k="lastActivity" />
                                    </button>
                                </th>
                                <th className="text-center px-5 py-3.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Statut
                                    </span>
                                </th>
                                <th className="text-right px-5 py-3.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Actions
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {filteredCustomers.map((customer, index) => (
                                <motion.tr
                                    key={customer.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition-colors"
                                >
                                    {/* Name */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {customer.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 dark:text-white text-sm">
                                                    {customer.name}
                                                </p>
                                                {customer.reservationCount > 2 && (
                                                    <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                                        <Star size={10} fill="currentColor" /> Client fidèle
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="px-5 py-4 hidden md:table-cell">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                                                <Phone size={13} />
                                                <span>{customer.phone}</span>
                                            </div>
                                            {customer.email && (
                                                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-500">
                                                    <Mail size={13} />
                                                    <span className="truncate max-w-[180px]">{customer.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Reservations */}
                                    <td className="px-5 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <ShoppingBag size={14} className="text-purple-500" />
                                            <span className="font-bold text-gray-800 dark:text-white">
                                                {customer.reservationCount}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Total spent */}
                                    <td className="px-5 py-4 text-right hidden lg:table-cell">
                                        <div className="flex items-center justify-end gap-1">
                                            <TrendingUp size={14} className="text-green-500" />
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(customer.totalSpent)}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Last Activity */}
                                    <td className="px-5 py-4 text-right hidden xl:table-cell">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(customer.lastActivity)}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-4 text-center">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${customer.status === 'ACTIF'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                }`}
                                        >
                                            {customer.status}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4 text-right">
                                        <a
                                            href={`tel:${customer.phone}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg text-xs font-semibold transition-colors"
                                        >
                                            <Phone size={13} />
                                            Appeler
                                        </a>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredCustomers.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Aucun client trouvé pour « {searchTerm} »
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default CustomersPage;
