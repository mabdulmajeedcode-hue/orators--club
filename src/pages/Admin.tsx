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
            <TabsTrigger value="popup">Popup</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="events"><EventsAdmin /></TabsContent>
          <TabsContent value="podcasts"><PodcastsAdmin /></TabsContent>
          <TabsContent value="gallery"><GalleryEventsAdmin /></TabsContent>
          <TabsContent value="team"><TeamAdmin /></TabsContent>
          <TabsContent value="popup"><PopupAdmin /></TabsContent>
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

// ---- Events Admin ----
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
                  <p className="text-xs text-muted-foreground">{e.category} · {e.date?.split("T")[0]} · <span className={e.status === "upcoming" ? "text-primary" : "text-muted-foreground"}>{e.status === "upcoming" ? "Upcoming" : "Past"}</span> · {e.event_type === "internal" ? "Internal" : "External"}</p>
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

// ---- Podcasts Admin (with image upload) ----
const PodcastsAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", embed_url: "", image: "", slug: "", display_order: 0 });

  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ["admin-podcasts"],
    queryFn: async () => { const { data, error } = await supabase.from("podcasts").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const resetForm = () => { setForm({ title: "", description: "", embed_url: "", image: "", slug: "", display_order: 0 }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, description: form.description || null, embed_url: form.embed_url || null, image: form.image || null, slug: form.slug, display_order: form.display_order };
      if (editing) { const { error } = await supabase.from("podcasts").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("podcasts").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-podcasts"] }); qc.invalidateQueries({ queryKey: ["podcasts"] });
      toast({ title: editing ? "Updated" : "Created" }); resetForm();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => { await supabase.from("podcasts").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-podcasts"] }); qc.invalidateQueries({ queryKey: ["podcasts"] }); toast({ title: "Deleted" }); };
  const startEdit = (p: any) => { setForm({ title: p.title, description: p.description || "", embed_url: p.embed_url || "", image: p.image || "", slug: p.slug, display_order: p.display_order || 0 }); setEditing(p); setShowForm(true); };

  const movePodcast = async (id: string, direction: "up" | "down") => {
    const idx = podcasts.findIndex((p: any) => p.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= podcasts.length) return;
    const a = podcasts[idx] as any;
    const b = podcasts[swapIdx] as any;
    await supabase.from("podcasts").update({ display_order: b.display_order ?? swapIdx }).eq("id", a.id);
    await supabase.from("podcasts").update({ display_order: a.display_order ?? idx }).eq("id", b.id);
    qc.invalidateQueries({ queryKey: ["admin-podcasts"] });
    qc.invalidateQueries({ queryKey: ["podcasts"] });
  };

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
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">YouTube URL</label><Input value={form.embed_url} onChange={(e) => setForm({ ...form, embed_url: e.target.value })} /></div>
            <div><label className="text-sm font-medium block mb-1">Display Order</label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <ImageUpload bucket="podcast-images" value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="Podcast Thumbnail" />
          <div><label className="text-sm font-medium block mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="flex gap-2"><Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button><Button variant="outline" onClick={resetForm}>Cancel</Button></div>
        </div>
      )}
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {podcasts.map((p: any, idx: number) => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === 0} onClick={() => movePodcast(p.id, "up")}><ArrowUp className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === podcasts.length - 1} onClick={() => movePodcast(p.id, "down")}><ArrowDown className="h-3 w-3" /></Button>
                </div>
                {p.image && <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />}
                <div><h3 className="font-medium">{p.title}</h3><p className="text-xs text-muted-foreground">{p.slug}</p></div>
              </div>
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

// ---- Gallery Events Admin ----
const GalleryEventsAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", cover_image: "" });
  const [uploadingImages, setUploadingImages] = useState(false);
  const multiFileRef = useRef<HTMLInputElement>(null);

  const { data: galleryEvents = [], isLoading } = useQuery({
    queryKey: ["admin-gallery-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_events").select("*, gallery_event_images(id, image_url, caption, image_order)").order("display_order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      // Sort images within each event by image_order
      return (data || []).map((ge: any) => ({
        ...ge,
        gallery_event_images: (ge.gallery_event_images || []).sort((a: any, b: any) => (a.image_order ?? 0) - (b.image_order ?? 0)),
      }));
    },
  });

  const resetForm = () => { setForm({ title: "", description: "", cover_image: "" }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title) { toast({ title: "Title is required", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, description: form.description || null, cover_image: form.cover_image || null };
      if (editing) {
        const { error } = await supabase.from("gallery_events").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery_events").insert(payload);
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-events"] });
      toast({ title: editing ? "Updated" : "Gallery created" });
      resetForm();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("gallery_events").delete().eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-events"] });
      toast({ title: "Gallery deleted" });
    } catch { toast({ title: "Error deleting", variant: "destructive" }); }
  };

  const handleAddImages = async (galleryEventId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImages(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage("gallery-images", file);
        await supabase.from("gallery_event_images").insert({ gallery_event_id: galleryEventId, image_url: url });
      }
      qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-event-images"] });
      toast({ title: `${files.length} image(s) added` });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploadingImages(false); }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await supabase.from("gallery_event_images").delete().eq("id", imageId);
      qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-event-images"] });
      toast({ title: "Image removed" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  const startEdit = (ge: any) => {
    setForm({ title: ge.title, description: ge.description || "", cover_image: ge.cover_image || "" });
    setEditing(ge);
    setShowForm(true);
  };

  const moveGalleryEvent = async (id: string, direction: "up" | "down") => {
    const idx = galleryEvents.findIndex((ge: any) => ge.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= galleryEvents.length) return;
    const a = galleryEvents[idx] as any;
    const b = galleryEvents[swapIdx] as any;
    await supabase.from("gallery_events").update({ display_order: b.display_order ?? swapIdx }).eq("id", a.id);
    await supabase.from("gallery_events").update({ display_order: a.display_order ?? idx }).eq("id", b.id);
    qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
    qc.invalidateQueries({ queryKey: ["gallery-events"] });
  };

  const moveImage = async (galleryEventId: string, imageId: string, direction: "up" | "down") => {
    const ge = galleryEvents.find((g: any) => g.id === galleryEventId) as any;
    if (!ge) return;
    const imgs = ge.gallery_event_images || [];
    const idx = imgs.findIndex((img: any) => img.id === imageId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= imgs.length) return;
    const a = imgs[idx];
    const b = imgs[swapIdx];
    await supabase.from("gallery_event_images").update({ image_order: b.image_order ?? swapIdx }).eq("id", a.id);
    await supabase.from("gallery_event_images").update({ image_order: a.image_order ?? idx }).eq("id", b.id);
    qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
    qc.invalidateQueries({ queryKey: ["gallery-event-images"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold">Gallery ({galleryEvents.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" /> Create Gallery</Button>
      </div>
      {showForm && (
        <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
          <div><label className="text-sm font-medium block mb-1">Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          <ImageUpload bucket="gallery-images" value={form.cover_image} onChange={(url) => setForm({ ...form, cover_image: url })} label="Cover Image" />
          <div className="flex gap-2"><Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button><Button variant="outline" onClick={resetForm}>Cancel</Button></div>
        </div>
      )}
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-4">
          {galleryEvents.map((ge: any, geIdx: number) => (
            <div key={ge.id} className="rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5">
                    <Button size="icon" variant="ghost" className="h-6 w-6" disabled={geIdx === 0} onClick={() => moveGalleryEvent(ge.id, "up")}><ArrowUp className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-6 w-6" disabled={geIdx === galleryEvents.length - 1} onClick={() => moveGalleryEvent(ge.id, "down")}><ArrowDown className="h-3 w-3" /></Button>
                  </div>
                  {ge.cover_image && <img src={ge.cover_image} alt="" className="h-12 w-12 rounded object-cover" />}
                  <div>
                    <h3 className="font-medium">{ge.title}</h3>
                    <p className="text-xs text-muted-foreground">{ge.gallery_event_images?.length || 0} photos</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(ge)}><Edit2 className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(ge.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
              {/* Images grid */}
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-3">
                {ge.gallery_event_images?.map((img: any, imgIdx: number) => (
                  <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6" disabled={imgIdx === 0} onClick={() => moveImage(ge.id, img.id, "up")}><ArrowUp className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" disabled={imgIdx === (ge.gallery_event_images?.length || 1) - 1} onClick={() => moveImage(ge.id, img.id, "down")}><ArrowDown className="h-3 w-3" /></Button>
                      <Button size="icon" variant="destructive" className="h-6 w-6" onClick={() => handleDeleteImage(img.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" ref={multiFileRef} onChange={(e) => handleAddImages(ge.id, e)} />
                <Button variant="outline" size="sm" disabled={uploadingImages} onClick={() => multiFileRef.current?.click()}>
                  {uploadingImages ? <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading...</> : <><Upload className="h-3 w-3 mr-1" /> Add Photos</>}
                </Button>
              </div>
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
  const [form, setForm] = useState({ name: "", section: "Governing Body", role: "Chief Coordinator", image_url: "", department: "", linkedin_url: "" });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => { const { data, error } = await supabase.from("team_members").select("*").order("created_at"); if (error) throw error; return data; },
  });

  const resetForm = () => { setForm({ name: "", section: "Governing Body", role: "Chief Coordinator", image_url: "", department: "", linkedin_url: "" }); setEditing(null); setShowForm(false); };

  const handleSectionChange = (section: string) => {
    const roles = SECTION_ROLES[section] || [];
    setForm({ ...form, section, role: roles[0] || "" });
  };

  const handleSave = async () => {
    if (!form.name || !form.role) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    if (form.linkedin_url && !form.linkedin_url.startsWith("http")) { toast({ title: "LinkedIn URL must start with http", variant: "destructive" }); return; }
    const dept = form.section === "Core" ? roleToDepartment(form.role) : (form.section === "Execom" ? roleToDepartment(form.role) : null);
    try {
      const payload: any = { name: form.name, role: form.role, section: form.section, image_url: form.image_url || null, department: dept, linkedin_url: form.linkedin_url || null };
      if (editing) { const { error } = await supabase.from("team_members").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("team_members").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-team"] }); qc.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: editing ? "Updated" : "Member added" }); resetForm();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => { await supabase.from("team_members").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-team"] }); qc.invalidateQueries({ queryKey: ["team-members"] }); toast({ title: "Deleted" }); };

  const startEdit = (m: any) => { setForm({ name: m.name, section: m.section, role: m.role, image_url: m.image_url || "", department: m.department || "", linkedin_url: (m as any).linkedin_url || "" }); setEditing(m); setShowForm(true); };

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
          <div><label className="text-sm font-medium block mb-1">LinkedIn Profile URL (optional)</label><Input placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} /></div>
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
                          <p className="text-xs text-muted-foreground">{m.role}{m.department ? ` · ${m.department}` : ""}{m.linkedin_url ? " · 🔗" : ""}</p>
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

// ---- Popup Admin ----
const PopupAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: "", description: "", image_url: "", cta_text: "", cta_link: "", is_active: false });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: popups = [], isLoading } = useQuery({
    queryKey: ["admin-popups"],
    queryFn: async () => {
      const { data, error } = await supabase.from("popups").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => { setForm({ title: "", description: "", image_url: "", cta_text: "", cta_link: "", is_active: false }); setEditingId(null); };

  const handleSave = async () => {
    if (!form.title) { toast({ title: "Title is required", variant: "destructive" }); return; }
    try {
      // If activating, deactivate all others first
      if (form.is_active) {
        await supabase.from("popups").update({ is_active: false }).neq("id", editingId || "");
      }
      const payload: any = { title: form.title, description: form.description || null, image_url: form.image_url || null, cta_text: form.cta_text || null, cta_link: form.cta_link || null, is_active: form.is_active };
      if (editingId) {
        const { error } = await supabase.from("popups").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("popups").insert(payload);
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["admin-popups"] });
      qc.invalidateQueries({ queryKey: ["active-popup"] });
      toast({ title: editingId ? "Popup updated" : "Popup created" });
      resetForm();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("popups").delete().eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-popups"] });
      qc.invalidateQueries({ queryKey: ["active-popup"] });
      toast({ title: "Popup deleted" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  const startEdit = (p: any) => {
    setForm({ title: p.title, description: p.description || "", image_url: p.image_url || "", cta_text: p.cta_text || "", cta_link: p.cta_link || "", is_active: p.is_active });
    setEditingId(p.id);
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      if (active) {
        await supabase.from("popups").update({ is_active: false }).neq("id", id);
      }
      await supabase.from("popups").update({ is_active: active }).eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-popups"] });
      qc.invalidateQueries({ queryKey: ["active-popup"] });
      toast({ title: active ? "Popup activated" : "Popup deactivated" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Popup Manager</h2>
      <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
        <div><label className="text-sm font-medium block mb-1">Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><label className="text-sm font-medium block mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
        <ImageUpload bucket="popup-images" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} label="Popup Image" />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm font-medium block mb-1">CTA Button Text</label><Input placeholder="Learn More" value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">CTA Button Link</label><Input placeholder="https://..." value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} /></div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="popup-active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" />
          <label htmlFor="popup-active" className="text-sm font-medium">Active (show on website)</label>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave}>{editingId ? "Update" : "Create"}</Button>
          {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>
      </div>

      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {popups.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                {p.image_url && <img src={p.image_url} alt="" className="h-10 w-10 rounded object-cover" />}
                <div>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.is_active ? "🟢 Active" : "⚪ Inactive"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant={p.is_active ? "outline" : "default"} onClick={() => toggleActive(p.id, !p.is_active)}>
                  {p.is_active ? "Deactivate" : "Activate"}
                </Button>
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
