'use client';

import { useEffect, useRef } from 'react';

// Falling binary behind the hero; only rendered in dev mode.
export function BackgroundAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        class Particle {
            x: number;
            y: number;
            speed: number;
            opacity: number;
            stack: string[];
            scale: number;

            constructor() {
                this.x = Math.random() * canvas!.width;
                this.y = Math.random() * canvas!.height;
                this.speed = Math.random() * 2 + 1;
                this.opacity = 0;
                this.stack = [];
                this.scale = 14; // Font size

                // A vertical stack of 4-8 chars
                const stackSize = Math.floor(Math.random() * 5) + 4;
                for (let i = 0; i < stackSize; i++) {
                    this.stack.push(Math.random() < 0.5 ? '0' : '1');
                }
            }

            update() {
                this.y += this.speed;

                // Let the full stack fall off before resetting
                const height = this.stack.length * this.scale;
                if (this.y > canvas!.height + height) {
                    this.y = -height;
                    this.x = Math.random() * canvas!.width;
                }

                // Fade out towards the edges
                const dx = this.x - canvas!.width / 2;
                const dy = this.y - canvas!.height / 2;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxRadius = Math.min(canvas!.width, canvas!.height) * 0.5;
                const radialFactor = Math.pow(Math.max(0, 1 - distance / maxRadius), 1.5);
                this.opacity = 0.6 * radialFactor;

                // Random twinkle
                if (Math.random() > 0.9) {
                    const idx = Math.floor(Math.random() * this.stack.length);
                    this.stack[idx] = Math.random() < 0.5 ? '0' : '1';
                }
            }

            draw() {
                if (!ctx) return;
                ctx.font = `${this.scale}px monospace`;
                ctx.fillStyle = '#0f0';
                this.stack.forEach((char, i) => {
                    // Fade out the tail of the stack slightly
                    const stackOpacity = this.opacity * (1 - i / (this.stack.length + 1));
                    ctx.globalAlpha = Math.max(0, stackOpacity);
                    ctx.fillText(char, this.x, this.y - (i * this.scale));
                });
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push(new Particle());
            }
        };

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            initParticles();
        };

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
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
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
