// src/context/TemplateContext.js
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { fetchTemplates, saveTemplate, deleteTemplate } from '../services/templateService.js';

const TemplateContext = createContext();

export const TemplateProvider = ({ children }) => {
    const { user } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const lastFetch = useRef(0);
    const CACHE_TTL = 1000 * 60 * 5; // 5 minut cache

    const loadTemplates = async (force = false) => {
        if (!user) return;

        try {
            const now = Date.now();
            if (!force && now - lastFetch.current < CACHE_TTL) return;

            setLoading(true);
            const data = await fetchTemplates();
            setTemplates(data);
            lastFetch.current = now;
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTemplate = async (name, content) => {
        try {
            const newTemplate = await saveTemplate(name, content);
            setTemplates(prev => [...prev, newTemplate]);
            return newTemplate;
        } catch (error) {
            throw error;
        }
    };

    const handleDeleteTemplate = async (id) => {
        try {
            await deleteTemplate(id);
            setTemplates(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            throw error;
        }
    };

    const handleUpdateTemplate = async (id, name) => {
        try {
            const updatedTemplate = await updateTemplate(id, name);
            setTemplates(prev => prev.map(t =>
                t.id === id ? updatedTemplate : t
            ));
            return updatedTemplate;
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        loadTemplates();
    }, [user]);

    return (
        <TemplateContext.Provider
            value={{
                templates,
                loading,
                error,
                loadTemplates,
                saveTemplate: handleSaveTemplate,
                deleteTemplate: handleDeleteTemplate,
                updateTemplate: handleUpdateTemplate,
            }}
        >
            {children}
        </TemplateContext.Provider>
    );
};

export const useTemplates = () => useContext(TemplateContext);