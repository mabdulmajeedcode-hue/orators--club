import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const POPUP_SEEN_KEY = "popup_seen";

const SitePopup = () => {
  const [visible, setVisible] = useState(false);

  const { data: popup } = useQuery({
    queryKey: ["active-popup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popups")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!popup) return;
    const seen = localStorage.getItem(POPUP_SEEN_KEY);
    if (seen === popup.id) return;
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [popup]);

  const close = () => {
    setVisible(false);
    if (popup) localStorage.setItem(POPUP_SEEN_KEY, popup.id);
  };

  const handleCta = () => {
    close();
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [popup]);

  if (!popup) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={close} />
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            <button
              onClick={close}
              className="absolute top-3 right-3 z-20 rounded-full bg-background/80 p-1.5 text-foreground hover:bg-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {popup.image_url && (
              <img src={popup.image_url} alt={popup.title} className="w-full aspect-video object-cover" />
            )}

            <div className="p-6">
              <h3 className="font-display font-bold text-xl mb-2">{popup.title}</h3>
              {popup.description && (
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{popup.description}</p>
              )}
              {popup.cta_text && popup.cta_link && (
                <Button className="w-full" asChild onClick={handleCta}>
                  <a href={popup.cta_link} target="_blank" rel="noopener noreferrer">
                    {popup.cta_text}
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SitePopup;
