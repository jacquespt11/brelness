import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Edit, Trash2, RefreshCw, UserX, Plus, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { UserRole } from '@/features/auth/types/auth.types';
import { usersService } from '@/features/users/services/users.service';
import { LoadingState, ErrorState, EmptyState, Button, Modal, ModalBody, ModalFooter, Input, Select } from '@/shared/components/ui';

interface AdminUser {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    phone?: string;
    createdAt?: string;
}

export const UsersPage = () => {
    const { user } = useAuthStore();

    if (!user || user.role !== UserRole.SUPER_ADMIN) {
        return <Navigate to="/access-denied" replace />;
    }

    return <UsersPageContent />;
};

export default UsersPage;

function UsersPageContent() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: UserRole.ADMIN,
        name: '',
        phone: '',
    });

    const fetchUsers = async () => {
        try {
            setError(null);
            const data = await usersService.getAll();
            setUsers(data as AdminUser[]);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des utilisateurs');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchUsers();
    };

    const handleOpenCreateModal = () => {
        setModalMode('create');
        setSelectedUser(null);
        setFormData({
            email: '',
            password: '',
            role: UserRole.ADMIN,
            name: '',
            phone: '',
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: AdminUser) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({
            email: user.email,
            password: '', // Password remains empty unless changed
            role: user.role,
            name: user.name || '',
            phone: user.phone || '',
        });
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

        try {
            await usersService.delete(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la suppression');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (modalMode === 'create') {
                const newUser = await usersService.create(formData);
                setUsers(prev => [newUser as AdminUser, ...prev]);
            } else if (selectedUser) {
                const updateData: any = { ...formData };
                if (!updateData.password) delete updateData.password;

                const updatedUser = await usersService.update(selectedUser.id, updateData);
                setUsers(prev => prev.map(u => u.id === selectedUser.id ? (updatedUser as AdminUser) : u));
            }
            setIsModalOpen(false);
        } catch (err: any) {
            alert(err.message || 'Erreur lors de l\'enregistrement');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return <LoadingState message="Chargement des utilisateurs..." />;
    if (error) return <ErrorState message={error} onRetry={fetchUsers} />;

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-500/20">
                            <Users size={20} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white">
                            Gestion des{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                Utilisateurs
                            </span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium">
                        {users.length} utilisateur{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleOpenCreateModal}
                        className="shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={18} className="mr-2" />
                        Nouvel Administrateur
                    </Button>
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={handleRefresh}
                        isLoading={isRefreshing}
                        className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                        <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                    </Button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher par email ou nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
            </div>

            {/* Content */}
            {filteredUsers.length === 0 ? (
                <EmptyState
                    icon={UserX}
                    title="Aucun utilisateur trouvé"
                    description={searchTerm ? "Aucun utilisateur ne correspond à votre recherche." : "Aucun utilisateur enregistré pour le moment."}
                />
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilisateur</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rôle</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Créé le</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredUsers.map((u, index) => (
                                    <motion.tr
                                        key={u.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.04 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center font-bold text-purple-600 dark:text-purple-400 text-sm">
                                                    {(u.name || u.email)[0].toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {u.name || 'Sans nom'}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {u.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.role === UserRole.SUPER_ADMIN
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                <Shield className="w-3 h-3 mr-1" />
                                                {u.role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {u.phone || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(u)}
                                                    className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal Form */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Nouvel Utilisateur' : 'Modifier l\'utilisateur'}>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                                    <Input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="email@example.com"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Mot de passe {modalMode === 'edit' ? '(laisser vide pour ne pas changer)' : '*'}
                                    </label>
                                    <Input
                                        type="password"
                                        required={modalMode === 'create'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom (Optionnel)</label>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nom de l'administrateur"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Téléphone (Optionnel)</label>
                                    <Input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="08..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rôle *</label>
                                <Select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                    className="w-full"
                                    options={[
                                        { value: UserRole.ADMIN, label: 'Administrateur' },
                                        { value: UserRole.SUPER_ADMIN, label: 'Super Administrateur' },
                                    ]}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Annuler</Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting}>
                            {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}
