import { motion } from "framer-motion";
import { Loader2, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GalleryDetail = () => {
  const { id } = useParams<{ id: string }>();

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
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const isLoading = loadingEvent || loadingImages;

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
              </div>

              {images.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No images in this gallery yet.</p>
              ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {images.map((img: any, i: number) => (
                    <motion.div
                      key={img.id}
                      className="group relative rounded-xl overflow-hidden bg-secondary border border-border break-inside-avoid"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <img src={img.image_url} alt={img.caption || ""} className="w-full h-auto object-contain" />
                      {img.caption && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4">
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
    </div>
  );
};

export default GalleryDetail;
