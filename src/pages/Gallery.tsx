import { useState } from "react";
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
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Extract unique years and sort descending; null years go at end
  const years = Array.from(new Set(galleryEvents.map((ge: any) => ge.year).filter(Boolean))).sort((a: number, b: number) => b - a);
  const [activeYear, setActiveYear] = useState<number | "all">("all");

  // Default to most recent year when data loads
  const effectiveYear = activeYear === "all" && years.length > 0 ? years[0] : activeYear;

  const filtered = effectiveYear === "all"
    ? galleryEvents
    : galleryEvents.filter((ge: any) => ge.year === effectiveYear);

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

          {/* Year-wise filter tabs */}
          {years.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              <button
                onClick={() => setActiveYear("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  activeYear === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                All Years
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y as number)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    effectiveYear === y
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No gallery items yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((ge: any, i: number) => (
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
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-primary">{ge.gallery_event_images?.length || 0} photos</p>
                          {ge.year && <p className="text-xs text-muted-foreground">{ge.year}</p>}
                        </div>
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
