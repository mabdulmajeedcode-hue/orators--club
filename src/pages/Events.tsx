import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = ["All Events", "Workshops", "Debates", "Guest Lectures"];

const eventsData = [
  { id: 1, title: "Annual Oratory Championship 2024", category: "Debates", date: "Oct 24", desc: "Battle it out with the sharpest minds in the college. This year's theme focuses on 'Ethics in the AI Era'.", slug: "annual-oratory-2024" },
  { id: 2, title: "Mastering Body Language", category: "Workshops", date: "Nov 05", desc: "A hands-on session on non-verbal communication techniques to command any stage with confidence.", slug: "body-language-workshop" },
  { id: 3, title: "Voices of Leadership", category: "Guest Lectures", date: "Nov 12", desc: "Join our distinguished alumni as they share their journey from the Orators' Club to global leadership roles.", slug: "voices-of-leadership" },
  { id: 4, title: "The Future of Media Ethics", category: "Debates", date: "Dec 01", desc: "A panel discussion featuring faculty and guest journalists exploring the impact of digital media.", slug: "media-ethics" },
  { id: 5, title: "Winter Mix & Mingle", category: "Workshops", date: "Dec 15", desc: "An informal networking session to meet fellow members and discuss upcoming club initiatives.", slug: "winter-networking" },
  { id: 6, title: "Persuasion Strategies", category: "Workshops", date: "Jan 10", desc: "Deep dive into the psychology of persuasion and how to influence your audience effectively.", slug: "persuasion-strategies" },
];

const Events = () => {
  const [filter, setFilter] = useState("All Events");

  const filtered = filter === "All Events" ? eventsData : eventsData.filter((e) => e.category === filter);

  return (
    <div className="min-h-screen pt-16">
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h1 className="section-heading text-4xl md:text-5xl">
                Upcoming <span className="gradient-text">Events</span>
              </h1>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Discover workshops, high-stakes debates, and guest lectures hosted by the premier voice of MJCET.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    filter === c
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                className="rounded-xl border border-border bg-card overflow-hidden card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <div className="relative h-48 bg-secondary flex items-center justify-center">
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold font-display">
                    {event.date}
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{event.category}</span>
                  <h3 className="font-display font-semibold text-lg mt-1 mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{event.desc}</p>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/join">Register Now <ArrowRight className="ml-2 h-3 w-3" /></Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
