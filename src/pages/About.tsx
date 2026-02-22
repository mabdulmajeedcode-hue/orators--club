import { motion } from "framer-motion";
import { Trophy, Calendar, Award, Users } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";
import missionImg from "@/assets/mission.jpg";

const stats = [
  { icon: Trophy, value: "50+", label: "Trophies Won" },
  { icon: Users, value: "200+", label: "Members" },
  { icon: Calendar, value: "12", label: "Countries Visited" },
  { icon: Award, value: "9", label: "Teams Active" },
];

const timeline = [
  { year: "2015", title: "Club Founded", desc: "Five passionate students gathered in a small library room with a vision to create a space for fearless self-expression." },
  { year: "2017", title: "First Regional Win", desc: "Just two years after founding, we secured our first major victory at the North Regional Debate Championship." },
  { year: "2019", title: "National Finalists", desc: "Competing against 50+ universities, our team reached the national finals, forging a standard of excellence." },
  { year: "2023", title: "Hosted State Championship", desc: "A milestone in leadership. We successfully hosted the largest State Championship in history, welcoming over 500 debaters." },
];

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutHero} alt="Speaker" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
        </div>
        <div className="container relative z-10 text-center">
          <span className="section-badge mb-4 inline-block">About Us</span>
          <h1 className="section-heading text-5xl md:text-7xl mb-4">
            Forging the <span className="gradient-text">Voices</span> of Tomorrow
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground">
            We are a collective of thinkers, speakers, and leaders dedicated to the art of persuasion. In a noisy world, we teach the discipline of being heard.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="container grid md:grid-cols-2 gap-16 items-center">
          <motion.img
            src={missionImg}
            alt="Discussion"
            className="rounded-xl w-full aspect-[4/3] object-cover"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-heading text-3xl md:text-4xl mb-2">Our <span className="gradient-text">Mission</span></h2>
            <div className="w-12 h-1 bg-primary rounded mb-6" />
            <blockquote className="text-lg italic text-foreground/80 mb-4 border-l-2 border-primary pl-4">
              "To cultivate critical thinking and articulate expression in the leaders of the future."
            </blockquote>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We believe that speech is not just about talking. It is about structuring thought, understanding opposition, and delivering truth with impact.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Through rigorous training and competitive discourse, we empower students to dismantle weak arguments and build stronger societies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-card">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <s.icon className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-4xl font-display font-bold gradient-text mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* History */}
      <section className="py-24">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="section-heading text-3xl md:text-4xl">Our <span className="gradient-text">History</span></h2>
            <p className="text-muted-foreground mt-2">A legacy of voice and victory.</p>
          </div>
          <div className="space-y-12">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className="flex gap-6"
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="font-display font-bold text-primary text-sm">{item.year}</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-xl mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
