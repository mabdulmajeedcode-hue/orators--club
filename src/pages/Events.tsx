import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const categories = ["All Events", "Workshops", "Debates", "Guest Lectures"];

const Events = () => {
  const [filter, setFilter] = useState("All Events");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = filter === "All Events" ? events : events.filter((e) => e.category === filter);

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

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No events found. Check back soon!</p>
          ) : (
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
                    {event.image && (
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold font-display">
                      {format(new Date(event.date), "MMM dd")}
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">{event.category}</span>
                    <h3 className="font-display font-semibold text-lg mt-1 mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{event.description}</p>
                    <Button size="sm" className="w-full" asChild>
                      <Link to="/join">Register Now <ArrowRight className="ml-2 h-3 w-3" /></Link>
                    </Button>
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

export default Events;
