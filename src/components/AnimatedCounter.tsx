import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Props { value: string; duration?: number; }

const AnimatedCounter = ({ value, duration = 1500 }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [display, setDisplay] = useState("0");

  const match = value.match(/^(\d+)(.*)$/);
  const num = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(num * eased) + suffix);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, num, suffix, duration]);

  return <span ref={ref}>{display}</span>;
};

export default AnimatedCounter;