import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !vantaRef.current) return;
      if (!window.VANTA || !window.THREE) {
        setTimeout(init, 100);
        return;
      }
      if (vantaEffect.current) vantaEffect.current.destroy();
      vantaEffect.current = window.VANTA.WAVES({
        el: vantaRef.current,
        THREE: window.THREE,
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
        zoom: 1.63,
      });
    };
    init();
    return () => {
      cancelled = true;
      if (vantaEffect.current) {
        try { vantaEffect.current.destroy(); } catch {}
        vantaEffect.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      className="vanta-bg"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}