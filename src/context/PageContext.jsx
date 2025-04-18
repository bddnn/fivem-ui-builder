import { createContext, useState, useEffect, useContext } from 'react';
import {
    fetchPages,
    createPage as createPageService,
    deletePage as deletePageService,
    savePage as savePageService,
    getPage as getPageService
} from '../services/pageService';
import { useAuth } from './AuthContext';

const PageContext = createContext(null);

export const PageProvider = ({ children }) => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            loadPages();
        } else {
            setPages([]);
            setLoading(false);
        }
    }, [isAuthenticated]);

    const loadPages = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);

        try {
            const fetchedPages = await fetchPages();
            setPages(fetchedPages);
        } catch (err) {
            console.error('Nie udało się załadować strony:', err);
            setError('Nie udało się załadować stron, spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    const createPage = async (name, templateId) => { // Dodaj parametr templateId
        if (!isAuthenticated) {
            setError('Musisz być zalogowanym aby tworzyć nowe strony!');
            return null;
        }

        setLoading(true);
        try {
            const newPage = await createPageService(name, templateId); // Przekaż templateId
            setPages(prevPages => [...prevPages, newPage]);
            setLoading(false);
            return newPage.id;
        } catch (err) {
            setError('Nie udało się stworzyć strony');
            setLoading(false);
            return null;
        }
    };

    const deletePage = async (pageId) => {
        if (!isAuthenticated) {
            setError('Musisz byc zalogowanym aby usunąc stronę!');
            return false;
        }

        try {
            await deletePageService(pageId);
            setPages(prevPages => prevPages.filter(page => page.id !== pageId));
            return true;
        } catch (err) {
            setError('Nie udało sie usunąc strony');
            return false;
        }
    };

    const savePage = async (pageId, payload) => {
        try {
            const result = await savePageService(pageId, payload);
            if (result.success) {
                setPages(prev => prev.map(p =>
                    p.id === result.updatedPage.id ? result.updatedPage : p
                ));
                return result;
            }
            setError(result.error);
            return false;
        } catch (err) {
            setError('Błąd zapisu: ' + err.message);
            return false;
        }
    };

    const getPage = (pageId) => {
        const stringPageId = String(pageId);
        return pages.find(page => String(page.id) === stringPageId) || null;
    };

    return (
        <PageContext.Provider value={{
            pages,
            loading,
            error,
            loadPages,
            createPage,
            deletePage,
            savePage,
            getPage
        }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePages = () => useContext(PageContext);