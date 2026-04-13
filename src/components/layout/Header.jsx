import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, ChevronDown, Check, Globe, LayoutGrid } from 'lucide-react';

const BranchSwitcher = () => {
    const { user, activeBranch, switchBranch } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const availableBranches = user?.availableBranches || [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (availableBranches.length <= 1 && !activeBranch) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl hover:border-teal/50 hover:bg-slate-50 transition-all group shadow-sm"
            >
                <div className="h-8 w-8 rounded-xl bg-teal/10 text-teal flex items-center justify-center">
                    <Building2 size={18} />
                </div>
                <div className="text-left hidden md:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Sede Activa</p>
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[150px]">
                        {activeBranch?.name || 'Seleccionar...'}
                    </p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-64 bg-white rounded-[24px] shadow-2xl border border-slate-100 p-2 z-[60] overflow-hidden"
                    >
                        <div className="p-3 mb-2 border-b border-slate-50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cambiar de Sede</p>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-1 pr-1">
                            {availableBranches.map((branch) => (
                                <button
                                    key={branch.id}
                                    onClick={() => {
                                        switchBranch(branch);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                                        activeBranch?.id === branch.id 
                                        ? 'bg-teal/5 border border-teal/10' 
                                        : 'hover:bg-slate-50 border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                            activeBranch?.id === branch.id ? 'bg-teal text-white' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            <Building2 size={16} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-xs font-black uppercase tracking-tight ${
                                                activeBranch?.id === branch.id ? 'text-teal' : 'text-slate-700'
                                            }`}>
                                                {branch.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium">{branch.address || 'Sin dirección'}</p>
                                        </div>
                                    </div>
                                    {activeBranch?.id === branch.id && (
                                        <Check size={14} className="text-teal" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="h-20 flex items-center justify-between px-6 mb-4 relative z-50">
            <div className="flex items-center gap-6">
                <BranchSwitcher />
            </div>

            <div className="flex items-center gap-4">
                {/* User Info & Actions can be added here or kept in Sidebar */}
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100/50 rounded-2xl border border-slate-200/50">
                    <div className="h-8 w-8 rounded-full bg-slate-900 text-mint flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-slate-900/10">
                        {user?.name?.[0]}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{user?.profile || user?.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
