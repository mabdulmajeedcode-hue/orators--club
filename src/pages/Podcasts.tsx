import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Loader2, ExternalLink, X, Download, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

const getYouTubeEmbedUrl = (url: string) => {
  try {
    const u = new URL(url);
    let videoId = "";
    if (u.hostname.includes("youtube.com")) videoId = u.searchParams.get("v") || "";
    else if (u.hostname.includes("youtu.be")) videoId = u.pathname.slice(1);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch { return null; }
};

const PodcastModal = ({ ep, onClose }: { ep: any; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEsc); };
  }, [onClose]);

  const embedUrl = ep.embed_url ? getYouTubeEmbedUrl(ep.embed_url) : null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        <button onClick={onClose} className="absolute top-3 right-3 z-20 rounded-full bg-background/80 p-2 text-foreground hover:bg-background transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          <div className="md:flex-1 flex-shrink-0">
            {embedUrl ? (
              <div className="w-full aspect-video">
                <iframe src={embedUrl} title={ep.title} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
              </div>
            ) : ep.image ? (
              <div className="h-56 sm:h-72 md:h-full">
                <img src={ep.image} alt={ep.title} className="w-full h-full object-cover" />
              </div>
            ) : null}
          </div>

          <div className="md:w-72 lg:w-80 border-t md:border-t-0 md:border-l border-border flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-5">
              <h2 className="font-display font-bold text-xl mb-3">{ep.title}</h2>
              {ep.description && (
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{ep.description}</p>
              )}
              {ep.embed_url && (
                <Button className="mt-5" size="sm" asChild>
                  <a href={ep.embed_url} target="_blank" rel="noopener noreferrer">
                    <Play className="h-4 w-4 mr-2" /> Watch on YouTube <ExternalLink className="h-3 w-3 ml-2" />
                  </a>
                </Button>
              )}
            </ScrollArea>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PodcastCard = ({ ep, i, onSelect }: { ep: any; i: number; onSelect: () => void }) => (
  <motion.div
    className="rounded-xl border border-border bg-card overflow-hidden card-hover shadow-sm cursor-pointer"
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.08 }}
    onClick={onSelect}
  >
    <div className="flex flex-col sm:flex-row">
      <div className="flex-1 p-6 flex flex-col justify-center order-2 sm:order-1">
        <h3 className="font-display font-semibold text-xl mb-2">{ep.title}</h3>
        {ep.description && (
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{ep.description}</p>
        )}
        {ep.embed_url && (
          <Button size="sm" className="w-fit" asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <a href={ep.embed_url} target="_blank" rel="noopener noreferrer">
              <Play className="h-4 w-4 mr-2" /> Watch on YouTube
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        )}
      </div>
      <div className="sm:w-64 md:w-80 h-48 sm:h-auto flex-shrink-0 order-1 sm:order-2">
        {ep.image ? (
          <img src={ep.image} alt={ep.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full min-h-[12rem] bg-secondary flex items-center justify-center">
            <Play className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const Podcasts = () => {
  const [selectedPodcast, setSelectedPodcast] = useState<any>(null);

  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ["podcasts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("podcasts")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Publications query
  const { data: publications = [], isLoading: loadingPubs } = useQuery({
    queryKey: ["publications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen pt-16">
      {/* Podcasts Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12">
            <h1 className="section-heading text-4xl md:text-5xl">
              Club <span className="gradient-text">Content</span>
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
              {podcasts.map((ep: any, i: number) => (
                <PodcastCard key={ep.id} ep={ep} i={i} onSelect={() => setSelectedPodcast(ep)} />
              ))}
            </div>
          )}

          <AnimatePresence>
            {selectedPodcast && <PodcastModal ep={selectedPodcast} onClose={() => setSelectedPodcast(null)} />}
          </AnimatePresence>
        </div>
      </section>

      {/* Newsletters & Publications Section */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="mb-12">
            <span className="section-badge mb-4 inline-block">Resources</span>
            <h2 className="section-heading text-3xl md:text-4xl">
              Newsletters & <span className="gradient-text">Publications</span>
            </h2>
            <p className="text-muted-foreground mt-2">Download our publications, newsletters, and reports.</p>
          </div>

          {loadingPubs ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : publications.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No publications yet. Stay tuned!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub: any, i: number) => (
                <motion.div
                  key={pub.id}
                  className="rounded-xl border border-border bg-background p-6 card-hover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-lg">{pub.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{pub.year} · {pub.file_type?.toUpperCase()}</p>
                      {pub.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pub.description}</p>
                      )}
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="sm" asChild>
                    <a href={pub.file_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </a>
                  </Button>
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
