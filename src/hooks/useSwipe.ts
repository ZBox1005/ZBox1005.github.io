import { useRef, type TouchEvent } from 'react';

/**
 * Touch-swipe left/right on a card to step a carousel: `onSwipe(1)` for a leftward
 * swipe (next), `onSwipe(-1)` for a rightward one (previous).
 *
 * Spread the returned handlers on the swipe area and give it `touch-pan-y`, so the
 * browser keeps vertical scrolling for itself and hands horizontal drags to us. A drag
 * that is mostly vertical is ignored. Browsers do not fire `click` after a touch that
 * moved, so swiping across a link never opens it.
 */
export function useSwipe(onSwipe: (step: 1 | -1) => void, threshold = 40) {
    const origin = useRef<{ x: number; y: number } | null>(null);

    return {
        onTouchStart: (event: TouchEvent) => {
            const touch = event.touches[0];
            origin.current = { x: touch.clientX, y: touch.clientY };
        },
        onTouchEnd: (event: TouchEvent) => {
            const start = origin.current;
            origin.current = null;
            if (!start) return;

            const touch = event.changedTouches[0];
            const dx = touch.clientX - start.x;
            const dy = touch.clientY - start.y;
            if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return;

            onSwipe(dx < 0 ? 1 : -1);
        },
        onTouchCancel: () => {
            origin.current = null;
        },
    };
}
