import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Edit2, LogOut, Loader2, Upload, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "@/lib/upload";

const ADMIN_PASSWORD = "orators2025";

const SECTION_ROLES: Record<string, string[]> = {
  "Governing Body": ["Chief Coordinator", "Chief Representative", "Chief Strategist"],
  Execom: ["PR Execom", "HR Execom", "Operations Execom", "Media & Editing Execom", "Technical Execom", "Research Execom", "Documentation Execom", "Marketing Execom"],
  Core: ["PR Core", "HR Core", "Operations Core", "Media & Editing Core", "Technical Core", "Research Core", "Documentation Core", "Marketing Core"],
};

const DEPARTMENTS = ["PR", "HR", "Operations", "Media", "Technical", "Research", "Documentation", "Marketing"];

const roleToDepartment = (role: string): string | null => {
  for (const dep of DEPARTMENTS) {
    if (role.toLowerCase().startsWith(dep.toLowerCase())) return dep;
  }
  if (role.includes("Media")) return "Media";
  return null;
};

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-full max-w-sm p-8 rounded-xl border border-border space-y-4">
          <h1 className="font-display text-2xl font-bold text-center">Admin Login</h1>
          <form onSubmit={(e) => { e.preventDefault(); if (password === ADMIN_PASSWORD) setAuthenticated(true); else toast({ title: "Wrong password", variant: "destructive" }); }} className="space-y-4">
            <Input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          <Button variant="ghost" onClick={() => setAuthenticated(false)}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
        </div>
        <Tabs defaultValue="events">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="events"><EventsAdmin /></TabsContent>
          <TabsContent value="podcasts"><PodcastsAdmin /></TabsContent>
          <TabsContent value="gallery"><GalleryAdmin /></TabsContent>
          <TabsContent value="team"><TeamAdmin /></TabsContent>
          <TabsContent value="subscribers"><SubscribersView /></TabsContent>
          <TabsContent value="applications"><ApplicationsView /></TabsContent>
          <TabsContent value="messages"><MessagesView /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ---- Image Upload Component ----
