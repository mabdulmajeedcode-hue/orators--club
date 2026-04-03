import { motion } from "framer-motion";
import { CheckCircle, MessageSquare, Mic, PenTool, Briefcase, Camera, Globe, BookOpen, Palette, Users, Award } from "lucide-react";
import aboutHero from "@/assets/about-hero.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const timelineData = [
  { year: "2003", desc: "Orators' Club founded under the Department of English, MJCET" },
  { year: "2009", desc: "Club revived with renewed energy and expanded activities" },
  { year: "2013", desc: "First major events including Clash of Titans and Extempore competitions" },
  { year: "2015", desc: "ORATORIA literary fest launched — a flagship annual event is born" },
  { year: "2016", desc: "ADSOPHOS participation begins — Orators' Club enters the technical fest stage" },
  { year: "2017", desc: "Spectrum sub-chapter launched — creative arts given a dedicated platform" },
  { year: "2018", desc: "MJ MUN held for the first time — members win Best Delegate at ICFAI MUN" },
  { year: "2019", desc: "Speakers Showdown — a three-day inter-college language and oratory fest" },
  { year: "2021", desc: "Vestige published — a collection of short stories and poems by members" },
  { year: "2022", desc: "Coffee Table Book and Poetry & Photography Collection released" },
];

const whatWeDoCards = [
  { icon: MessageSquare, title: "Debates & Group Discussions", desc: "Structured argumentation and collaborative dialogue" },
  { icon: Mic, title: "Public Speaking & Elocution", desc: "Build stage presence and confident articulation" },
  { icon: PenTool, title: "Essay & Creative Writing", desc: "Develop written expression and analytical thinking" },
  { icon: Briefcase, title: "Mock Interviews", desc: "Real-world professional preparation" },
  { icon: Camera, title: "Poster Making & Photography", desc: "Creative visual storytelling and design" },
  { icon: Globe, title: "MJ MUN", desc: "Model United Nations and diplomatic discourse" },
];

const flagshipCards = [
  { name: "ADSOPHOS", desc: "Annual participation in MJCET's technical fest" },
  { name: "ORATORIA", desc: "Our signature literary festival" },
  { name: "Spectrum", desc: "Creative arts — visual arts, calligraphy, Human Library" },
  { name: "MJ MUN", desc: "Intercollegiate diplomacy and debate" },
];

const publicationCards = [
  { title: "Vestige", desc: "A collection of short stories and poems by club members" },
  { title: "Coffee Table Book", desc: "A curated visual and literary collection" },
  { title: "Poetry & Photography", desc: "An anthology celebrating creativity" },
];

const subChapters = [
  { name: "Spectrum", desc: "A creative arts platform where students explore visual arts, calligraphy, T-shirt design, and the Human Library concept — celebrating creativity in all its forms." },
  { name: "Speakers' Forum", desc: "A regular platform for public speaking practice and peer feedback, providing a safe space to grow confidence and refine delivery." },
  { name: "Book Club", desc: "Regular gatherings to discuss literature, authors, and ideas — fostering a deeper love for the written word and intellectual discourse." },
];

