import { motion } from "framer-motion";
import { Users } from "lucide-react";

const faculty = [
  { name: "Dr. Amina Khan", role: "Faculty Advisor", desc: "Professor of English Literature with 15+ years of debate coaching experience." },
  { name: "Prof. Rajesh Sharma", role: "Co-Advisor", desc: "Specializes in rhetoric and communication studies at MJCET." },
];

const coreTeam = [
  { name: "Sarah Jenkins", role: "President", desc: "National debate champion with a passion for policy and public discourse." },
  { name: "Michael Chen", role: "VP of Debate", desc: "Specializes in impromptu speaking and curriculum development for new members." },
  { name: "Amara Okafor", role: "Secretary", desc: "Ensures smooth operations and organizes our quarterly regional meetings." },
  { name: "David Ross", role: "Treasurer", desc: "Manages club finances and spearheads our annual fundraising gala." },
  { name: "Priya Mehta", role: "Events Head", desc: "Coordinates all workshops, competitions, and guest lecture series." },
  { name: "Ahmed Hassan", role: "PR Head", desc: "Manages social media presence and external communications." },
];

const PersonCard = ({ person, i }: { person: typeof coreTeam[0]; i: number }) => (
  <motion.div
    className="text-center"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.08 }}
  >
    <div className="w-28 h-28 rounded-full bg-secondary border-2 border-border mx-auto mb-4 flex items-center justify-center">
      <Users className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="font-display font-semibold">{person.name}</h3>
    <p className="text-primary text-sm font-medium uppercase tracking-wider mb-2">{person.role}</p>
    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">{person.desc}</p>
  </motion.div>
);

const Team = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="py-20 text-center">
        <div className="container">
          <span className="section-badge mb-4 inline-block">Our People</span>
          <h1 className="section-heading text-4xl md:text-5xl mb-4">
            Meet the <span className="gradient-text">Team</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Meet the voices guiding the next generation of speakers.
          </p>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-16 bg-card">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-center mb-12">Faculty <span className="gradient-text">Advisors</span></h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {faculty.map((f, i) => (
              <PersonCard key={f.name} person={f} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Core Team */}
      <section className="py-20">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-center mb-12">Core <span className="gradient-text">Team</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {coreTeam.map((p, i) => (
              <PersonCard key={p.name} person={p} i={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
