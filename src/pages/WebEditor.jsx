import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePages } from '../context/PageContext';
import { Toolbox } from '../components/editor/Toolbox.jsx';
import { SettingsPanel } from '../components/editor/SettingsPanel.jsx';

import { Container,Button, Text, Card, CardBottom, CardTop, Image, Input, Divider, List, Link, Video, Embed, Dropdown } from "sh_cms-components";

import { Editor, Frame, Element } from "@craftjs/core";
import styles from "./styles/WebEditor.module.css";
import { decompressPageContent, publishPage } from '../services/pageService';

import { saveTemplate } from "../services/templateService.js";
import { useTemplates } from '../context/TemplateContext';
import { TopBar } from '../components/editor/TopBar.jsx';

import {DefaultLayerHeader, Layers} from "@craftjs/layers";
import { RouteManager } from "../components/editor/RouteManager.jsx";

// Przykładowy komponent warstwy z własną stylizacją
const MyCustomLayer = ({  }) => {
    return (
        <div>

            <DefaultLayerHeader />

        </div>
    )
};




const WebEditor = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();
    const { getPage, savePage, loading, error } = usePages();
    const [page, setPage] = useState(null);
    const [serializedState, setSerializedState] = useState(null);
    const [loadingState, setLoadingState] = useState(true);
    const [pageError, setPageError] = useState(null);
    const { saveTemplate } = useTemplates();
    const [routes, setRoutes] = useState(page ? page.routes : []);

    // State for canvas size (desktop/tablet/phone)
    const [canvasSize, setCanvasSize] = useState('desktop');
    // Preview mode: when true, UI (toolbox/settings) is hidden and canvas takes full screen.
    const [previewMode, setPreviewMode] = useState(false);

    // State for panel toggling: 'toolbox' lub 'layers'
    const [activePanel, setActivePanel] = useState('toolbox');

    useEffect(() => {
        const loadPage = async () => {
            setLoadingState(true);
            const pageData = getPage(pageId);

            if (!pageData) {
                setPageError('Page not found');
                setLoadingState(false);
                return;
            }

            setPage(pageData);

            if (pageData && pageData.content) {
                try {
                    const result = await decompressPageContent(pageData.content);
                    if (result.success) {
                        const parsed = JSON.parse(result.content);
                        setSerializedState(parsed);
                    } else {
                        setPageError('Failed to load page content. It may be corrupted.');
                    }
                } catch (error) {
                    console.error('Error decompressing page content:', error);
                    setPageError('Failed to load page content.');
                }
            } else {
                setSerializedState(null);
            }
            setLoadingState(false);
        };

        if (!loading) {
            loadPage();
        }
    }, [pageId, getPage, navigate, loading]);

    const handleSave = async (craftJsState) => {
        try {
            const payload = {
                content: craftJsState,
                routes: routes
            };
            const result = await savePage(pageId, payload);
            if (result.success) {
                alert('Strona zapisana pomyślnie!');
            } else {
                alert(`Błąd zapisu: ${result.error}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Wystąpił nieoczekiwany błąd');
        }
    };

    const handleSaveTemplate = async (templateName, craftJsState) => {
        try {
            await saveTemplate(templateName, craftJsState);
            alert('Szablon zapisany pomyślnie!');
        } catch (error) {
            alert('Błąd podczas zapisywania szablonu');
        }
    };

    if (loading || loadingState) {
        return <div>Loading editor...</div>;
    }

    if (error || pageError) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Error</h2>
                <p>{error || pageError}</p>
                <button onClick={() => navigate('/')}>Back to Dashboard</button>
            </div>
        );
    }

    if (!page) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Page not found</h2>
                <button onClick={() => navigate('/')}>Back to Dashboard</button>
            </div>
        );
    }

    // Inline style for canvas container – adjust width based on selected device.
    const canvasStyle = {
        width: canvasSize === 'desktop' ? '1200px' : canvasSize === 'tablet' ? '768px' : '375px',
        margin: '0 auto'
    };

    const togglePreviewMode = () => {
        setPreviewMode(!previewMode);
    };
    const handlePublish = async () => {
        try {
            const updated = await publishPage(pageId, !page.is_published);
            setPage(updated); // zaktualizuj stan strony
            alert(updated.is_published ? 'Strona opublikowana!' : 'Strona odpubliwowana!');
        } catch (error) {
            alert('Błąd podczas zmiany statusu publikacji');
        }
    };
    return (
        <div className={styles.editorContainer}>
            <Editor resolver={{ Dropdown, Card, Button, Text, Container, CardBottom, CardTop, Divider, Image, Input, List, Link, Video, Embed }}>
                {!previewMode ? (
                    <>
                        <TopBar
                            onSave={handleSave}
                            onSaveTemplate={handleSaveTemplate}
                            canvasSize={canvasSize}
                            setCanvasSize={setCanvasSize}
                        />
                        <div className={styles.editorContent}>
                            <div className={styles.toolboxSection}>
                                <button onClick={handlePublish}>

                                    {page.is_published ? 'Unpublish' : 'Publish'}
                                </button>

                                {activePanel === 'toolbox' && <Toolbox />}

                                {activePanel === 'layers' && (
                                    <Layers />
                                )}
                                {activePanel === 'appsettings' && (
                                    <RouteManager routes={routes} setRoutes={setRoutes} />
                                )}
                                <div className={styles.panelButtons}>
                                    <button
                                        onClick={() => setActivePanel('toolbox')}
                                        className={`${styles.panelButton} ${activePanel === 'toolbox' ? styles.active : ''}`}
                                    >
                                        {/* Ikonka Toolbox, można zastąpić inną */}
                                        <span role="img" aria-label="Toolbox">🧰</span>
                                    </button>
                                    <button
                                        onClick={() => setActivePanel('layers')}
                                        className={`${styles.panelButton} ${activePanel === 'layers' ? styles.active : ''}`}
                                    >

                                        <span role="img" aria-label="Layers">📚</span>
                                    </button>
                                    <button
                                        onClick={() => setActivePanel('appsettings')}
                                        className={`${styles.panelButton} ${activePanel === 'appsettings' ? styles.active : ''}`}
                                    >

                                        <span role="img" aria-label="app">📚</span>
                                    </button>
                                </div>
                            </div>

                            <div className={styles.mainCanvas}>
                                <div style={canvasStyle}>
                                    <Frame json={serializedState}>
                                        <Element is={Container} background={"white"} minHeight={"800px"} canvas={true} />
                                    </Frame>
                                </div>
                            </div>

                            <div className={styles.settingsSection}>
                                <SettingsPanel />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.fullScreenCanvas}>
                        <Frame data={serializedState}>
                            <Element is={Container} canvas />
                        </Frame>
                    </div>
                )}
            </Editor>
            <button onClick={togglePreviewMode} className={styles.previewToggleButton}>
                {previewMode ? 'Edytuj UI' : 'Podgląd strony'}
            </button>
        </div>
    );
};

export default WebEditor;
