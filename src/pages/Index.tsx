import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Trophy, Mic, Users, Award, Calendar, Headphones, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import missionImg from "@/assets/mission.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } })
};

const features = [
{ icon: BookOpen, title: "Workshops", desc: "Weekly training sessions focused on rhetoric, logic, and delivery mechanics." },
{ icon: Trophy, title: "Competitions", desc: "Regional and national debate tournaments to test your skills against the best." },
{ icon: Users, title: "Community", desc: "A lifelong network of alumni, mentors, and peers who share your passion." },
{ icon: Mic, title: "Podcast Series", desc: "Listen to debates, speeches, and interviews from our club members." }];


const stats = [
{ icon: Trophy, value: "50+", label: "Active Members" },
{ icon: Calendar, value: "200+", label: "Events Conducted" },
{ icon: Award, value: "12", label: "Major Wins" },
{ icon: Headphones, value: "9", label: "Annual Workshops" }];


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
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Speaker at podium" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="container relative z-10 text-center py-32">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="section-badge mb-6 inline-block">A FLAGSHIP OF DEPARTMENT OF ENGLISH, MJCET</span>
          </motion.div>
          <motion.h1
            className="section-heading text-5xl md:text-7xl lg:text-8xl mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}>

            ORATORS'{" "}
            <span className="gradient-text">CLUB</span>
          </motion.h1>
          <motion.p
            className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}>Orators Club is the premier public speaking and debate society of MJCET, 
Empowering speakers with confidence, eloquence, and influence to drive positive change locally and globally.

          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}>

            <Button size="lg" asChild>
              <Link to="/join">Join the Club <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/events">Explore Events</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <img alt="Students in discussion" className="rounded-xl w-full aspect-[4/3] object-cover" src="/lovable-uploads/b8f2ab81-e795-4e5d-98f0-be01a5c4ae35.jpg" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="section-badge mb-4 inline-block">About Us</span>
              <h2 className="section-heading text-3xl md:text-4xl mb-4">Our <span className="gradient-text">Mission</span></h2>
              <div className="w-12 h-1 bg-primary rounded mb-6" />
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Orators Club empowers students to master the art of persuasion, structured argumentation, and impactful communication.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through debates, workshops, podcasts, and competitions, we nurture confident leaders prepared to engage with the world intellectually and ethically.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card">
        <div className="container">
          <div className="text-center mb-16">
            <span className="section-badge mb-4 inline-block">What We Do</span>
            <h2 className="section-heading text-3xl md:text-4xl">Core <span className="gradient-text">Features</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) =>
            <motion.div
              key={f.title}
              className="p-6 rounded-xl border border-border bg-background card-hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}>

                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) =>
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}>

                <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-card">
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
              className="flex-1" />

            <Button type="submit" disabled={subscribing}>
              {subscribing ? "..." : <><Send className="h-4 w-4 mr-2" /> Subscribe</>}
            </Button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container text-center">
          <h2 className="section-heading text-3xl md:text-5xl text-primary-foreground mb-4">Ready to Speak Up?</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            Join a community that values your voice. The podium is waiting for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/join">Apply for Membership</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-foreground/30 text-foreground hover:bg-foreground/10" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>);

};

export default Index;