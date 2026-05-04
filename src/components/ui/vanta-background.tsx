import { useEffect, useRef, useState } from 'react';

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const update = () => setIsLight(document.documentElement.classList.contains('light'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadVanta = async () => {
      const THREE = await import('three');
      const VANTA = await import('vanta/dist/vanta.waves.min');
      if (!mounted || !vantaRef.current) return;
      vantaEffect.current = (VANTA as any).default({
        el: vantaRef.current,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x1a3d0a,
        shininess: 40,
        waveHeight: 12,
        waveSpeed: 0.6,
        zoom: 1.2,
      });
    };
    loadVanta();
    return () => {
      mounted = false;
      if (vantaEffect.current) {
        try { vantaEffect.current.destroy(); } catch {}
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isLight ? 0.15 : 0.35,
      }}
    />
  );
}
