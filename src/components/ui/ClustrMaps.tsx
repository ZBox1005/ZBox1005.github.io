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
        <div className="rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3 hover:shadow-lg transition-all duration-200">
            <h3 className="font-semibold text-primary mb-2 text-center text-sm">Visitors</h3>
            <div
                ref={containerRef}
                className="flex items-center justify-center min-h-[200px] [&_canvas]:mx-auto"
            />
        </div>
    );
}
