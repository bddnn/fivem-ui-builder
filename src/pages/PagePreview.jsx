// src/pages/PreviewPage.jsx
import { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import { Frame, Editor } from "@craftjs/core";
import { usePages } from '../context/PageContext';
import { decompressPageContent } from '../services/pageService';
import { Button, Text, Card, CardBottom, CardTop, Image, Input, Divider, List, Link, Video, Embed, Dropdown, Container } from "sh_cms-components";

const PagePreview = () => {
    const { pageId } = useParams();
    const navigate = useNavigate();
    const { getPage } = usePages();
    const [state, setState] = useState({ loading: true, error: null, content: null, pageName: '' });

    useEffect(() => {
        const load = async () => {
            const page = getPage(pageId);
            if (!page) {
                setState(s => ({ ...s, error: 'Strona nie istnieje', loading: false }));
                return;
            }

            try {
                const result = page.content ? await decompressPageContent(page.content) : null;
                let parsedContent = null;
                if (result?.content) {
                    try {
                        parsedContent = JSON.parse(result.content);
                    } catch (parseError) {
                        console.error('Error parsing content:', parseError);
                        setState(s => ({ ...s, error: 'Błąd przetwarzania zawartości strony', loading: false }));
                        return;
                    }
                }
                setState({
                    loading: false,
                    pageName: page.name,
                    content: parsedContent,
                    error: result?.error || (!page.content && 'Brak zawartości do wyświetlenia')
                });
            } catch (error) {
                setState(s => ({ ...s, error: 'Błąd ładowania zawartości', loading: false }));
            }
        };

        load();
    }, [pageId, getPage]);

    return (
        <div>
            {state.loading ? <div>Ładowanie...</div> : state.error ? (
                <div>
                    <h2>Błąd</h2>
                    <p>{state.error}</p>
                    <button onClick={() => navigate('/')}>Powrót</button>
                </div>
            ) : (
                <div>

                    <Editor
                        enabled={false}
                        resolver={{ Dropdown, Card, Button, Text, Container, CardBottom, CardTop, Divider, Image, Input, List, Link, Video, Embed }}
                    >
                        <Frame json={state.content} />
                    </Editor>
                </div>
            )}
        </div>
    );
};

export default PagePreview;
