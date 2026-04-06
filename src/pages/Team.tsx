import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ChevronLeft, ChevronRight, Linkedin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import ScrollSection from "@/components/ScrollSection";

const departments = ["PR", "HR", "Operations", "Media", "Technical", "Research", "Documentation", "Marketing"];

type Member = {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  section: string;
  department: string | null;
  linkedin_url?: string | null;
};

const LinkedInIcon = ({ url }: { url?: string | null }) => {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex text-primary hover:text-primary/80 transition-colors" onClick={(e) => e.stopPropagation()}>
      <Linkedin className="h-4 w-4" />
    </a>
  );
};

// Faculty Coordinators — same style as Governing Body but without role label
const StaffCoordinatorCard = ({ member, i }: { member: Member; i: number }) => (
  <motion.div
    className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.08 }}
  >
    {member.image_url ? (
      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    ) : (
      <div className="w-full h-full bg-secondary flex items-center justify-center">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="flex items-center gap-2">
        <h3 className="font-display font-semibold text-sm">{member.name}</h3>
        <LinkedInIcon url={member.linkedin_url} />
      </div>
    </div>
  </motion.div>
);

const GoverningCard = ({ member, i }: { member: Member; i: number }) => (
  <motion.div
    className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.08 }}
  >
    {member.image_url ? (
      <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    ) : (
      <div className="w-full h-full bg-secondary flex items-center justify-center">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="flex items-center gap-2">
        <h3 className="font-display font-semibold text-sm">{member.name}</h3>
        <LinkedInIcon url={member.linkedin_url} />
      </div>
      <p className="text-primary text-xs font-semibold uppercase tracking-wider">{member.role}</p>
    </div>
  </motion.div>
);

const ExecomCard = ({ member, i }: { member: Member; i: number }) => (
  <motion.div
    className="rounded-xl border border-border bg-background overflow-hidden group card-hover"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.06 }}
  >
    <div className="aspect-square overflow-hidden">
      {member.image_url ? (
        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full bg-secondary flex items-center justify-center">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
    </div>
    <div className="p-3">
      <div className="flex items-center gap-2">
        <h3 className="font-display font-semibold text-sm">{member.name}</h3>
        <LinkedInIcon url={member.linkedin_url} />
      </div>
      <p className="text-primary text-xs font-medium uppercase tracking-wider">{member.role}</p>
    </div>
  </motion.div>
);

const CoreCard = ({ member, i }: { member: Member; i: number }) => (
  <motion.div
    className="rounded-xl border border-border bg-card overflow-hidden group card-hover"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.06 }}
  >
    <div className="aspect-square overflow-hidden">
      {member.image_url ? (
        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      ) : (
        <div className="w-full h-full bg-secondary flex items-center justify-center">
          <Users className="h-10 w-10 text-muted-foreground" />
        </div>
      )}
    </div>
    <div className="p-3">
      <div className="flex items-center gap-2">
        <h3 className="font-display font-semibold text-sm">{member.name}</h3>
        <LinkedInIcon url={member.linkedin_url} />
      </div>
      <p className="text-primary text-xs font-medium uppercase tracking-wider">{member.role}</p>
    </div>
  </motion.div>
);

const EmptyState = ({ text }: { text: string }) => (
  <div className="col-span-full text-center py-12 text-muted-foreground text-sm">{text}</div>
);

const Team = () => {
  const [coreFilter, setCoreFilter] = useState("PR");
  const [govPage, setGovPage] = useState(0);

  const { data: members = [] } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("display_order", { ascending: true }).order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const facultyCoordinators = members.filter((m: any) => m.section === "Staff Coordinators");
  const governing = members.filter((m: any) => m.section === "Governing Body");
  const execom = members.filter((m: any) => m.section === "Execom");
  const core = members.filter((m: any) => m.section === "Core");
  const filteredCore = core.filter((m: any) => m.department === coreFilter);

  const govPerPage = 4;
  const govPages = Math.ceil(governing.length / govPerPage);
  const govSlice = governing.slice(govPage * govPerPage, (govPage + 1) * govPerPage);

  return (
    <div className="min-h-screen pt-16">
      <ScrollSection>
      <section className="py-20 text-center">
        <div className="container">
          <span className="section-badge mb-4 inline-block">Organisational Hierarchy</span>
          <motion.h1
            className="section-heading text-4xl md:text-5xl mb-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Our <span className="gradient-text italic">Team</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Structured for excellence, driven by passion. Meet the tiers of talent shaping the future of eloquence at MJCET.
          </p>
        </div>
      </section>
      </ScrollSection>

      {/* Faculty Coordinators */}
      {facultyCoordinators.length > 0 && (
        <ScrollSection>
        <section className="py-16">
          <div className="container">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold">Faculty Coordinators</h2>
              <div className="w-16 h-0.5 bg-primary mt-2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {facultyCoordinators.map((m: any, i: number) => (
                <StaffCoordinatorCard key={m.id} member={m} i={i} />
              ))}
            </div>
          </div>
        </section>
        </ScrollSection>
      )}

      {/* Governing Body */}
      <ScrollSection>
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold">Governing Body</h2>
              <div className="w-16 h-0.5 bg-primary mt-2" />
            </div>
            {govPages > 1 && (
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8" disabled={govPage === 0} onClick={() => setGovPage(govPage - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8" disabled={govPage >= govPages - 1} onClick={() => setGovPage(govPage + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {govSlice.map((m: any, i: number) => (
              <GoverningCard key={m.id} member={m} i={i} />
            ))}
            {governing.length === 0 && <EmptyState text="No governing body members yet." />}
          </div>
        </div>
      </section>
      </ScrollSection>

      {/* EXECOM */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="mb-10">
            <h2 className="font-display text-2xl font-bold">
              Executive Committee <span className="gradient-text">2025</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-1">The executive committee driving the functional departments.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {execom.map((m: any, i: number) => (
              <ExecomCard key={m.id} member={m} i={i} />
            ))}
            {execom.length === 0 && <EmptyState text="No executive committee members yet." />}
          </div>
        </div>
      </section>

      {/* Core Members */}
      <section className="py-20">
        <div className="container">
          <div className="mb-10">
            <h2 className="font-display text-2xl font-bold">
              <span className="italic">Core</span> Members Portfolios
            </h2>
            <p className="text-sm text-muted-foreground mt-1">The engine room of Orators Club activities, organized by specialized departments.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {departments.map((dep) => (
              <button
                key={dep}
                onClick={() => setCoreFilter(dep)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                  coreFilter === dep
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {dep}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={coreFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
                <span className="w-6 h-px bg-primary" />
                {coreFilter} Core
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredCore.map((m: any, i: number) => (
                  <CoreCard key={m.id} member={m} i={i} />
                ))}
              </div>
              {filteredCore.length === 0 && <EmptyState text={`No ${coreFilter} core members yet.`} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Team;
