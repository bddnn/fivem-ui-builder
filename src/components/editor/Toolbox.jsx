import { useState } from "react";
import { useEditor, Element } from "@craftjs/core";
import { Container, Button, Text, Header, Footer, Card, CardBottom, CardTop, Image, Input, Divider, List, Link, Video, Embed, Dropdown } from "sh_cms-components";

import styles from "./styles/Toolbox.module.css";
import {
    BasicElementsIcon,
    FormElementsIcon,
    LayoutIcon,
    MediaIcon,
} from "../misc/Icons.jsx";

const COMPONENT_SECTIONS = [
    {
        name: "Podstawowe Elementy",
        icon: <BasicElementsIcon />,
        components: [
            {
                name: "Przycisk",
                component: <Button text="Nacisnij" />,
            },
            {
                name: "Tekst",
                component: <Text text="Przykladowy" />,
            },
            {
                name: "Nagłówek",
                component: <Header />
            },
            {
                name: "Karta",
                component: <Card />,
            },
            {
                name: "Stopka",
                component: <Footer />
            }
        ],
    },
    {
        name: "Elementy Formularza",
        icon: <FormElementsIcon />,
        components: [
            {
                name: "Input",
                component: <Input placeholder="Wprowadz tekst..." />,
            },
            {
                name: "Rozwijane Menu", // nowy komponent Dropdown
                component: <Dropdown options={["Opcja 1", "Opcja 2", "Opcja 3"]} />,
            },
        ],
    },
    {
        name: "Media",
        icon: <MediaIcon />,
        components: [
            {
                name: "Zdjęcie",
                component: <Image src="https://gratisography.com/wp-content/uploads/2025/02/gratisography-when-pigs-fly-1170x780.jpg" />,
            },
            {
                name: "Link",
                component: <Link text="Kliknij mnie" href="https://example.com" />,
            },
            {
                name: "Wideo",
                component: <Video src="https://www.w3schools.com/html/mov_bbb.mp4" />,
            },
            {
                name: "Embed",
                component: (
                    <Embed src="https://www.youtube.com/embed/dQw4w9WgXcQ" />
                ),
            },
        ],
    },
    {
        name: "Layout",
        icon: <LayoutIcon />,
        components: [
            {
                name: "Kontener",
                component: <Element is={Container} padding={20} canvas={true} />,
            },
            {
                name: "Rozdzielacz",
                component: <Divider />,
            },
            {
                name: "Lista",
                component: <List items={["Item 1", "Item 2"]} />,
            },
        ],
    },
];

const ToolboxSection = ({ section, connectors }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.section}>
            <div
                className={styles.sectionHeader}
                onClick={() => setOpen(!open)}
            >
                <div className={styles.sectionHeaderContent}>
                    <span className={styles.sectionIcon}>{section.icon}</span>
                    <span className={styles.sectionTitle}>{section.name}</span>
                </div>
                <span className={styles.collapseIcon}>
          {open ? "⌄" : "›"}
        </span>
            </div>
            {open && (
                <div className={styles.componentsGrid}>
                    {section.components.map(({ name, component }) => (
                        <button
                            key={name}
                            ref={(ref) => connectors.create(ref, component)}
                            className={styles.componentButton}
                        >
                            <span className={styles.componentName}>{name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const Toolbox = () => {
    const { connectors } = useEditor();

    return (
        <div className={styles.toolbox}>
            {COMPONENT_SECTIONS.map((section) => (
                <ToolboxSection
                    key={section.name}
                    section={section}
                    connectors={connectors}
                />
            ))}
        </div>
    );
};
