import { motion } from "framer-motion";
import aboutHero from "@/assets/about-hero.jpg";

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
            The <span className="gradient-text">Orators'</span> Club
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground">
            A legacy of voice, vision, and victory — since 2003.
          </p>
        </div>
      </section>

      {/* About the Club */}
      <section className="py-24">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">About the <span className="gradient-text">Club</span></h2>
            <div className="w-16 h-1 bg-primary rounded mb-8" />
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
              <p>
                Orators' Club was founded in 2003 under the Department of English at Muffakham Jah College of Engineering and Technology (MJCET), part of the Sultan-Ul-Uloom Education Society. An autonomous institution accredited by NAAC with A+ and NBA, affiliated to Osmania University and approved by AICTE, MJCET is one of Hyderabad's most respected engineering colleges.
              </p>
              <p>
                After a revival in 2009, the club has grown into one of the most active student organisations on campus — bridging the gap between technical education and communication excellence. What began as a small initiative has blossomed into a vibrant community of thinkers, speakers, and future leaders.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-card">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">What We <span className="gradient-text">Do</span></h2>
            <div className="w-16 h-1 bg-primary rounded mb-8" />
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
              <p>
                The club runs a wide range of activities — formal events like Debates, Group Discussions, Elocution Competitions, Essay Writing, Mock Interviews, and PowerPoint Presentations; creative events like Poster Making, Slogan Writing, Picture Perception, and Photography.
              </p>
              <p>
                Our flagship programmes include <strong className="text-foreground">ADSOPHOS</strong> (the annual technical fest), <strong className="text-foreground">ORATORIA</strong> (literary fest), <strong className="text-foreground">Spectrum</strong> (creative arts sub-chapter), and <strong className="text-foreground">MJ MUN</strong> (Model United Nations) — each providing students with unique opportunities to learn, compete, and grow.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Publications & Achievements */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Publications & <span className="gradient-text">Achievements</span></h2>
            <div className="w-16 h-1 bg-primary rounded mb-8" />
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
              <p>
                The club has produced notable publications including <em>Vestige</em> (a collection of short stories and poems), a Coffee Table Book, and a Poetry & Photography Collection. These works showcase the creative depth of our members and their literary talents beyond the stage.
              </p>
              <p>
                Members have won awards at intercollegiate and state-level competitions, including Best Delegate prizes at Model United Nations events — a testament to the club's commitment to nurturing excellence.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Department of English */}
      <section className="py-20 bg-card">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">About the <span className="gradient-text">Department of English</span></h2>
            <div className="w-16 h-1 bg-primary rounded mb-8" />
            <div className="space-y-4 text-muted-foreground leading-relaxed text-base md:text-lg">
              <p>
                The Department of English at MJCET is committed to developing well-rounded graduates. With experienced and widely published faculty, the department focuses not only on language proficiency but on inspiring students to lead ethical, fulfilling lives with strong personal accountability.
              </p>
              <p>
                Faculty members actively mentor students through the Orators' Club and have contributed significantly to research and academic publications, making the department a cornerstone of holistic education at MJCET.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sub-Chapters */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">Sub-<span className="gradient-text">Chapters</span></h2>
            <div className="w-16 h-1 bg-primary rounded mb-8" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">Spectrum</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A creative arts platform where students explore visual arts, calligraphy, T-shirt design, and the Human Library concept — celebrating creativity in all its forms.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">Speakers' Forum</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A regular platform for public speaking practice and peer feedback, providing a safe space to grow confidence and refine delivery.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-card">
                <h3 className="font-display font-semibold text-lg mb-3 text-foreground">Book Club</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Regular gatherings to discuss literature, authors, and ideas — fostering a deeper love for the written word and intellectual discourse.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
