import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
}

const ScrollSection = ({ children, className }: ScrollSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

export default ScrollSection;
