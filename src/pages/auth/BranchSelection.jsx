import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Building2, LayoutDashboard } from 'lucide-react';

const BranchSelection = () => {
    const { user, switchBranch } = useAuth();
    const navigate = useNavigate();

    if (!user || !user.availableBranches || user.availableBranches.length === 0) {
        navigate('/login');
        return null;
    }

    const handleSelect = (branch) => {
        switchBranch(branch);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-4">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mint/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl w-full glass-card rounded-[40px] p-8 md:p-12 relative z-10 border border-white/40 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="h-16 w-16 bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-900/20">
                        <Building2 className="text-mint" size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2 uppercase">Seleccionar Sede</h2>
                    <p className="text-slate-500 font-medium">Hola <span className="text-teal-600 font-black">{user.name}</span>, selecciona la sede para trabajar hoy.</p>
                </div>

                <div className="space-y-4">
                    {user.availableBranches.map((branch, index) => (
                        <motion.button
                            key={branch.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleSelect(branch)}
                            className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[24px] hover:border-teal hover:bg-teal/5 transition-all group shadow-sm active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-teal group-hover:text-white transition-all shadow-inner">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="font-black text-slate-800 group-hover:text-teal uppercase tracking-tight transition-colors">{branch.name}</p>
                                    <p className="text-xs text-slate-400 font-medium">{branch.address || 'Sin dirección registrada'}</p>
                                </div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-teal/20 group-hover:text-teal transition-all">
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 flex justify-center">
                    <button 
                        onClick={() => navigate('/login')}
                        className="text-xs font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                        Cerrar Sesión y salir
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default BranchSelection;
