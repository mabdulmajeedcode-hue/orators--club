import { useState } from "react";
import { motion } from "framer-motion";

const categories = ["All", "Events", "Workshops", "Competitions"];

const galleryItems = [
  { id: 1, category: "Events", caption: "Annual Debate Championship 2024" },
  { id: 2, category: "Workshops", caption: "Body Language Workshop" },
  { id: 3, category: "Competitions", caption: "Regional Finals Victory" },
  { id: 4, category: "Events", caption: "Guest Lecture Series" },
  { id: 5, category: "Workshops", caption: "Impromptu Speaking Session" },
  { id: 6, category: "Competitions", caption: "National Debate Qualifiers" },
  { id: 7, category: "Events", caption: "Club Anniversary Celebration" },
  { id: 8, category: "Workshops", caption: "Rhetoric Masterclass" },
];

const Gallery = () => {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? galleryItems : galleryItems.filter((g) => g.category === filter);

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

          <div className="flex justify-center gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filter === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-secondary border border-border card-hover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-sm font-medium">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
