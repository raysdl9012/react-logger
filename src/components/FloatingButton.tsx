import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLoggerContext } from '../context/LoggerContext';

/**
 * Draggable floating trigger button (Bug 🐞).
 * Displays unread counts and opens the main logging console.
 */
export const FloatingButton: React.FC = () => {
    const { state, setIsPanelOpen } = useLoggerContext();
    const [position, setPosition] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 80 });
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true;
        const touch = e.touches[0];
        dragOffset.current = {
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        };
    };

    const handleMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging.current) return;

        setPosition({
            x: Math.max(0, Math.min(window.innerWidth - 60, clientX - dragOffset.current.x)),
            y: Math.max(0, Math.min(window.innerHeight - 60, clientY - dragOffset.current.y))
        });
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
        const onEnd = () => (isDragging.current = false);

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchend', onEnd);
        };
    }, [handleMove]);

    const handleClick = () => {
        if (isDragging.current) return;
        setIsPanelOpen(true);
    };

    return (
        <div
            className="liql-floatingButton"
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
            aria-label="Open Logger"
        >
            🐞
            {state.unreadCount > 0 && (
                <div className="liql-badge">{state.unreadCount}</div>
            )}
        </div>
    );
};
