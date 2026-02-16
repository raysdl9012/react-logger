/**
 * @license
 * Copyright (c) 2026 Reinner Steven Daza Leiva
 * Contact: https://reivium.com/
 * 
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLoggerContext } from '../context/LoggerContext';

/**
 * Draggable floating trigger button.
 * Uses hybrid positioning (CSS initial + JS drag) for maximum compatibility.
 */
export const FloatingButton: React.FC = () => {
    const { state, setIsPanelOpen } = useLoggerContext();

    // Default to null to use CSS positioning initially
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        isDragging.current = true;
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        isDragging.current = true;
        const touch = e.touches[0];
        dragOffset.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    };

    const handleMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging.current) return;

        // Keep button within viewport
        const nextX = Math.max(10, Math.min(window.innerWidth - 60, clientX - dragOffset.current.x));
        const nextY = Math.max(10, Math.min(window.innerHeight - 60, clientY - dragOffset.current.y));

        setPosition({ x: nextX, y: nextY });
    }, []);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
        const onEnd = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchend', onEnd);
        };
    }, [handleMove]);

    // Handle window resize to keep button in bounds
    useEffect(() => {
        const handleResize = () => {
            if (position) {
                setPosition(prev => {
                    if (!prev) return null;
                    return {
                        x: Math.min(prev.x, window.innerWidth - 60),
                        y: Math.min(prev.y, window.innerHeight - 60)
                    };
                });
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [position]);

    const handleClick = () => {
        if (isDragging.current) return;
        setIsPanelOpen(true);
    };

    // If never moved, let CSS handle it. If moved, use absolute pixel coordinates.
    const dynamicStyle: React.CSSProperties = position
        ? { left: `${position.x}px`, top: `${position.y}px`, right: 'auto', bottom: 'auto' }
        : {};

    return (
        <div
            className="liql-floatingButton"
            style={dynamicStyle}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
            aria-label="Open Logger"
        >
            {state.unreadCount > 0 && (
                <div className="liql-badge">{state.unreadCount}</div>
            )}
        </div>
    );
};
