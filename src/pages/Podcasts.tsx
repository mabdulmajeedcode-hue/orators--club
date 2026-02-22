import { motion } from "framer-motion";
import { Play, Clock } from "lucide-react";

const episodes = [
  { id: 1, num: 4, title: "The Art of Debate", desc: "Exploring the nuances of competitive debating with the club president.", date: "Nov 15, 2024", duration: "45m", tags: ["Debate", "Skills"] },
  { id: 2, num: 3, title: "Public Speaking 101", desc: "Overcoming stage fright and delivering impactful speeches.", date: "Oct 28, 2024", duration: "32m", tags: ["Workshop", "Tips"] },
  { id: 3, num: 2, title: "Special Guest Series", desc: "Featuring alumni who have mastered the art of persuasion in business.", date: "Oct 10, 2024", duration: "28m", tags: ["Alumni", "Business"] },
  { id: 4, num: 1, title: "Literary Analysis & Rhetoric", desc: "Deep diving into classical rhetoric and its relevance today.", date: "Sep 22, 2024", duration: "61m", tags: ["Literature", "Philosophy"] },
];

const Podcasts = () => {
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

          {/* Featured Episode */}
          <motion.div
            className="rounded-xl border border-border bg-card p-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="section-badge mb-4 inline-block">Featured Episode</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Ep. {episodes[0].num}: {episodes[0].title}
                </h2>
                <p className="text-muted-foreground mb-6">{episodes[0].desc}</p>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                    <Play className="h-4 w-4" /> Listen Now
                  </button>
                </div>
              </div>
              <div className="h-48 md:h-64 rounded-lg bg-secondary/50 border border-border flex items-center justify-center">
                <div className="flex items-end gap-1 h-32">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-primary/60 rounded-t"
                      style={{ height: `${Math.random() * 100 + 10}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Episodes List */}
          <h2 className="font-display text-2xl font-bold mb-6">Recent Episodes</h2>
          <div className="space-y-4">
            {episodes.map((ep, i) => (
              <motion.div
                key={ep.id}
                className="rounded-xl border border-border bg-card p-5 flex items-center gap-5 card-hover"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <button className="flex-shrink-0 h-12 w-12 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Play className="h-5 w-5 text-primary" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <span className="text-primary font-mono font-semibold">EP. {ep.num}</span>
                    <span>{ep.date}</span>
                  </div>
                  <h3 className="font-display font-semibold truncate">{ep.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{ep.desc}</p>
                </div>
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  {ep.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded border border-border text-xs text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  {ep.duration}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Podcasts;
