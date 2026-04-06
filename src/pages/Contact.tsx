import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ScrollSection from "@/components/ScrollSection";

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "General Inquiry", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email.trim(),
        subject: form.subject,
        message: form.message.trim(),
      });
      if (error) throw error;
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ firstName: "", lastName: "", email: "", subject: "General Inquiry", message: "" });
    } catch {
      toast({ title: "Error", description: "Failed to send. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <ScrollSection>
      <section className="py-20 text-center bg-card">
        <div className="container">
          <span className="section-badge mb-4 inline-block">Get in Touch</span>
          <motion.h1
            className="section-heading text-4xl md:text-6xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Let's Start a <span className="gradient-text">Conversation</span>
          </motion.h1>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Have questions about membership, upcoming debates, or partnership opportunities? We're here to listen.
          </p>
        </div>
      </section>
      </ScrollSection>

      <ScrollSection>
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.form
              onSubmit={handleSubmit}
              className="rounded-xl border border-border p-8 space-y-5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="font-display font-semibold text-xl">Send us a message</h2>
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
                <Input type="email" placeholder="jane@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                >
                  <option>General Inquiry</option>
                  <option>Membership</option>
                  <option>Events</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea rows={5} placeholder="How can we help you?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Sending..." : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
              </Button>
            </motion.form>

            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border p-6">
                  <MapPin className="h-5 w-5 text-primary mb-3" />
                  <h3 className="font-display font-semibold mb-2">Visit Us</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Muffakham Jah College of Engineering & Technology<br />
                    Mount Pleasant, 8-2-249, Road No. 3<br />
                    Banjara Hills, Hyderabad<br />
                    Telangana - 500082
                  </p>
                </div>
                <div className="rounded-xl border border-border p-6">
                  <Mail className="h-5 w-5 text-primary mb-3" />
                  <h3 className="font-display font-semibold mb-2">Contact Info</h3>
                  <p className="text-sm text-muted-foreground">info@oratorsclub.com</p>
                  <p className="text-sm text-muted-foreground">+91 40 2354 2020</p>
                </div>
              </div>

              <div className="flex gap-3">
                <a href="https://www.instagram.com/oratorsclubmjcet?igsh=cGtnYzFjamlteDY2" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <a href="https://www.linkedin.com/company/orators-club-mjcet/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>

              <div className="rounded-xl overflow-hidden border border-border h-64">
                <iframe
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Muffakham+Jah+College+of+Engineering+and+Technology,Banjara+Hills,Hyderabad&zoom=15"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="MJCET Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollSection>
    </div>
  );
};

export default Contact;
