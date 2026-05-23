'use client';

import { useEffect, useRef } from 'react';

interface ClustrMapsProps {
    dataId: string;
}

export default function ClustrMaps({ dataId }: ClustrMapsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Reset to a clean container — on SPA back-navigation the same component
        // re-mounts with stale DOM that globe.js will not redraw on top of.
        container.innerHTML = '';

        // Cache-bust the script URL so re-mounts trigger a fresh execution.
        // Without this, the browser may skip re-running an already-loaded script
        // and globe.js never injects the widget into the new container.
        const script = document.createElement('script');
        script.id = 'clstr_globe';
        script.type = 'text/javascript';
        script.src = `https://clustrmaps.com/globe.js?d=${dataId}&_t=${Date.now()}`;
        container.appendChild(script);

        return () => {
            container.innerHTML = '';
        };
    }, [dataId]);

    return (
        <div
            ref={containerRef}
            className="mx-auto w-44 [&_canvas]:mx-auto [&_canvas]:block"
        />
    );
}
