import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePages } from "../context/PageContext";
import styles from "./styles/Dashboard.module.css"
import { fetchTemplates } from "../services/templateService.js";
import { useTemplates } from '../context/TemplateContext';
import { Spinner} from "../components/misc/Spinner.jsx";

const Dashboard = () => {
    const [newPageName, setNewPageName] = useState("");
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { pages, loading, error, createPage, deletePage } = usePages();
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [editedTemplateName, setEditedTemplateName] = useState('');
    const { templates, loadTemplates, deleteTemplate, updateTemplate } = useTemplates();
    const [activeTab, setActiveTab] = useState('pages'); // 'pages' lub 'templates'

    const handleDeleteTemplate = async (id) => {
        if (window.confirm('Czy na pewno chcesz usunąć ten szablon?')) {
            await deleteTemplate(id);
        }
    };

    const startEditing = (template) => {
        setEditingTemplateId(template.id);
        setEditedTemplateName(template.name);
    };

    const saveEditedTemplate = async () => {
        try {
            await updateTemplate(editingTemplateId, editedTemplateName);
            loadTemplates(true);
            setEditingTemplateId(null);
        } catch (error) {
            alert('Błąd aktualizacji: ' + error.message);
        }
    };

    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    const handleCreatePage = async (e) => {
        e.preventDefault();
        if (newPageName.trim()) {
            console.log("wybrany template: " + selectedTemplate);
            const pageId = await createPage(newPageName.trim(), selectedTemplate);
            if (pageId) {
                setNewPageName("");
                navigate(`/editor/${pageId}`);
            }
        }
    };

    const handleDeletePage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this page?")) return;
        const success = await deletePage(id);
        if (!success) alert("Failed to delete the page.");
    };

    const formatDate = (dateString) => new Date(dateString).toLocaleString();

    // Sortowanie stron wg daty ostatniej modyfikacji, malejąco
    const sortedPages = [...pages].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.dashboardHeader}>
                <h1 className={styles.dashboardTitle}>softHeads - CMS</h1>
                <div className={styles.userInfo}>
                    <span className={styles.userWelcome}>Witaj, {user?.username}</span>
                    <button onClick={logout} className={styles.logoutButton}>WYLOGUJ</button>
                </div>
            </header>

            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'pages' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('pages')}
                >
                    Twoje Strony
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'templates' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('templates')}
                >
                    Szablony
                </button>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.contentWrapper}>
                {/* Wspólny formularz tworzenia strony */}
                <div className={styles.createPageCard}>
                    <h2>Stwórz nową stronę</h2>
                    <form onSubmit={handleCreatePage} className={styles.createPageForm}>
                        <input
                            type="text"
                            value={newPageName}
                            onChange={(e) => setNewPageName(e.target.value)}
                            placeholder="Nazwa strony"
                            className={styles.pageInput}
                        />
                        <select
                            value={selectedTemplate}
                            onChange={(e) => setSelectedTemplate(e.target.value)}
                            className={styles.templateSelect}
                        >
                            <option value="">Wybierz szablon...</option>
                            {templates.map(template => (
                                <option key={template.id} value={template.id}>
                                    {template.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className={styles.createButton}>Utwórz</button>
                    </form>
                </div>

                {activeTab === 'pages' ? (
                    /* Sekcja stron */
                    loading ? (
                        <Spinner/>
                    ) : sortedPages.length === 0 ? (
                        <p className={styles.noPages}>Nie masz jeszcze żadnych stron. Utwórz nową powyżej!</p>
                    ) : (
                        <div className={styles.pagesGrid}>
                            {sortedPages.map((page) => (
                                <div key={page.id} className={styles.pageCard}>
                                    <div className={styles.cardContent}>
                                        <h3 className={styles.pageTitle}>{page.name}</h3>
                                        <p className={styles.pageDate}>
                                            Ostatnia modyfikacja:<br />
                                            {formatDate(page.date)}
                                        </p>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <Link to={`/editor/${page.id}`} className={styles.editButton}>
                                            Edytuj
                                        </Link>
                                        <Link
                                            to={`/preview/${page.id}`}
                                            target="_blank"
                                            className={styles.previewButton}
                                        >
                                            Podgląd
                                        </Link>
                                        <button
                                            onClick={() => handleDeletePage(page.id)}
                                            className={styles.deleteButton}
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    /* Sekcja szablonów */
                    <div className={styles.templatesSection}>
                        <h2>Twoje szablony</h2>
                        {templates.length === 0 ? (
                            <p className={styles.noTemplates}>Brak zapisanych szablonów</p>
                        ) : (
                            <div className={styles.templatesGrid}>
                                {templates.map(template => (
                                    <div key={template.id} className={styles.templateCard}>
                                        {editingTemplateId === template.id ? (
                                            <div className={styles.templateEditForm}>
                                                <input
                                                    type="text"
                                                    value={editedTemplateName}
                                                    onChange={(e) => setEditedTemplateName(e.target.value)}
                                                    className={styles.templateInput}
                                                />
                                                <div className={styles.templateEditButtons}>
                                                    <button
                                                        onClick={saveEditedTemplate}
                                                        className={styles.templateSaveButton}
                                                    >
                                                        Zapisz
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingTemplateId(null)}
                                                        className={styles.templateCancelButton}
                                                    >
                                                        Anuluj
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3>{template.name}</h3>
                                                <p className={styles.templateDate}>
                                                    Utworzono: {new Date(template.created_at).toLocaleDateString()}
                                                </p>
                                                <div className={styles.templateActions}>
                                                    <button
                                                        onClick={() => startEditing(template)}
                                                        className={styles.templateEditButton}
                                                    >
                                                        Edytuj
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTemplate(template.id)}
                                                        className={styles.templateDeleteButton}
                                                    >
                                                        Usuń
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
