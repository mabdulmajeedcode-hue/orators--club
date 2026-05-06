import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Trophy, Mic, Users, Award, Calendar, Headphones, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ScrollSection from "@/components/ScrollSection";
import { GlowCard } from "@/components/ui/spotlight-card";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import Marquee from "@/components/Marquee";
import AnimatedCounter from "@/components/AnimatedCounter";
import heroTeam from "@/assets/hero-team.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6 } })
};

const features = [
  { icon: BookOpen, title: "Workshops", desc: "Weekly training sessions focused on rhetoric, logic, and delivery mechanics." },
  { icon: Trophy, title: "Competitions", desc: "Regional and national debate tournaments to test your skills against the best." },
  { icon: Users, title: "Community", desc: "A lifelong network of alumni, mentors, and peers who share your passion." },
  { icon: Mic, title: "Podcast Series", desc: "Listen to debates, speeches, and interviews from our club members." },
];

const stats = [
  { icon: Trophy, value: "50+", label: "Active Members" },
  { icon: Calendar, value: "200+", label: "Events Conducted" },
  { icon: Award, value: "12", label: "Major Wins" },
  { icon: Headphones, value: "9", label: "Annual Workshops" },
];

const Index = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribing(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already subscribed!", description: "This email is already on our list." });
        } else throw error;
      } else {
        toast({ title: "Subscribed!", description: "You'll receive updates from Orators Club." });
        setEmail("");
      }
    } catch {
      toast({ title: "Error", description: "Failed to subscribe. Try again.", variant: "destructive" });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Scroll Expansion Hero — title slides out as media expands */}
      <div className="relative">
        <ScrollExpandMedia
          mediaType="image"
          mediaSrc={heroTeam}
          bgImageSrc={heroTeam}
          title="ORATORS CLUB"
        >
          <div className="text-center max-w-3xl mx-auto">
            <span className="section-badge mb-4 inline-block">A Flagship of the Department of English, MJCET</span>
            <p className="text-base md:text-lg text-muted-foreground italic mb-6">
              "Empowering speakers with confidence, eloquence, and influence to drive positive change locally and globally"
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="pulse-glow" asChild>
                <a href="https://forms.gle/8CvC8bcG8fSY2t4p6" target="_blank" rel="noopener noreferrer">Join the Club <ArrowRight className="ml-2 h-4 w-4" /></a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/events">Explore Events</Link>
              </Button>
            </div>
          </div>
        </ScrollExpandMedia>
      </div>

      {/* Marquee strip */}
      <Marquee />

      {/* About / Mission */}
      <ScrollSection>
        <section className="py-24">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <img alt="Students in discussion" className="rounded-xl w-full aspect-[4/3] object-cover" src="/lovable-uploads/b8f2ab81-e795-4e5d-98f0-be01a5c4ae35.jpg" />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <span className="section-badge mb-4 inline-block">About Us</span>
                <h2 className="section-heading text-3xl md:text-4xl mb-4">Our <span className="gradient-text">Story</span></h2>
                <div className="w-12 h-1 bg-primary rounded mb-6" />
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Established in 2003 by the Department of English at MJCET and revived with fresh energy in 2009, the Orators' Club has grown into one of the most active and beloved student organisations on campus. It is a one-of-a-kind platform where engineering students step beyond equations and algorithms to master the art of expression — building oratory skill, communication finesse, and the soft skills that set leaders apart.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  From formal events like Debates, Group Discussions, Elocution, Essay Writing, Mock Interviews, and PowerPoint Presentations, to creative pursuits including Poster Making, Slogan Writing, Picture Perception, and Photography — the club offers something for every voice waiting to be heard.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Members don't just build language and reasoning skills; they cultivate creative thinking, leadership, and civic responsibility. With numerous awards at intercollegiate and state-level competitions, joining the Orators' Club is the first step toward conquering stage fear, breaking self-doubt, and preparing yourself for the professional world.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* Features */}
      <ScrollSection>
        <section className="py-24 bg-card-translucent">
          <div className="container">
            <div className="text-center mb-16">
              <span className="section-badge mb-4 inline-block">What We Do</span>
              <h2 className="section-heading text-3xl md:text-4xl">Core <span className="gradient-text">Features</span></h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <GlowCard glowColor="green" className="h-full bg-background p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <f.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* Stats */}
      <ScrollSection>
        <section className="py-24">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-1">
                    <AnimatedCounter value={s.value} />
                  </div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ScrollSection>

      {/* Newsletter */}
      <ScrollSection>
        <section className="py-24 bg-card-translucent">
          <div className="container max-w-2xl text-center">
            <span className="section-badge mb-4 inline-block">Stay Updated</span>
            <h2 className="section-heading text-3xl md:text-4xl mb-4">Join Our <span className="gradient-text">Newsletter</span></h2>
            <p className="text-muted-foreground mb-8">Get the latest updates on events, workshops, and club activities delivered to your inbox.</p>
            <form onSubmit={handleNewsletter} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={subscribing}>
                {subscribing ? "..." : <><Send className="h-4 w-4 mr-2" /> Subscribe</>}
              </Button>
            </form>
          </div>
        </section>
      </ScrollSection>

      {/* CTA */}
      <ScrollSection>
        <section className="py-24 bg-primary-translucent">
          <div className="container text-center">
            <h2 className="section-heading text-3xl md:text-5xl text-primary-foreground mb-4">Ready to Speak Up?</h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
              Join a community that values your voice. The podium is waiting for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="pulse-glow" asChild>
                <a href="https://forms.gle/8CvC8bcG8fSY2t4p6" target="_blank" rel="noopener noreferrer">Apply for Membership</a>
              </Button>
              <Button size="lg" variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </ScrollSection>
    </div>
  );
};

export default Index;
