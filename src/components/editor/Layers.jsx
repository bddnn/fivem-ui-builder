import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import styles from './styles/Layers.module.css';

const LayerItem = ({ nodeId, nodes, depth, onSelect, selectedId }) => {
    const [collapsed, setCollapsed] = useState(false);
    const node = nodes[nodeId];
    if (!node || !node.data) return null;

    // Ustalamy nazwę warstwy – próbujemy odczytać displayName, name lub nazwę typu komponentu.
    const displayName =
        node.data.displayName ||
        node.data.name ||
        (node.data.type && (node.data.type.displayName || node.data.type.name)) ||
        node.data.type ||
        'Nieznany';

    // Pobieramy dzieci, zabezpieczając od potencjalnego braku danych
    const childrenIds = (node.data.nodes && Array.isArray(node.data.nodes)) ? node.data.nodes : [];

    const handleToggle = (e) => {
        e.stopPropagation();
        setCollapsed((prev) => !prev);
    };

    return (
        <li className={styles.layerItem} style={{ paddingLeft: depth * 16 }}>
            <div
                className={`${styles.layerLabel} ${selectedId === nodeId ? styles.selected : ''}`}
                onClick={() => onSelect(nodeId)}
            >
                {childrenIds.length > 0 && (
                    <button className={styles.toggleButton} onClick={handleToggle}>
                        {collapsed ? '+' : '-'}
                    </button>
                )}
                <span>{displayName}</span>
            </div>
            {!collapsed && childrenIds.length > 0 && (
                <ul className={styles.childList}>
                    {childrenIds.map((childId) => (
                        <LayerItem
                            key={childId}
                            nodeId={childId}
                            nodes={nodes}
                            depth={depth + 1}
                            onSelect={onSelect}
                            selectedId={selectedId}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export const Layers = () => {
    const { query, actions, selectedNodeId } = useEditor((state) => ({
        selectedNodeId: state.events.selected,
    }));

    // Pobieramy drzewo w formie serializedNodes
    const serializedNodes = query.getSerializedNodes();
    if (!serializedNodes) return null;
    const { rootNodeId, nodes } = serializedNodes;

    // Jeśli rootNodeId to "ROOT", to pobieramy jego dzieci jako top-level elementy
    const topLevelIds =
        rootNodeId === "ROOT" && nodes["ROOT"] && nodes["ROOT"].data
            ? nodes["ROOT"].data.nodes || []
            : [rootNodeId];

    const handleSelect = (nodeId) => {
        actions.selectNode(nodeId);
    };

    return (
        <div className={styles.layersContainer}>
            <h3 className={styles.title}>Warstwy</h3>
            <ul className={styles.layerList}>
                {topLevelIds.length > 0 ? (
                    topLevelIds.map((nodeId) => (
                        <LayerItem
                            key={nodeId}
                            nodeId={nodeId}
                            nodes={nodes}
                            depth={0}
                            onSelect={handleSelect}
                            selectedId={selectedNodeId}
                        />
                    ))
                ) : (
                    <li>Brak elementów</li>
                )}
            </ul>
        </div>
    );
};
