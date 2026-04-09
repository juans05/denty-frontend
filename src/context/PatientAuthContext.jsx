import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const PatientAuthContext = createContext();

export const PatientAuthProvider = ({ children }) => {
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('patientToken');
        const storedPatient = localStorage.getItem('patientData');
        
        if (token && storedPatient) {
            setPatient(JSON.parse(storedPatient));
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (documentId, password) => {
        try {
            const res = await api.post('/auth/patient-login', { documentId, password });
            const { token, patient: patientData } = res.data;
            
            localStorage.setItem('patientToken', token);
            localStorage.setItem('patientData', JSON.stringify(patientData));
            
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setPatient(patientData);
            
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error al iniciar sesión' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('patientToken');
        localStorage.removeItem('patientData');
        delete api.defaults.headers.common['Authorization'];
        setPatient(null);
        window.location.href = '/portal/login';
    };

    return (
        <PatientAuthContext.Provider value={{ patient, loading, login, logout }}>
            {children}
        </PatientAuthContext.Provider>
    );
};

export const usePatientAuth = () => useContext(PatientAuthContext);
