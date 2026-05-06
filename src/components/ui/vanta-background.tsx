import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

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
        color: 0x1e6103,
        shininess: 68,
        waveHeight: 15,
        waveSpeed: 1,
        zoom: 1.6,
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
        opacity: isLight ? 0.2 : 0.5,
      }}
    />
  );
}
