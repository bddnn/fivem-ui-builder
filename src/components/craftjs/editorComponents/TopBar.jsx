import { useEditor } from "@craftjs/core";
import { useNavigate } from "react-router-dom";
import {
    SaveIcon,
    DashboardIcon,
    PhoneIcon,
    TemplateIcon,
    DesktopIcon,
    TabletIcon
} from "../../misc/Icons.jsx";
import styles from "./styles/TopBar.module.css";

export const TopBar = ({ onSave, onSaveTemplate, canvasSize, setCanvasSize }) => {
    const { query } = useEditor();
    const navigate = useNavigate();

    const handleSaveAsTemplate = async () => {
        const templateName = prompt("Podaj nazwę szablonu:");
        if (templateName) {
            const json = query.serialize();
            await onSaveTemplate(templateName, json);
            alert("Szablon zapisany!");
        }
    };

    const handleSave = () => {
        const json = query.serialize();
        onSave(json);
    };

    return (
        <div className={styles.topBar}>
            <div className={styles.canvasSizeSelector}>
                <button
                    className={`${styles.button} ${canvasSize === "desktop" ? styles.activeButton : ""}`}
                    onClick={() => setCanvasSize("desktop")}
                >
                    <DesktopIcon className={styles.icon} />
                </button>
                <button
                    className={`${styles.button} ${canvasSize === "tablet" ? styles.activeButton : ""}`}
                    onClick={() => setCanvasSize("tablet")}
                >
                    <TabletIcon className={styles.icon} />
                </button>
                <button
                    className={`${styles.button} ${canvasSize === "phone" ? styles.activeButton : ""}`}
                    onClick={() => setCanvasSize("phone")}
                >
                    <PhoneIcon className={styles.icon} />
                </button>
            </div>

            <div className={styles.controls}>
                <button onClick={handleSave} className={styles.button}>
                    <SaveIcon className={styles.icon} />
                    <span>Zapisywanie</span>
                </button>
                <button onClick={handleSaveAsTemplate} className={styles.button}>
                    <TemplateIcon className={styles.icon} />
                    <span>Szablon</span>
                </button>
                <button onClick={() => navigate("/")} className={styles.button}>
                    <DashboardIcon className={styles.icon} />
                    <span>Dashboard</span>
                </button>
            </div>
        </div>
    );
};
