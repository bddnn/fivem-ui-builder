
import { getToken } from './authService';




const API_URL = `${import.meta.env.VITE_API_SERVICE}builder/`;

export const saveTemplate = async (name, craftJsState) => {
    const token = getToken();
    const lz = await import('lzutf8');
    const compressed = lz.encodeBase64(lz.compress(craftJsState));

    const response = await fetch(`${API_URL}templates/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ name, content: compressed })
    });
    return response.json();
};

export const fetchTemplates = async () => {
    const token = getToken();
    const response = await fetch(`${API_URL}templates/`, {
        headers: { 'Authorization': `Token ${token}` }
    });
    return response.json();
};

export const deleteTemplate = async (templateId) => {
    const token = getToken();
    const response = await fetch(`${API_URL}templates/${templateId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to delete template');
    return true;
};

export const updateTemplate = async (templateId, name) => {
    const token = getToken();
    const response = await fetch(`${API_URL}templates/${templateId}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to update template');
    return response.json();
};
