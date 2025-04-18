import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import styles from "./styles/SettingsPanel.module.css"
export const SettingsPanel = () => {


    const { actions, selected }  = useEditor((state, query) => {
        const [currentNodeId] = state.events.selected;
        let selected;

        if ( currentNodeId ) {
            selected = {
                id: currentNodeId,
                name: state.nodes[currentNodeId].data.name,
                settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
                isDeletable: query.node(currentNodeId).isDeletable()
            };
        }
        return {
            selected
        }
    });
    return selected ? (
        <div className={styles.settingsPanel}>
            <div className="settings-header">
                <span>Selected</span>
                <span className="badge">{selected.name}</span>
            </div>
            {
                selected.settings && React.createElement(selected.settings)
            }
            {
                selected.isDeletable ? (
                    <button
                        onClick={() => {
                            actions.delete(selected.id);
                        }}
                    >
                        Delete
                    </button>
                ) : null
            }
        </div>
    ) : null
};
