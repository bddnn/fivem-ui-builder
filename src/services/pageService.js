// src/services/pageService.js
import { getToken } from './authService';

import React from 'react';

const API_URL = `${import.meta.env.VITE_API_SERVICE}builder/`;

// Fetch all pages from server
export const fetchPages = async () => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const response = await fetch(`${API_URL}pages/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch pages');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching pages:', error);
        throw error;
    }
};

// Create a new page
export const createPage = async (name, templateId) => { // Dodaj parametr templateId
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const body = {
            name,
            date: new Date().toISOString(),
            content: null
        };

        if (templateId) {
            body.template_id = templateId; // Dodaj template_id do body
        }

        const response = await fetch(`${API_URL}pages/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Failed to create page');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating page:', error);
        throw error;
    }
};


export const publishPage = async (pageId, publishStatus) => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required');
    }
    try {
        const response = await fetch(`${API_URL}pages/${pageId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({ is_published: publishStatus })
        });
        if (!response.ok) {
            throw new Error('Failed to update publication status');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating publication status:', error);
        throw error;
    }
};

// Delete a page
export const deletePage = async (pageId) => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const response = await fetch(`${API_URL}pages/${pageId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete page');
        }

        return true;
    } catch (error) {
        console.error('Error deleting page:', error);
        throw error;
    }
};

export const savePage = async (pageId, payload) => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        console.log(payload);
        console.log(payload.content)
        const lz = await import('lzutf8');
        const compressed = lz.encodeBase64(lz.compress(JSON.stringify(payload.content)));

        const response = await fetch(`${API_URL}pages/${pageId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({ content: compressed, routes: payload.routes })
        });

        const data = await response.json();
        console.log("Saving content:", compressed);
        console.log("Sending PATCH to:", `${API_URL}pages/${pageId}/`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            return { success: false, error: errorText };
        }



        return {
            success: true,
            updatedPage: data
        };

    } catch (error) {
        console.error('Full service error:', error);
        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
};
// Get a page by ID from the pages array
export const getPage = (pages, pageId) => {
    // Convert pageId to string for consistent comparison
    const stringPageId = String(pageId);
    return pages.find(page => String(page.id) === stringPageId) || null;
};

// Sync pages with server (for bulk operations)
export const syncPages = async () => {
    const token = getToken();
    if (!token) {
        throw new Error('Authentication required');
    }

    try {
        const response = await fetch(`${API_URL}sync/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to sync pages');
        }

        return await response.json();
    } catch (error) {
        console.error('Error syncing pages:', error);
        throw error;
    }
};

// Decompress page content
export const decompressPageContent = async (compressedContent) => {
    if (!compressedContent) {
        return { success: false, error: 'No content to decompress' };
    }

    try {
        const lz = await import('lzutf8');
        const decompressed = lz.decompress(lz.decodeBase64(compressedContent));
        return {
            success: true,
            content: decompressed
        };
    } catch (e) {
        console.error('Failed to decompress page content:', e);
        return {
            success: false,
            error: e.message
        };
    }
};