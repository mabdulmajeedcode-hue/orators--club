import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ScrollSection from "@/components/ScrollSection";

const faqs = [
  { q: "What is the time commitment?", a: "Most members spend 3-5 hours per week on club activities including weekly meetings and practice sessions." },
  { q: "Are there membership dues?", a: "There is a nominal annual fee to cover event costs and materials. Financial assistance is available." },
  { q: "Do I need prior debate experience?", a: "Absolutely not! We welcome beginners and provide comprehensive training for all skill levels." },
  { q: "When are applications due?", a: "We accept applications on a rolling basis, with priority given to early applicants each semester." },
];

const Join = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", year: "", experience: "", reason: "",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("join_applications").insert({
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        academic_year: form.year,
        debate_experience: form.experience || null,
        why_join: form.reason.trim() || null,
      });
      if (error) throw error;
      toast({ title: "Application submitted!", description: "We'll review your application and get back to you soon." });
      setForm({ firstName: "", lastName: "", email: "", phone: "", year: "", experience: "", reason: "" });
    } catch {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <ScrollSection>
      <section className="py-20 text-center">
        <div className="container">
          <span className="section-badge mb-4 inline-block">Join the Club</span>
          <motion.h1
            className="section-heading text-5xl md:text-7xl mb-4"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Your Voice <span className="gradient-text">Deserves</span> a Platform
          </motion.h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Become a member of the Orators Club today. Access exclusive workshops, mentorship, and a community dedicated to mastering the art of persuasion.
          </p>
        </div>
      </section>
      </ScrollSection>

      <ScrollSection>
      <section className="py-12">
        <div className="container max-w-2xl">
          <motion.form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border p-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h2 className="font-display text-2xl font-bold">Membership Application</h2>
              <p className="text-sm text-muted-foreground">Please complete all fields. Applications are reviewed on a rolling basis.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">First Name</label>
                <Input placeholder="Jane" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Last Name</label>
                <Input placeholder="Doe" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Email Address</label>
              <Input type="email" placeholder="jane@university.edu" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Phone Number</label>
                <Input placeholder="+91 9876543210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Academic Year</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  required
                >
                  <option value="">Select your year</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold mb-2">Debate Experience</h3>
              <p className="text-sm text-muted-foreground mb-3">Have you participated in competitive debate before?</p>
              <div className="flex gap-4">
                {["Yes, extensively", "Some experience", "No, I'm new"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="experience"
                      value={opt}
                      checked={form.experience === opt}
                      onChange={(e) => setForm({ ...form, experience: e.target.value })}
                      className="accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Why do you want to join Orators Club?</label>
              <Textarea rows={4} placeholder="Tell us about your goals..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
            </div>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </motion.form>
        </div>
      </section>
      </ScrollSection>

      <ScrollSection>
      <section className="py-20 bg-card">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold uppercase mb-2">Membership FAQs</h2>
          <p className="text-muted-foreground mb-10">Common questions about joining the club.</p>
          <div className="space-y-3 text-left">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-secondary/50 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      </ScrollSection>
    </div>
  );
};

export default Join;
