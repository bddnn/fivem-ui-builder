// src/components/RouteManager.jsx
import { useState } from 'react';

export const RouteManager = ({ routes, setRoutes }) => {
    const [newRoute, setNewRoute] = useState('');

    const addRoute = () => {
        if (newRoute.trim()) {
            setRoutes([...routes, { route: newRoute, configuration: {} }]);
            setNewRoute('');
        }
    };

    const updateRoute = (index, updatedRoute) => {
        const newRoutes = [...routes];
        newRoutes[index] = updatedRoute;
        setRoutes(newRoutes);
    };

    const removeRoute = (index) => {
        const newRoutes = routes.filter((_, i) => i !== index);
        setRoutes(newRoutes);
    };

    return (
        <div>
            <h3>Konfiguracja tras</h3>
            {routes.map((r, index) => (
                <div key={index}>
                    <input
                        type="text"
                        value={r.route}
                        onChange={e => updateRoute(index, { ...r, route: e.target.value })}
                        placeholder="Ścieżka, np. /kontakt"
                    />
                    <button onClick={() => removeRoute(index)}>Usuń</button>
                </div>
            ))}
            <input
                type="text"
                value={newRoute}
                onChange={e => setNewRoute(e.target.value)}
                placeholder="Nowa trasa"
            />
            <button onClick={addRoute}>Dodaj trasę</button>
        </div>
    );
};
