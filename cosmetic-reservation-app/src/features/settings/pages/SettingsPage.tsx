// src/features/settings/pages/SettingsPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Globe, User, Shield, Camera, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { apiClient, handleApiError } from '@/core/api/axios.config';

// Currency options
const CURRENCIES = [
    { code: 'EUR', symbol: '€', label: 'Euro (€)' },
    { code: 'USD', symbol: '$', label: 'Dollar américain ($)' },
    { code: 'CDF', symbol: 'FC', label: 'Franc congolais (FC)' },
    { code: 'XAF', symbol: 'FCFA', label: 'Franc CFA (FCFA)' },
    { code: 'GBP', symbol: '£', label: 'Livre sterling (£)' },
];

interface Toast {
    type: 'success' | 'error';
    message: string;
}

function ToastNotification({ toast, onClose }: { toast: Toast | null; onClose: () => void }) {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [toast, onClose]);

    if (!toast) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-semibold ${toast.type === 'success'
                ? 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                : 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                }`}
        >
            {toast.type === 'success'
                ? <CheckCircle size={18} />
                : <XCircle size={18} />}
            {toast.message}
        </motion.div>
    );
}

export function SettingsPage() {
    const user = useAuthStore((s) => s.user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile state
    const [profile, setProfile] = useState({ name: '', phone: '' });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileLoading, setProfileLoading] = useState(true);

    // System settings (localStorage)
    const [currency, setCurrency] = useState(
        () => localStorage.getItem('brelness_currency') ?? 'EUR'
    );
    const [isSavingSystem, setIsSavingSystem] = useState(false);

    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Toast
    const [toast, setToast] = useState<Toast | null>(null);
    const showToast = (type: Toast['type'], message: string) => setToast({ type, message });

    // Load profile on mount
    useEffect(() => {
        setProfileLoading(true);
        apiClient.get('/users/me')
            .then((res) => {
                setProfile({
                    name: res.data.name ?? '',
                    phone: res.data.phone ?? '',
                });
            })
            .catch(() => {
                // Fallback to auth store data
                setProfile({ name: '', phone: '' });
            })
            .finally(() => setProfileLoading(false));
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            await apiClient.patch('/users/me', profile);
            showToast('success', 'Profil enregistré avec succès.');
        } catch (err: any) {
            showToast('error', handleApiError(err) || 'Erreur lors de la sauvegarde.');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSaveSystem = async () => {
        setIsSavingSystem(true);
        await new Promise((r) => setTimeout(r, 600)); // simulate
        localStorage.setItem('brelness_currency', currency);
        setIsSavingSystem(false);
        showToast('success', 'Paramètres système enregistrés.');
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (passwords.newPassword.length < 6) {
            setPasswordError('Le nouveau mot de passe doit contenir au moins 6 caractères.');
            return;
        }

        setIsSavingPassword(true);
        try {
            await apiClient.patch('/users/me/password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showToast('success', 'Mot de passe modifié avec succès.');
        } catch (err: any) {
            const msg = handleApiError(err);
            setPasswordError(typeof msg === 'string' ? msg : 'Erreur lors de la modification.');
        } finally {
            setIsSavingPassword(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500";
    const labelClass = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2";

    const SectionCard = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm"
        >
            {children}
        </motion.div>
    );

    const SectionHeader = ({ icon: Icon, color, title }: { icon: React.ElementType; color: string; title: string }) => (
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-xl ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
        </div>
    );

    return (
        <div className="space-y-6 pb-12 max-w-3xl">
            <ToastNotification toast={toast} onClose={() => setToast(null)} />

            {/* Page Header */}
            <div>
                <div className="flex items-center space-x-3 mb-1">
                    <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl text-white shadow-lg">
                        <Settings size={20} />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100">
                            Paramètres
                        </span>
                    </h1>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium ml-1">
                    Gérez votre profil et la configuration de l'application
                </p>
            </div>

            {/* ── Section 1: Profile ─────────────────────────────── */}
            <SectionCard delay={0}>
                <SectionHeader icon={User} color="bg-gradient-to-br from-purple-500 to-purple-700" title="Informations profil" />

                {profileLoading ? (
                    <div className="flex items-center justify-center py-8 gap-3 text-gray-400">
                        <Loader2 size={22} className="animate-spin" />
                        <span className="text-sm font-medium">Chargement des paramètres…</span>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Avatar */}
                        <div className="flex items-center gap-5">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                    {avatarPreview
                                        ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                                        : (user?.email?.charAt(0).toUpperCase() ?? 'A')}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center text-white transition-colors shadow-md"
                                >
                                    <Camera size={13} />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-white text-sm">Photo de profil</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">JPG, PNG ou GIF. Max 2MB.</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                                >
                                    Changer la photo
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nom complet</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="Votre nom"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Téléphone</label>
                                <input
                                    type="tel"
                                    className={inputClass}
                                    placeholder="Votre numéro"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Email</label>
                            <input
                                type="email"
                                className={`${inputClass} opacity-60 cursor-not-allowed`}
                                value={user?.email ?? ''}
                                readOnly
                            />
                            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                L'email ne peut pas être modifié.
                            </p>
                        </div>

                        <div>
                            <label className={labelClass}>Rôle</label>
                            <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    {user?.role ?? '—'}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={handleSaveProfile}
                                disabled={isSavingProfile}
                                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md shadow-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSavingProfile
                                    ? <><Loader2 size={16} className="animate-spin" /> Enregistrement…</>
                                    : <><Save size={16} /> Enregistrer le profil</>}
                            </button>
                        </div>
                    </div>
                )}
            </SectionCard>

            {/* ── Section 2: System ─────────────────────────────── */}
            <SectionCard delay={0.05}>
                <SectionHeader icon={Globe} color="bg-gradient-to-br from-blue-500 to-cyan-500" title="Paramètres système" />

                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>Devise principale</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className={inputClass}
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSaveSystem}
                            disabled={isSavingSystem}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-60"
                        >
                            {isSavingSystem
                                ? <><Loader2 size={16} className="animate-spin" /> Enregistrement…</>
                                : <><Save size={16} /> Enregistrer les paramètres</>}
                        </button>
                    </div>
                </div>
            </SectionCard>

            {/* ── Section 3: Security ───────────────────────────── */}
            <SectionCard delay={0.1}>
                <SectionHeader icon={Shield} color="bg-gradient-to-br from-green-500 to-emerald-600" title="Sécurité — Modifier le mot de passe" />

                <form onSubmit={handleChangePassword} className="space-y-4">
                    {[
                        { key: 'current' as const, field: 'currentPassword' as const, label: 'Mot de passe actuel' },
                        { key: 'new' as const, field: 'newPassword' as const, label: 'Nouveau mot de passe' },
                        { key: 'confirm' as const, field: 'confirmPassword' as const, label: 'Confirmer le nouveau mot de passe' },
                    ].map(({ key, field, label }) => (
                        <div key={key}>
                            <label className={labelClass}>{label}</label>
                            <div className="relative">
                                <input
                                    type={showPw[key] ? 'text' : 'password'}
                                    className={inputClass}
                                    placeholder="••••••••"
                                    value={passwords[field]}
                                    onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw({ ...showPw, [key]: !showPw[key] })}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPw[key] ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}

                    {passwordError && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm font-medium">
                            <XCircle size={16} />
                            {passwordError}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSavingPassword}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md shadow-green-500/20 disabled:opacity-60"
                        >
                            {isSavingPassword
                                ? <><Loader2 size={16} className="animate-spin" /> Modification…</>
                                : <><Shield size={16} /> Modifier le mot de passe</>}
                        </button>
                    </div>
                </form>
            </SectionCard>
        </div>
    );
}

export default SettingsPage;
