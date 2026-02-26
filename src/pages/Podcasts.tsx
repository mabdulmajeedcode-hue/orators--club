import { motion } from "framer-motion";
import { Play, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Podcasts = () => {
  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ["podcasts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container">
          <div className="mb-12">
            <h1 className="section-heading text-4xl md:text-5xl">
              Club <span className="gradient-text">Voices</span>
            </h1>
            <p className="text-muted-foreground mt-2">Listen to the latest debates, speeches, and interviews.</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : podcasts.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No podcasts yet. Stay tuned!</p>
          ) : (
            <div className="space-y-6">
              {podcasts.map((ep, i) => (
                <motion.div
                  key={ep.id}
                  className="rounded-xl border border-border bg-card overflow-hidden card-hover shadow-sm"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Left: Text */}
                    <div className="flex-1 p-6 flex flex-col justify-center order-2 sm:order-1">
                      <h3 className="font-display font-semibold text-xl mb-2">{ep.title}</h3>
                      {ep.description && (
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{ep.description}</p>
                      )}
                      {ep.embed_url && (
                        <Button size="sm" className="w-fit" asChild>
                          <a
                            href={ep.embed_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Play className="h-4 w-4 mr-2" /> Watch on YouTube
                            <ExternalLink className="h-3 w-3 ml-2" />
                          </a>
                        </Button>
                      )}
                    </div>
                    {/* Right: Image */}
                    <div className="sm:w-64 md:w-80 h-48 sm:h-auto flex-shrink-0 order-1 sm:order-2">
                      {ep.image ? (
                        <img
                          src={ep.image}
                          alt={ep.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full min-h-[12rem] bg-secondary flex items-center justify-center">
                          <Play className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Podcasts;
