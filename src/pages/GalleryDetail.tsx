import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// ---- Lightbox Component ----
const Lightbox = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: any[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const img = images[currentIndex];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-card/80 p-2 text-foreground hover:bg-card transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 z-10 text-sm text-muted-foreground bg-card/80 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card/80 p-3 text-foreground hover:bg-card transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-card/80 p-3 text-foreground hover:bg-card transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={currentIndex}
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={img.image_url}
          alt={img.caption || ""}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        {img.caption && (
          <p className="mt-3 text-sm text-muted-foreground text-center max-w-md">{img.caption}</p>
        )}
      </motion.div>
    </motion.div>
  );
};

const GalleryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: galleryEvent, isLoading: loadingEvent } = useQuery({
    queryKey: ["gallery-event", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_events")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: images = [], isLoading: loadingImages } = useQuery({
    queryKey: ["gallery-event-images", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_event_images")
        .select("*")
        .eq("gallery_event_id", id!)
        .order("image_order", { ascending: true })
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const isLoading = loadingEvent || loadingImages;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  const nextImage = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container">
          <Button variant="ghost" className="mb-6" asChild>
            <Link to="/gallery"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Gallery</Link>
          </Button>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !galleryEvent ? (
            <p className="text-center text-muted-foreground py-20">Gallery not found.</p>
          ) : (
            <>
              <div className="mb-10">
                <h1 className="section-heading text-3xl md:text-4xl">{galleryEvent.title}</h1>
                {galleryEvent.description && (
                  <p className="text-muted-foreground mt-2 max-w-2xl">{galleryEvent.description}</p>
                )}
                <p className="text-sm text-primary mt-2">{images.length} photos</p>
              </div>

              {images.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No images in this gallery yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((img: any, i: number) => (
                    <motion.div
                      key={img.id}
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary border border-border cursor-pointer"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => openLightbox(i)}
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption || ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300" />
                      {img.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                          <p className="text-sm font-medium">{img.caption}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryDetail;
