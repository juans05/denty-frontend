import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, ShieldCheck, Lock, Edit2, Trash2, Plus, 
    X, CheckCircle, Loader2, Info, ChevronRight 
} from 'lucide-react';
import api from '../../services/api';

const RolesView = ({ onRefresh }) => {
    const [profiles, setProfiles] = useState([]);
    const [allPermissions, setAllPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissionIds: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [pRes, perRes] = await Promise.all([
                api.get('profiles'),
                api.get('profiles/permissions')
            ]);
            setProfiles(pRes.data);
            setAllPermissions(perRes.data);
        } catch (error) {
            console.error('Error fetching profiles/permissions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (profile = null) => {
        if (profile) {
            setEditingProfile(profile);
            setFormData({
                name: profile.name,
                description: profile.description || '',
                permissionIds: profile.permissions.map(pp => pp.permissionId)
            });
        } else {
            setEditingProfile(null);
            setFormData({
                name: '',
                description: '',
                permissionIds: []
            });
        }
        setShowModal(true);
    };

    const togglePermission = (pId) => {
        setFormData(prev => ({
            ...prev,
            permissionIds: prev.permissionIds.includes(pId)
                ? prev.permissionIds.filter(id => id !== pId)
                : [...prev.permissionIds, pId]
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingProfile) {
                await api.put(`profiles/${editingProfile.id}`, formData);
            } else {
                await api.post('profiles', formData);
            }
            setShowModal(false);
            fetchData();
            if (onRefresh) onRefresh();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al guardar perfil');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Desea eliminar este perfil?')) return;
        try {
            await api.delete(`profiles/${id}`);
            fetchData();
            if (onRefresh) onRefresh();
        } catch (error) {
            alert(error.response?.data?.message || 'Error al eliminar perfil');
        }
    };

    // Group permissions by prefix for better UI
    const groupedPermissions = allPermissions.reduce((acc, p) => {
        const groupKey = p.key.split(':')[0] || 'GENERAL';
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(p);
        return acc;
    }, {});

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-cyan-500 w-8 h-8" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Perfiles y Permisos</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control de acceso dinámico</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="premium-button-primary py-2.5 px-6"
                >
                    <ShieldCheck size={18} /> Nuevo Perfil
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map(p => (
                    <motion.div
                        key={p.id}
                        layout
                        className="glass-card p-6 rounded-[32px] border border-white/40 shadow-xl shadow-slate-200/50 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-mint shadow-lg shadow-slate-900/20">
                                    <Shield size={22} />
                                </div>
                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    {p.permissions?.length || 0} Permisos
                                </span>
                            </div>
                            <h4 className="font-black text-slate-800 uppercase tracking-tight mb-1">{p.name}</h4>
                            <p className="text-xs text-slate-400 font-medium mb-6 line-clamp-2 leading-relaxed">
                                {p.description || 'Sin descripción'}
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50">
                            <button
                                onClick={() => handleOpenModal(p)}
                                className="p-2 bg-slate-50 text-slate-400 hover:text-cyan-600 rounded-xl transition-all"
                            >
                                <Edit2 size={16} />
                            </button>
                            {p.name !== 'ADMINISTRADOR' && (
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] relative z-10 overflow-hidden border border-white/20 flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                    <ShieldCheck className="text-teal" size={28} /> {editingProfile ? 'Editar' : 'Nuevo'} Perfil
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-rose-500 transition-all"><X size={28} /></button>
                            </div>

                            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Perfil <span className="text-rose-500">*</span></label>
                                        <input
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                                            className="premium-input bg-slate-50/50"
                                            placeholder="Ej. SUPERVISOR CLÍNICO"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción</label>
                                        <input
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="premium-input bg-slate-50/50"
                                            placeholder="Breve descripción del alcance..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Permisos de Acceso</h4>
                                        <span className="text-[10px] font-black text-teal bg-teal/5 px-3 py-1 rounded-full border border-teal/10">
                                            {formData.permissionIds.length} Seleccionados
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {Object.entries(groupedPermissions).map(([group, perms]) => (
                                            <div key={group} className="space-y-3">
                                                <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider bg-slate-50 p-2 rounded-lg inline-block">{group}</h5>
                                                <div className="space-y-2">
                                                    {perms.map(p => (
                                                        <label key={p.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
                                                            <div className="relative">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={formData.permissionIds.includes(p.id)}
                                                                    onChange={() => togglePermission(p.id)}
                                                                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-teal focus:ring-teal/20 transition-all"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-black text-slate-700 uppercase tracking-tight group-hover:text-teal transition-colors">{p.name}</p>
                                                                <p className="text-[10px] text-slate-400 font-medium">{p.description}</p>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>

                            <div className="p-8 bg-slate-50 flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !formData.name}
                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                    {editingProfile ? 'Guardar Cambios' : 'Crear Perfil'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RolesView;