const ImageUpload = ({ bucket, value, onChange, label = "Image" }: { bucket: string; value: string; onChange: (url: string) => void; label?: string }) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(bucket, file);
      onChange(url);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="preview" className="h-16 w-16 rounded-lg object-cover border border-border" />
        ) : (
          <div className="h-16 w-16 rounded-lg border border-dashed border-border flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
          <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
            {uploading ? <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading...</> : <><Upload className="h-3 w-3 mr-1" /> Upload</>}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ---- Events Admin (with image upload) ----
const EventsAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", category: "Workshops", image: "", slug: "", registration_link: "", status: "upcoming", display_order: 0, event_type: "external" });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => { const { data, error } = await supabase.from("events").select("*").order("display_order", { ascending: true }).order("date", { ascending: false }); if (error) throw error; return data; },
  });

  const resetForm = () => { setForm({ title: "", description: "", date: "", category: "Workshops", image: "", slug: "", registration_link: "", status: "upcoming", display_order: 0, event_type: "external" }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.slug) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, description: form.description, date: form.date, category: form.category, image: form.image || null, slug: form.slug, registration_link: form.registration_link || null, status: form.status, display_order: form.display_order, event_type: form.event_type };
      if (editing) { const { error } = await supabase.from("events").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("events").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-events"] }); qc.invalidateQueries({ queryKey: ["events"] });
      toast({ title: editing ? "Event updated" : "Event created" }); resetForm();
    } catch { toast({ title: "Error saving event", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => { await supabase.from("events").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-events"] }); qc.invalidateQueries({ queryKey: ["events"] }); toast({ title: "Event deleted" }); };

  const startEdit = (e: any) => { setForm({ title: e.title, description: e.description || "", date: e.date?.split("T")[0] || "", category: e.category, image: e.image || "", slug: e.slug, registration_link: e.registration_link || "", status: e.status || "upcoming", display_order: e.display_order || 0, event_type: e.event_type || "external" }); setEditing(e); setShowForm(true); };

  const moveEvent = async (id: string, direction: "up" | "down") => {
    const idx = events.findIndex((e: any) => e.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= events.length) return;
    const a = events[idx] as any;
    const b = events[swapIdx] as any;
    await supabase.from("events").update({ display_order: b.display_order ?? swapIdx }).eq("id", a.id);
    await supabase.from("events").update({ display_order: a.display_order ?? idx }).eq("id", b.id);
    qc.invalidateQueries({ queryKey: ["admin-events"] });
    qc.invalidateQueries({ queryKey: ["events"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold">Events ({events.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" /> Add Event</Button>
      </div>
      {showForm && (
        <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="text-sm font-medium block mb-1">Slug *</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Date *</label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div><label className="text-sm font-medium block mb-1">Category</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Workshops</option><option>Debates</option><option>Guest Lectures</option><option>general</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="text-sm font-medium block mb-1">Status *</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="upcoming">Upcoming</option><option value="past">Past</option>
              </select>
            </div>
            <div><label className="text-sm font-medium block mb-1">Event Type *</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })}>
                <option value="external">External Event</option><option value="internal">Internal Event</option>
              </select>
            </div>
            <div><label className="text-sm font-medium block mb-1">Display Order</label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <ImageUpload bucket="events-images" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          <div><label className="text-sm font-medium block mb-1">Google Form Registration Link</label><Input placeholder="https://forms.google.com/..." value={form.registration_link} onChange={(e) => setForm({ ...form, registration_link: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="flex gap-2"><Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button><Button variant="outline" onClick={resetForm}>Cancel</Button></div>
        </div>
      )}
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {events.map((e: any, idx: number) => (
            <div key={e.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === 0} onClick={() => moveEvent(e.id, "up")}><ArrowUp className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === events.length - 1} onClick={() => moveEvent(e.id, "down")}><ArrowDown className="h-3 w-3" /></Button>
                </div>
                {e.image && <img src={e.image} alt="" className="h-10 w-10 rounded object-cover" />}
                <div>
                  <h3 className="font-medium">{e.title}</h3>
                  <p className="text-xs text-muted-foreground">{e.category} · {e.date?.split("T")[0]} · <span className={e.status === "upcoming" ? "text-primary" : "text-muted-foreground"}>{e.status === "upcoming" ? "Upcoming" : "Past"}</span> · {(e as any).event_type === "internal" ? "Internal" : "External"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(e)}><Edit2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Podcasts Admin ----
const PodcastsAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", embed_url: "", image: "", slug: "" });

  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ["admin-podcasts"],
    queryFn: async () => { const { data, error } = await supabase.from("podcasts").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const resetForm = () => { setForm({ title: "", description: "", embed_url: "", image: "", slug: "" }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, description: form.description || null, embed_url: form.embed_url || null, image: form.image || null, slug: form.slug };
      if (editing) { const { error } = await supabase.from("podcasts").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("podcasts").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-podcasts"] }); qc.invalidateQueries({ queryKey: ["podcasts"] });
      toast({ title: editing ? "Updated" : "Created" }); resetForm();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => { await supabase.from("podcasts").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-podcasts"] }); qc.invalidateQueries({ queryKey: ["podcasts"] }); toast({ title: "Deleted" }); };
  const startEdit = (p: any) => { setForm({ title: p.title, description: p.description || "", embed_url: p.embed_url || "", image: p.image || "", slug: p.slug }); setEditing(p); setShowForm(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold">Podcasts ({podcasts.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" /> Add Podcast</Button>
      </div>
      {showForm && (
        <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="text-sm font-medium block mb-1">Slug *</label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
          </div>
          <div><label className="text-sm font-medium block mb-1">Embed URL</label><Input value={form.embed_url} onChange={(e) => setForm({ ...form, embed_url: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Image URL</label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="flex gap-2"><Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button><Button variant="outline" onClick={resetForm}>Cancel</Button></div>
        </div>
      )}
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {podcasts.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div><h3 className="font-medium">{p.title}</h3><p className="text-xs text-muted-foreground">{p.slug}</p></div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(p)}><Edit2 className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Gallery Admin (with file upload + multi-upload) ----
const GalleryAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("Events");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => { const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage("gallery-images", file);
        await supabase.from("gallery").insert({ image_url: url, category, caption: caption || null });
      }
      qc.invalidateQueries({ queryKey: ["admin-gallery"] }); qc.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: `${files.length} image(s) added` });
      setShowForm(false); setCaption("");
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => { await supabase.from("gallery").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-gallery"] }); qc.invalidateQueries({ queryKey: ["gallery"] }); toast({ title: "Deleted" }); };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold">Gallery ({items.length})</h2>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" /> Add Images</Button>
      </div>
      {showForm && (
        <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Category</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>Events</option><option>Workshops</option><option>Competitions</option><option>general</option>
              </select>
            </div>
            <div><label className="text-sm font-medium block mb-1">Caption (optional)</label><Input value={caption} onChange={(e) => setCaption(e.target.value)} /></div>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={handleFiles} />
            <Button variant="outline" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading...</> : <><Upload className="h-4 w-4 mr-2" /> Select Images (multiple)</>}
            </Button>
          </div>
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
        </div>
      )}
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item: any) => (
            <div key={item.id} className="relative group rounded-lg border border-border overflow-hidden aspect-square">
              <img src={item.image_url} alt={item.caption || ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              {item.caption && <p className="absolute bottom-0 left-0 right-0 bg-background/80 text-xs p-2 truncate">{item.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Team Admin ----
const TeamAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: "", section: "Governing Body", role: "Chief Coordinator", image_url: "", department: "" });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => { const { data, error } = await supabase.from("team_members").select("*").order("created_at"); if (error) throw error; return data; },
  });

  const resetForm = () => { setForm({ name: "", section: "Governing Body", role: "Chief Coordinator", image_url: "", department: "" }); setEditing(null); setShowForm(false); };

  const handleSectionChange = (section: string) => {
    const roles = SECTION_ROLES[section] || [];
    setForm({ ...form, section, role: roles[0] || "" });
  };

  const handleSave = async () => {
    if (!form.name || !form.role) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    const dept = form.section === "Core" ? roleToDepartment(form.role) : (form.section === "Execom" ? roleToDepartment(form.role) : null);
    try {
      const payload = { name: form.name, role: form.role, section: form.section, image_url: form.image_url || null, department: dept };
      if (editing) { const { error } = await supabase.from("team_members").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("team_members").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-team"] }); qc.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: editing ? "Updated" : "Member added" }); resetForm();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => { await supabase.from("team_members").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-team"] }); qc.invalidateQueries({ queryKey: ["team-members"] }); toast({ title: "Deleted" }); };

  const startEdit = (m: any) => { setForm({ name: m.name, section: m.section, role: m.role, image_url: m.image_url || "", department: m.department || "" }); setEditing(m); setShowForm(true); };

  const roles = SECTION_ROLES[form.section] || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold">Team Members ({members.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" /> Add Member</Button>
      </div>
      {showForm && (
        <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
          <div><label className="text-sm font-medium block mb-1">Name *</label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Section *</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.section} onChange={(e) => handleSectionChange(e.target.value)}>
                {Object.keys(SECTION_ROLES).map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="text-sm font-medium block mb-1">Role *</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <ImageUpload bucket="team-images" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} label="Member Photo" />
          <div className="flex gap-2"><Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button><Button variant="outline" onClick={resetForm}>Cancel</Button></div>
        </div>
      )}
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {["Governing Body", "Execom", "Core"].map((section) => {
            const sectionMembers = members.filter((m: any) => m.section === section);
            if (sectionMembers.length === 0) return null;
            return (
              <div key={section} className="mb-6">
                <h3 className="font-display font-semibold text-lg mb-3 text-primary">{section}</h3>
                <div className="space-y-2">
                  {sectionMembers.map((m: any) => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        {m.image_url && <img src={m.image_url} alt="" className="h-10 w-10 rounded-full object-cover" />}
                        <div>
                          <h4 className="font-medium text-sm">{m.name}</h4>
                          <p className="text-xs text-muted-foreground">{m.role}{m.department ? ` · ${m.department}` : ""}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(m)}><Edit2 className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---- Read-only views ----
const SubscribersView = () => {
  const { data: subs = [], isLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => { const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });
  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Newsletter Subscribers ({subs.length})</h2>
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">{subs.map((s: any) => (
          <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
            <span className="text-sm">{s.email}</span>
            <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
          </div>
        ))}</div>
      )}
    </div>
  );
};

const ApplicationsView = () => {
  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => { const { data, error } = await supabase.from("join_applications").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });
  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Applications ({apps.length})</h2>
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-3">{apps.map((a: any) => (
          <div key={a.id} className="p-4 rounded-lg border border-border space-y-1">
            <div className="flex justify-between"><h3 className="font-medium">{a.first_name} {a.last_name}</h3><span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span></div>
            <p className="text-sm text-muted-foreground">{a.email} · {a.phone}</p>
            <p className="text-sm"><span className="text-primary font-medium">{a.academic_year}</span> · {a.debate_experience}</p>
            {a.why_join && <p className="text-sm text-muted-foreground italic">"{a.why_join}"</p>}
          </div>
        ))}</div>
      )}
    </div>
  );
};

const MessagesView = () => {
  const { data: msgs = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => { const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });
  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Contact Messages ({msgs.length})</h2>
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-3">{msgs.map((m: any) => (
          <div key={m.id} className="p-4 rounded-lg border border-border space-y-1">
            <div className="flex justify-between"><h3 className="font-medium">{m.name}</h3><span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span></div>
            <p className="text-sm text-muted-foreground">{m.email} · {m.subject}</p>
            <p className="text-sm">{m.message}</p>
          </div>
        ))}</div>
      )}
    </div>
  );
};

export default Admin;
