import React, { useEffect, useState } from 'react';
import { usePatientAuth } from '../../context/PatientAuthContext';
import { 
    Calendar, 
    FileText, 
    CreditCard, 
    LogOut, 
    User, 
    Bell, 
    CheckCircle, 
    Clock, 
    ChevronRight,
    MapPin,
    Phone,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const PatientPortal = () => {
    const { patient, logout } = usePatientAuth();
    const [appointments, setAppointments] = useState([]);
    const [treatments, setTreatments] = useState([]);
    const [documents, setDocuments] = useState({ consents: [], files: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appsRes, treatsRes, docsRes] = await Promise.all([
                    api.get('/portal/appointments'),
                    api.get('/portal/treatments'),
                    api.get('/portal/documents')
                ]);
                setAppointments(appsRes.data);
                setTreatments(treatsRes.data);
                setDocuments(docsRes.data);
            } catch (err) {
                console.error('Error fetching portal data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const nextAppointment = appointments.find(a => new Date(a.date) > new Date());

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
            <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Cargando su Portal de Salud</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
            {/* Header / Navbar */}
            <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <svg viewBox="0 0 100 100" className="w-6 h-6 fill-none stroke-white stroke-[8]">
                                <path d="M50 85C40 85 20 75 20 50C20 25 35 15 50 15C65 15 80 25 80 50C80 75 60 85 50 85Z" />
                                <circle cx="50" cy="50" r="10" className="fill-white" />
                            </svg>
                        </div>
                        <span className="text-xl font-black text-slate-800 tracking-tighter">Mi Dental Portal</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="h-10 w-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all relative">
                            <Bell size={20} />
                            <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
                        </button>
                        <button 
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95"
                        >
                            <LogOut size={14} /> Salir
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
                
                {/* Welcome Hero */}
                <section className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                Hola, {patient.name.split(' ')[0]} 👋
                            </h2>
                            <p className="text-indigo-200 font-medium text-lg">Tienes el control de tu sonrisa hoy.</p>
                        </div>

                        {nextAppointment ? (
                            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Calendar className="text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Próxima Cita</p>
                                    <p className="font-bold text-lg">
                                        {new Date(nextAppointment.date).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                    <p className="text-[12px] text-indigo-100 opacity-80 uppercase font-black">
                                        {new Date(nextAppointment.date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} · {nextAppointment.doctor?.name}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <button className="bg-white text-indigo-700 px-8 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-900/40 hover:bg-slate-50 transition-all active:scale-95">
                                Agendar nueva cita
                            </button>
                        )}
                    </div>
                    <div className="absolute bottom-[-10%] left-[60%] w-60 h-60 bg-cyan-400/20 rounded-full blur-3xl" />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Column 1: Shortcuts & Status */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Acceso Rápido</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: 'home', label: 'Dashboard', icon: User, color: 'bg-indigo-500' },
                                { id: 'appointments', label: 'Mis Citas', icon: Calendar, color: 'bg-emerald-500' },
                                { id: 'treatments', label: 'Tratamientos', icon: CreditCard, color: 'bg-amber-500' },
                                { id: 'documents', label: 'Documentos', icon: FileText, color: 'bg-blue-500' },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={cn(
                                        "flex items-center gap-4 p-5 rounded-3xl border-2 transition-all group",
                                        activeTab === item.id 
                                            ? "bg-white border-indigo-200 shadow-xl shadow-indigo-100/50" 
                                            : "bg-white/50 border-transparent hover:border-slate-200"
                                    )}
                                >
                                    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", item.color)}>
                                        <item.icon size={22} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[13px] font-black text-slate-800 tracking-tight">{item.label}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Ver detalles</p>
                                    </div>
                                    <ChevronRight size={18} className="ml-auto text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Dynamic Area (Column 2 & 3) */}
                    <div className="md:col-span-2 space-y-6">
                        <AnimatePresence mode="wait">
                            {activeTab === 'home' && (
                                <motion.div
                                    key="home"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Appointment Cards */}
                                    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Citas Recientes</h3>
                                            <button onClick={() => setActiveTab('appointments')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Ver Historial</button>
                                        </div>
                                        <div className="space-y-4">
                                            {appointments.slice(0, 3).map(app => (
                                                <div key={app.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-all cursor-pointer group">
                                                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", 
                                                        app.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                                    )}>
                                                        {app.status === 'COMPLETED' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] font-black text-slate-800 tracking-tight">
                                                            {new Date(app.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest truncate">
                                                            {app.doctor?.name} · {app.branch?.name}
                                                        </p>
                                                    </div>
                                                    <span className={cn("text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                                                        app.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'
                                                    )}>
                                                        {app.status === 'SCHEDULED' ? 'Pendiente' : 'Atendido'}
                                                    </span>
                                                </div>
                                            ))}
                                            {appointments.length === 0 && (
                                                <p className="text-center py-10 text-slate-400 font-medium italic">Sin citas registradas</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Banner */}
                                    <div className="bg-cyan-50 rounded-[40px] p-8 border border-cyan-100 flex flex-col md:flex-row items-center gap-6">
                                        <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-xl shadow-cyan-900/5 shrink-0">
                                            <Shield size={32} className="text-cyan-600" />
                                        </div>
                                        <div className="flex-1 space-y-1 text-center md:text-left">
                                            <h4 className="text-xl font-black text-cyan-900 tracking-tight leading-tight">¿Alguna molestia?</h4>
                                            <p className="text-cyan-700 text-sm font-medium">Contáctanos directamente vía WhatsApp para una urgencia.</p>
                                        </div>
                                        <button className="bg-cyan-600 text-white px-8 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-cyan-600/30 active:scale-95 transition-all">
                                            Contactar
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'appointments' && (
                                <motion.div
                                    key="appointments"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 min-h-[500px]"
                                >
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Historial de Citas</h3>
                                    <div className="space-y-4">
                                        {appointments.map(app => (
                                            <div key={app.id} className="p-6 rounded-3xl bg-slate-50/80 border border-slate-100 flex flex-wrap gap-6 items-center">
                                                <div className="space-y-1 min-w-[120px]">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FECHA</p>
                                                    <p className="text-[14px] font-black text-slate-800 tracking-tight">
                                                        {new Date(app.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-[12px] font-bold text-indigo-600">
                                                        {new Date(app.date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <div className="space-y-1 flex-1 min-w-[150px]">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DOCTOR / SEDE</p>
                                                    <p className="text-[14px] font-black text-slate-800 tracking-tight">{app.doctor?.name}</p>
                                                    <div className="flex items-center gap-2 text-slate-500 font-medium text-[12px]">
                                                        <MapPin size={12} className="text-slate-300" /> {app.branch?.name}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 shrink-0">
                                                    <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-center", 
                                                        app.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                                                    )}>
                                                        {app.status === 'COMPLETED' ? 'Atendido' : app.status === 'SCHEDULED' ? 'Programado' : 'Cancelado'}
                                                    </span>
                                                    {app.status === 'SCHEDULED' && (
                                                        <button className="text-[10px] font-black text-rose-500 hover:text-rose-600 transition-all uppercase tracking-widest">Cancelar</button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'treatments' && (
                                <motion.div
                                    key="treatments"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Mis Tratamientos</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        {treatments.map(plan => (
                                            <div key={plan.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 group">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                            {plan.name || `Plan #${plan.id}`}
                                                        </h4>
                                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                                                            Iniciado el {new Date(plan.createdAt).toLocaleDateString('es-PE')} · Doctor: {plan.doctor?.name}
                                                        </p>
                                                    </div>
                                                    <span className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                                                        Activo
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detalle de Procedimientos</p>
                                                    {plan.items.map(item => (
                                                        <div key={item.id} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                                                            <div className={cn("h-2 w-2 rounded-full", item.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-slate-200')} />
                                                            <p className="text-[13px] font-bold text-slate-700 flex-1">{item.service?.name}</p>
                                                            {item.toothNumber && <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">Diente {item.toothNumber}</span>}
                                                            <span className={cn("text-[12px] font-black tabular-nums", item.status === 'COMPLETED' ? 'text-emerald-600' : 'text-slate-400')}>
                                                                {item.status === 'COMPLETED' ? 'Terminado' : 'Pendiente'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                            <CreditCard size={18} />
                                                        </div>
                                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Estado Pagos</p>
                                                    </div>
                                                    <button className="text-[11px] font-black text-indigo-600 border border-indigo-200 px-6 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest">
                                                        Ver Comprobantes
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'documents' && (
                                <motion.div
                                    key="documents"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 min-h-[500px]"
                                >
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Mis Documentos</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Consents */}
                                        <div className="space-y-4">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Consentimientos Firmados</p>
                                            {documents.consents.length > 0 ? documents.consents.map(doc => (
                                                <div key={doc.id} className="p-5 rounded-[28px] bg-slate-50 border border-slate-100 flex items-center gap-4 group hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer">
                                                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-indigo-400 group-hover:text-indigo-600 shadow-sm transition-colors">
                                                        <Shield size={22} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] font-black text-slate-800 truncate tracking-tight">{doc.consentName || 'Consentimiento Informado'}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Firmado: {new Date(doc.signedAt).toLocaleDateString('es-PE')}</p>
                                                    </div>
                                                    <button className="h-8 w-8 rounded-full bg-white text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white shadow-sm transition-all">
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            )) : (
                                                <div className="text-center py-10 text-slate-300 italic text-sm">Sin documentos de consentimiento</div>
                                            )}
                                        </div>

                                        {/* Files / Images */}
                                        <div className="space-y-4">
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Radiografías / Archivos</p>
                                            {documents.files.length > 0 ? documents.files.map(file => (
                                                <div key={file.id} className="p-5 rounded-[28px] bg-slate-50 border border-slate-100 flex items-center gap-4 group hover:bg-cyan-50 hover:border-cyan-100 transition-all cursor-pointer">
                                                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-cyan-400 group-hover:text-cyan-600 shadow-sm transition-colors">
                                                        <FileText size={22} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-[13px] font-black text-slate-800 truncate tracking-tight">{file.fileName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Subido: {new Date(file.createdAt).toLocaleDateString('es-PE')}</p>
                                                    </div>
                                                    <button className="h-8 w-8 rounded-full bg-white text-slate-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white shadow-sm transition-all">
                                                        <ChevronRight size={16} />
                                                    </button>
                                                </div>
                                            )) : (
                                                <div className="text-center py-10 text-slate-300 italic text-sm">Sin archivos adjuntos</div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 mt-20 py-16 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 text-white">
                    <div className="space-y-6 max-w-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-none stroke-white stroke-[8]">
                                    <path d="M50 85C40 85 20 75 20 50C20 25 35 15 50 15C65 15 80 25 80 50C80 75 60 85 50 85Z" />
                                    <circle cx="50" cy="50" r="10" className="fill-white" />
                                </svg>
                            </div>
                            <span className="text-xl font-black tracking-tighter">Mi Dental Portal</span>
                        </div>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Cuidamos cada detalle de su experiencia clínica, brindándole transparencia y control total sobre su salud bucal.
                        </p>
                        <div className="flex gap-4">
                            <button className="text-slate-500 hover:text-white transition-colors"><Bell size={20} /></button>
                            <button className="text-slate-500 hover:text-white transition-colors"><Shield size={20} /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Atención</h5>
                            <div className="space-y-2">
                                <p className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                                    <Phone size={14} className="text-slate-500" /> +51 987 654 321
                                </p>
                                <p className="flex items-center gap-3 text-slate-300 font-bold text-sm">
                                    <FileText size={14} className="text-slate-500" /> contacto@dental.com
                                </p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Emergencias</h5>
                            <div className="space-y-1">
                                <p className="text-[14px] font-black text-rose-400">Central 24/7</p>
                                <p className="text-slate-400 text-xs font-medium">WhatsApp disponible para urgencias dentales.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto pt-16 mt-16 border-t border-slate-800 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        © 2026 SGD Dental Suite · Lima, Perú
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PatientPortal;
