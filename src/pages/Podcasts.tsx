import { motion } from "framer-motion";
import { Play, Clock, Loader2 } from "lucide-react";
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
            <>
              {/* Featured Episode */}
              <motion.div
                className="rounded-xl border border-border bg-card p-8 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="section-badge mb-4 inline-block">Featured Episode</span>
                    <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{podcasts[0].title}</h2>
                    <p className="text-muted-foreground mb-6">{podcasts[0].description}</p>
                    {podcasts[0].embed_url && (
                      <a
                        href={podcasts[0].embed_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors w-fit"
                      >
                        <Play className="h-4 w-4" /> Listen Now
                      </a>
                    )}
                  </div>
                  <div className="h-48 md:h-64 rounded-lg overflow-hidden bg-secondary/50 border border-border">
                    {podcasts[0].embed_url ? (
                      <iframe
                        src={podcasts[0].embed_url}
                        width="100%"
                        height="100%"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title={podcasts[0].title}
                      />
                    ) : (
                      <div className="flex items-end gap-1 h-full justify-center pb-4">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 bg-primary/60 rounded-t"
                            style={{ height: `${Math.random() * 100 + 10}%` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Episodes List */}
              {podcasts.length > 1 && (
                <>
                  <h2 className="font-display text-2xl font-bold mb-6">Recent Episodes</h2>
                  <div className="space-y-4">
                    {podcasts.slice(1).map((ep, i) => (
                      <motion.div
                        key={ep.id}
                        className="rounded-xl border border-border bg-card p-5 flex items-center gap-5 card-hover"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <a
                          href={ep.embed_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                        >
                          <Play className="h-5 w-5 text-primary" />
                        </a>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold truncate">{ep.title}</h3>
                          <p className="text-sm text-muted-foreground truncate">{ep.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Podcasts;
