import React, { useState } from 'react';
import { usePatientAuth } from '../../context/PatientAuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, 
    Lock, 
    ArrowRight, 
    Loader2, 
    Sparkles,
    ShieldCheck
} from 'lucide-react';

const PatientLogin = () => {
    const [documentId, setDocumentId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = usePatientAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(documentId.trim(), password);

        if (result.success) {
            navigate('/portal');
        } else {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] relative overflow-hidden font-sans">
            {/* Soft decorative gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-100/40 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-100/30 rounded-full blur-[100px] animate-pulse delay-700"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full px-8 relative z-10"
            >
                {/* Logo Area */}
                <div className="text-center mb-10">
                    <div className="h-20 w-20 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-200 mb-6 group hover:rotate-3 transition-transform duration-500">
                        <svg viewBox="0 0 100 100" className="w-12 h-12 fill-none stroke-white stroke-[6]">
                            <path d="M50 85C40 85 20 75 20 50C20 25 35 15 50 15C65 15 80 25 80 50C80 75 60 85 50 85Z" className="opacity-30" />
                            <path d="M45 25C35 25 25 35 25 50C25 65 35 75 45 75C55 75 70 65 70 50C70 35 55 25 45 25Z" className="fill-white" />
                            <circle cx="50" cy="50" r="10" className="fill-indigo-200" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Portal del Paciente</h1>
                    <p className="text-slate-400 font-medium mt-2">Su salud dental, en un solo lugar.</p>
                </div>

                {/* Login Form */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-10 shadow-2xl shadow-indigo-100/50 border border-white">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[11px] font-black flex items-center gap-3"
                            >
                                <div className="h-6 w-6 rounded-full bg-rose-200 flex items-center justify-center shrink-0">!</div>
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Documento (DNI/CE)</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 text-[14px] font-black text-slate-700 transition-all placeholder:text-slate-300"
                                    placeholder="8 dígitos"
                                    value={documentId}
                                    onChange={(e) => setDocumentId(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Web</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-indigo-500 text-[14px] font-black text-slate-700 transition-all placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Ingresar al Portal
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-emerald-400" /> Acceso Seguro
                    </div>
                </div>

                <p className="mt-10 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">
                    Si no tiene sus credenciales, por favor <br /> solicítelas en su próxima visita presencial.
                </p>
            </motion.div>
        </div>
    );
};

export default PatientLogin;