const credentials = [
  "NAAC Accredited — A+",
  "NBA Accredited",
  "Affiliated to Osmania University",
  "Approved by AICTE",
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">{children}</h2>
    <div className="w-16 h-1 bg-primary rounded" />
  </div>
);

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
          <h1 className="section-heading text-6xl md:text-8xl lg:text-9xl mb-4">
            The <span className="gradient-text">Orators'</span> Club
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground">
            A legacy of voice, vision, and victory — since 2003.
          </p>
        </div>
      </section>

      {/* 1. About the Club */}
      <section className="py-20">
        <div className="container max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeading>About the <span className="gradient-text">Club</span></SectionHeading>
            <div className="grid md:grid-cols-5 gap-10 items-start">
              <div className="md:col-span-3 space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                <p>
                  Orators' Club was founded in 2003 under the Department of English at Muffakham Jah College of Engineering and Technology (MJCET), part of the Sultan-Ul-Uloom Education Society. An autonomous institution accredited by NAAC with A+ and NBA, affiliated to Osmania University and approved by AICTE, MJCET is one of Hyderabad's most respected engineering colleges.
                </p>
                <p>
                  After a revival in 2009, the club has grown into one of the most active student organisations on campus — bridging the gap between technical education and communication excellence. What began as a small initiative has blossomed into a vibrant community of thinkers, speakers, and future leaders.
                </p>
              </div>
              <div className="md:col-span-2">
                <div className="rounded-xl border border-border bg-card p-6 border-l-4 border-l-primary">
                  <h3 className="font-display font-semibold text-lg mb-4 text-foreground">Credentials</h3>
                  <ul className="space-y-3">
                    {credentials.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Department of English — moved up per reorder */}
      <section className="py-20 bg-card">
        <div className="container max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeading>About the <span className="gradient-text">Department of English</span></SectionHeading>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className="rounded-xl border border-border bg-secondary/30 aspect-[4/3] flex items-center justify-center">
                <span className="text-muted-foreground text-sm italic">Add Department photo here</span>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
                <p>
                  The Department of English at MJCET is committed to developing well-rounded graduates. With experienced and widely published faculty, the department focuses not only on language proficiency but on inspiring students to lead ethical, fulfilling lives with strong personal accountability.
                </p>
                <p>
                  Faculty members actively mentor students through the Orators' Club and have contributed significantly to research and academic publications, making the department a cornerstone of holistic education at MJCET.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Our History — vertical timeline */}
      <section className="py-24">
        <div className="container max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeading>Our <span className="gradient-text">History</span></SectionHeading>
          </motion.div>
          <div className="relative mt-12">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:hidden" />
            <div className="space-y-12 md:space-y-16">
              {timelineData.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                  >
                    <div className="hidden md:grid md:grid-cols-2 gap-8 items-center">
                      {isLeft ? (
                        <>
                          <div className="text-right pr-8">
                            <span className="font-display text-3xl font-bold text-primary">{item.year}</span>
                            <p className="text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                          </div>
                          <div />
                        </>
                      ) : (
                        <>
                          <div />
                          <div className="pl-8">
                            <span className="font-display text-3xl font-bold text-primary">{item.year}</span>
                            <p className="text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="hidden md:block absolute left-1/2 top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                    <div className="md:hidden pl-12 relative">
                      <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-primary border-[3px] border-background" />
                      <span className="font-display text-xl font-bold text-primary">{item.year}</span>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. What We Do */}
      <section className="py-20 bg-card">
        <div className="container max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeading>What We <span className="gradient-text">Do</span></SectionHeading>
            <p className="text-muted-foreground text-lg mb-10 -mt-6 italic">From the stage to the page — we do it all.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatWeDoCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="p-6 rounded-xl border border-border bg-background border-t-4 border-t-primary flex flex-col">
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-display font-semibold text-foreground mb-2">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. Flagship Programmes */}
      <section className="py-20">
        <div className="container max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeading>Flagship <span className="gradient-text">Programmes</span></SectionHeading>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flagshipCards.map((card) => (
                <div key={card.name} className="p-6 rounded-xl border border-border bg-card border-l-4 border-l-primary flex flex-col">
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{card.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. Publications & Achievements */}
      <section className="py-20 bg-primary/10">
        <div className="container max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeading>Publications & <span className="gradient-text">Achievements</span></SectionHeading>
            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              {publicationCards.map((card) => (
                <div key={card.title} className="p-6 rounded-xl border border-primary/30 bg-card border-t-4 border-t-primary">
                  <Award className="h-7 w-7 text-primary mb-3" />
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground italic max-w-3xl mx-auto leading-relaxed">
              Members have won awards at intercollegiate and state-level competitions, including Best Delegate honours at MUN events — a testament to the club's commitment to nurturing excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 7. Sub-Chapters */}
      <section className="py-20 bg-card">
        <div className="container max-w-6xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionHeading>Sub-<span className="gradient-text">Chapters</span></SectionHeading>
            <div className="grid md:grid-cols-3 gap-6">
              {subChapters.map((ch) => (
                <div key={ch.name} className="p-6 rounded-xl border border-border bg-background border-t-4 border-t-primary">
                  <h3 className="font-display font-semibold text-lg mb-3 text-foreground">{ch.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ch.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
