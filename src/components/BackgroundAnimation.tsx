'use client';

import { useEffect, useRef } from 'react';
import { useMantineColorScheme } from '@mantine/core';

interface BackgroundAnimationProps {
    devMode: boolean;
}

const iconPaths: Record<string, string[]> = {
    "IconCode": ["M7 8l-4 4l4 4", "M17 8l4 4l-4 4", "M14 4l-4 16"],
    "IconCar": ["M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", "M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5"],
    "IconHammer": ["M11.414 10l-7.383 7.418a2.091 2.091 0 0 0 0 2.967a2.11 2.11 0 0 0 2.976 0l7.407 -7.385", "M18.121 15.293l2.586 -2.586a1 1 0 0 0 0 -1.414l-7.586 -7.586a1 1 0 0 0 -1.414 0l-2.586 2.586a1 1 0 0 0 0 1.414l7.586 7.586a1 1 0 0 0 1.414 0"],
    "IconHome2": ["M5 12l-2 0l9 -9l9 9l-2 0", "M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7", "M10 12h4v4h-4l0 -4"],
    "IconDeviceDesktop": ["M3 5a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-10", "M7 20h10", "M9 16v4", "M15 16v4"],
    "IconServer": ["M3 7a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3", "M3 15a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3l0 -2", "M7 8l0 .01", "M7 16l0 .01"],
};

export function BackgroundAnimation({ devMode }: BackgroundAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { colorScheme } = useMantineColorScheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            speed: number;
            opacity: number;
            char: string; // For normal icons
            stack: string[]; // For matrix mode
            paths: Path2D[] | null;
            scale: number;
            type: 'matrix' | 'icon';

            constructor(type: 'matrix' | 'icon') {
                this.type = type;
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                // Slow down matrix speed (was 2-7, now 1-3)
                this.speed = type === 'matrix' ? Math.random() * 2 + 1 : Math.random() * 1.5 + 0.5;
                this.opacity = 0;
                this.stack = [];
                this.char = '';

                // Settings based on type
                if (type === 'matrix') {
                    // Create a vertical stack of 4-8 chars
                    const stackSize = Math.floor(Math.random() * 5) + 4; // 4 to 8
                    for (let i = 0; i < stackSize; i++) {
                        this.stack.push(Math.random() < 0.5 ? '0' : '1');
                    }
                    this.paths = null;
                    this.scale = 14; // FontSize for matrix
                } else {
                    const keys = Object.keys(iconPaths);
                    const randomIcon = keys[Math.floor(Math.random() * keys.length)];
                    this.paths = iconPaths[randomIcon].map(p => new Path2D(p));
                    this.scale = 0.8; // Scale factor for icons (smaller)
                }
            }

            update() {
                this.y += this.speed;

                // Reset if off bottom
                // Allow full stack to fall off before resetting
                const height = this.type === 'matrix' ? this.stack.length * this.scale : 50;
                if (this.y > canvas!.height + height) {
                    this.y = -height;
                    this.x = Math.random() * canvas!.width;
                }

                // Radial Fade Logic
                const centerX = canvas!.width / 2;
                const centerY = canvas!.height / 2;
                const dx = this.x - centerX;
                const dy = this.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                const maxRadius = Math.min(canvas!.width, canvas!.height) * 0.5;

                // Calculate base opacity based on radial distance
                let radialFactor = 1 - (distance / maxRadius);
                if (radialFactor < 0) radialFactor = 0;

                radialFactor = Math.pow(radialFactor, 1.5);

                // Max opacity
                const maxOpacity = this.type === 'matrix' ? 0.6 : 0.25;
                this.opacity = maxOpacity * radialFactor;

                // Random twinkle for matrix stack
                if (this.type === 'matrix') {
                    if (Math.random() > 0.9) {
                        // Change one random char in the stack
                        const idx = Math.floor(Math.random() * this.stack.length);
                        this.stack[idx] = Math.random() < 0.5 ? '0' : '1';
                    }
                }
            }

            draw() {
                if (!ctx) return;

                if (this.type === 'matrix') {
                    ctx.font = `${this.scale}px monospace`;
                    ctx.fillStyle = '#0f0';

                    // Draw stack
                    this.stack.forEach((char, i) => {
                        // Fade out the tail of the stack slightly
                        const stackOpacity = this.opacity * (1 - i / (this.stack.length + 1));
                        ctx.globalAlpha = Math.max(0, stackOpacity);
                        ctx.fillText(char, this.x, this.y - (i * this.scale));
                    });

                } else if (this.paths) {
                    ctx.save();
                    ctx.translate(this.x, this.y);
                    ctx.scale(this.scale, this.scale);
                    ctx.globalAlpha = this.opacity;
                    ctx.fillStyle = colorScheme === 'dark' ? '#fff' : '#000';
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = colorScheme === 'dark' ? '#fff' : '#000';

                    this.paths.forEach(p => {
                        ctx.stroke(p);
                    });

                    ctx.restore();
                }
            }
        }

        const initParticles = () => {
            particles = [];
            // Reduce count for matrix since we have stacks now
            const count = devMode ? 100 : 60;
            const type = devMode ? 'matrix' : 'icon';
            for (let i = 0; i < count; i++) {
                particles.push(new Particle(type));
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        render();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [devMode, colorScheme]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
