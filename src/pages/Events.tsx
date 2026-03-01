import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const tabs = ["All Events", "Upcoming", "Past"];

const EventCard = ({ event, i }: { event: any; i: number }) => {
  const [expanded, setExpanded] = useState(false);
  const upcoming = event.status === "upcoming";

  return (
    <motion.div
      className="rounded-xl border border-border bg-card overflow-hidden card-hover cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05, duration: 0.4 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="relative h-48 bg-secondary flex items-center justify-center">
        {event.image && (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-bold font-display">
          {format(new Date(event.date), "MMM dd")}
        </div>
        {!upcoming && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" /> Concluded
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">{event.category}</span>
        <h3 className="font-display font-semibold text-lg mt-1 mb-2">{event.title}</h3>
        <p className={`text-sm text-muted-foreground mb-4 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>{event.description}</p>

        <AnimatePresence>
          {expanded && event.description && event.description.length > 150 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between">
          {upcoming ? (
            event.registration_link ? (
              <Button size="sm" asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <a href={event.registration_link} target="_blank" rel="noopener noreferrer">
                  Register Now <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              </Button>
            ) : <span />
          ) : (
            <Badge variant="outline" className="py-2 text-muted-foreground">
              <CheckCircle className="h-3 w-3 mr-1" /> Event Concluded
            </Badge>
          )}
          <button className="text-muted-foreground hover:text-foreground transition-colors p-1" onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Events = () => {
  const [activeTab, setActiveTab] = useState("All Events");

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("display_order", { ascending: true })
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = events.filter((e: any) => {
    if (activeTab === "All Events") return true;
    const status = e.status || "upcoming";
    if (activeTab === "Upcoming") return status === "upcoming";
    if (activeTab === "Past") return status === "past";
    return true;
  });

  const externalEvents = filtered.filter((e: any) => (e.event_type || "external") === "external");
  const internalEvents = filtered.filter((e: any) => e.event_type === "internal");

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
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    activeTab === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {t}
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {externalEvents.length > 0 && (
                  <div className="mb-16">
                    <h2 className="font-display text-2xl font-bold mb-2">External Events</h2>
                    <div className="w-16 h-0.5 bg-primary mb-8" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {externalEvents.map((event: any, i: number) => (
                        <EventCard key={event.id} event={event} i={i} />
                      ))}
                    </div>
                  </div>
                )}
                {internalEvents.length > 0 && (
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-2">Internal Events</h2>
                    <div className="w-16 h-0.5 bg-primary mb-8" />
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {internalEvents.map((event: any, i: number) => (
                        <EventCard key={event.id} event={event} i={i} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
