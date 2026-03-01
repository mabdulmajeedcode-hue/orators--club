import { motion } from "framer-motion";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Gallery = () => {
  const { data: galleryEvents = [], isLoading } = useQuery({
    queryKey: ["gallery-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_events")
        .select("*, gallery_event_images(id)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-badge mb-4 inline-block">Gallery</span>
            <h1 className="section-heading text-4xl md:text-5xl">
              Moments That <span className="gradient-text">Matter</span>
            </h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : galleryEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No gallery items yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryEvents.map((ge: any, i: number) => (
                <motion.div
                  key={ge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link to={`/gallery/${ge.id}`} className="block">
                    <div className="rounded-xl border border-border bg-card overflow-hidden group card-hover">
                      <div className="aspect-video overflow-hidden bg-secondary">
                        {ge.cover_image ? (
                          <img src={ge.cover_image} alt={ge.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-display font-semibold text-lg">{ge.title}</h3>
                        {ge.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ge.description}</p>}
                        <p className="text-xs text-primary mt-2">{ge.gallery_event_images?.length || 0} photos</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
