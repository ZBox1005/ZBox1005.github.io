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

        if (container.querySelector('#clstr_globe')) return;

        const script = document.createElement('script');
        script.id = 'clstr_globe';
        script.type = 'text/javascript';
        script.src = `//clustrmaps.com/globe.js?d=${dataId}`;
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
