// WCAG 2.2 · Canvas interactivo de constelación de partículas institucional
import { useEffect, useRef } from 'react';

export default function RedParticulas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animId;
    let ancho = (canvas.width = canvas.offsetWidth);
    let alto = (canvas.height = canvas.offsetHeight);

    const alRedimensionar = () => {
      ancho = canvas.width = canvas.offsetWidth;
      alto = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', alRedimensionar);

    const reduccionMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CANTIDAD = Math.min(45, Math.max(30, Math.floor((ancho * alto) / 18000)));
    const particulas = Array.from({ length: CANTIDAD }, () => ({
      x: Math.random() * ancho, y: Math.random() * alto,
      vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.5 + 1
    }));

    const dibujar = () => {
      ctx.clearRect(0, 0, ancho, alto);
      for (let i = 0; i < particulas.length; i += 1) {
        const p = particulas[i];
        if (!reduccionMovimiento) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = ancho; else if (p.x > ancho) p.x = 0;
          if (p.y < 0) p.y = alto; else if (p.y > alto) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();

        for (let j = i + 1; j < particulas.length; j += 1) {
          const p2 = particulas[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(147, 197, 253, ${0.28 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      if (!reduccionMovimiento) animId = window.requestAnimationFrame(dibujar);
    };

    dibujar();
    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', alRedimensionar);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none z-[5] ${className}`.trim()}
    />
  );
}
