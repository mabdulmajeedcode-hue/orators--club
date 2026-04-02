import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Edit2, LogOut, Loader2, Upload, Image as ImageIcon, ArrowUp, ArrowDown, AlertTriangle, FileText } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadImage } from "@/lib/upload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ADMIN_PASSWORD = "orators2025";

const SECTION_ROLES: Record<string, string[]> = {
  "Staff Coordinators": [],
  "Governing Body": ["Chief Coordinator", "Chief Representative", "Chief Strategist", "General Secretary"],
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

// --- Shared reorder helper: swaps two items and normalizes all positions ---
const normalizeAndPersist = async (
  table: string,
  items: any[],
  idx: number,
  direction: "up" | "down",
  orderField: string,
  qc: any,
  queryKeys: string[]
) => {
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= items.length) return;
  const reordered = [...items];
  [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
  const updates = reordered.map((item, i) => ({ id: item.id, [orderField]: i + 1 }));
  for (const u of updates) {
    await (supabase.from(table as any) as any).update({ [orderField]: u[orderField] }).eq("id", u.id);
  }
  for (const key of queryKeys) {
    qc.invalidateQueries({ queryKey: [key] });
  }
};

// --- Delete confirmation wrapper ---
const DeleteButton = ({ onConfirm, label = "this item" }: { onConfirm: () => void; label?: string }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" /> Confirm Deletion</AlertDialogTitle>
        <AlertDialogDescription>Are you sure you want to delete {label}? This action cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

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
            <TabsTrigger value="publications">Publications</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="popup">Popup</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="events"><EventsAdmin /></TabsContent>
          <TabsContent value="podcasts"><PodcastsAdmin /></TabsContent>
          <TabsContent value="gallery"><GalleryEventsAdmin /></TabsContent>
          <TabsContent value="publications"><PublicationsAdmin /></TabsContent>
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
      toast({ title: "Image uploaded successfully" });
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
    if (!form.title || !form.date || !form.slug) { toast({ title: "Fill required fields (Title, Date, Slug)", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, description: form.description, date: form.date, category: form.category, image: form.image || null, slug: form.slug, registration_link: form.registration_link || null, status: form.status, display_order: form.display_order, event_type: form.event_type };
      if (editing) { const { error } = await supabase.from("events").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("events").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-events"] }); qc.invalidateQueries({ queryKey: ["events"] });
      toast({ title: editing ? "Event updated successfully" : "Event created successfully" }); resetForm();
    } catch { toast({ title: "Error saving event", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("events").delete().eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-events"] }); qc.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Event deleted successfully" });
    } catch { toast({ title: "Error deleting event", variant: "destructive" }); }
  };

  const startEdit = (e: any) => { setForm({ title: e.title, description: e.description || "", date: e.date?.split("T")[0] || "", category: e.category, image: e.image || "", slug: e.slug, registration_link: e.registration_link || "", status: e.status || "upcoming", display_order: e.display_order || 0, event_type: e.event_type || "external" }); setEditing(e); setShowForm(true); };

  const moveEvent = async (id: string, direction: "up" | "down") => {
    const idx = events.findIndex((e: any) => e.id === id);
    if (idx < 0) return;
    await normalizeAndPersist("events", events, idx, direction, "display_order", qc, ["admin-events", "events"]);
    toast({ title: "Order updated" });
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
            <div><label className="text-sm font-medium block mb-1">Status</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="upcoming">Upcoming</option><option value="past">Past</option>
              </select>
            </div>
            <div><label className="text-sm font-medium block mb-1">Event Type</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })}>
                <option value="external">External Event</option><option value="internal">Internal Event</option>
              </select>
            </div>
            <div><label className="text-sm font-medium block mb-1">Display Order</label><Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
          </div>
          <ImageUpload bucket="events-images" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
          <div><label className="text-sm font-medium block mb-1">Registration Link</label><Input placeholder="https://forms.google.com/..." value={form.registration_link} onChange={(e) => setForm({ ...form, registration_link: e.target.value })} /></div>
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
                <DeleteButton onConfirm={() => handleDelete(e.id)} label={`"${e.title}"`} />
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
  const [form, setForm] = useState({ title: "", description: "", embed_url: "", image: "", slug: "", display_order: 0 });

  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ["admin-podcasts"],
    queryFn: async () => { const { data, error } = await supabase.from("podcasts").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const resetForm = () => { setForm({ title: "", description: "", embed_url: "", image: "", slug: "", display_order: 0 }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast({ title: "Fill required fields (Title, Slug)", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, description: form.description || null, embed_url: form.embed_url || null, image: form.image || null, slug: form.slug, display_order: form.display_order };
      if (editing) { const { error } = await supabase.from("podcasts").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("podcasts").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-podcasts"] }); qc.invalidateQueries({ queryKey: ["podcasts"] });
      toast({ title: editing ? "Podcast updated" : "Podcast created" }); resetForm();
    } catch { toast({ title: "Error saving podcast", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("podcasts").delete().eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-podcasts"] }); qc.invalidateQueries({ queryKey: ["podcasts"] });
      toast({ title: "Podcast deleted" });
    } catch { toast({ title: "Error deleting", variant: "destructive" }); }
  };

  const startEdit = (p: any) => { setForm({ title: p.title, description: p.description || "", embed_url: p.embed_url || "", image: p.image || "", slug: p.slug, display_order: p.display_order || 0 }); setEditing(p); setShowForm(true); };

  const movePodcast = async (id: string, direction: "up" | "down") => {
    const idx = podcasts.findIndex((p: any) => p.id === id);
    if (idx < 0) return;
    await normalizeAndPersist("podcasts", podcasts, idx, direction, "display_order", qc, ["admin-podcasts", "podcasts"]);
    toast({ title: "Order updated" });
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
                <DeleteButton onConfirm={() => handleDelete(p.id)} label={`"${p.title}"`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Gallery Events Admin (with year field) ----
const GalleryEventsAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", cover_image: "", year: new Date().getFullYear() });
  const [uploadingForGallery, setUploadingForGallery] = useState<string | null>(null);

  const { data: galleryEvents = [], isLoading } = useQuery({
    queryKey: ["admin-gallery-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_events").select("*, gallery_event_images(id, image_url, caption, image_order)").order("display_order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((ge: any) => ({
        ...ge,
        gallery_event_images: (ge.gallery_event_images || []).sort((a: any, b: any) => (a.image_order ?? 0) - (b.image_order ?? 0)),
      }));
    },
  });

  const resetForm = () => { setForm({ title: "", description: "", cover_image: "", year: new Date().getFullYear() }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title) { toast({ title: "Title is required", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, description: form.description || null, cover_image: form.cover_image || null, year: form.year || null };
      if (editing) {
        const { error } = await supabase.from("gallery_events").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery_events").insert(payload);
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-events"] });
      toast({ title: editing ? "Gallery updated" : "Gallery created" });
      resetForm();
    } catch { toast({ title: "Error saving gallery", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("gallery_event_images").delete().eq("gallery_event_id", id);
      await supabase.from("gallery_events").delete().eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-events"] });
      toast({ title: "Gallery deleted" });
    } catch { toast({ title: "Error deleting gallery", variant: "destructive" }); }
  };

  const handleAddImages = async (galleryEventId: string, files: FileList) => {
    if (!files || files.length === 0) return;
    setUploadingForGallery(galleryEventId);
    try {
      const ge = galleryEvents.find((g: any) => g.id === galleryEventId) as any;
      const existingImages = ge?.gallery_event_images || [];
      let maxOrder = existingImages.reduce((max: number, img: any) => Math.max(max, img.image_order ?? 0), 0);

      for (const file of Array.from(files)) {
        maxOrder++;
        const url = await uploadImage("gallery-images", file);
        await supabase.from("gallery_event_images").insert({ gallery_event_id: galleryEventId, image_url: url, image_order: maxOrder });
      }
      qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-event-images"] });
      toast({ title: `${files.length} image(s) added to gallery` });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploadingForGallery(null); }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await supabase.from("gallery_event_images").delete().eq("id", imageId);
      qc.invalidateQueries({ queryKey: ["admin-gallery-events"] });
      qc.invalidateQueries({ queryKey: ["gallery-event-images"] });
      toast({ title: "Image removed" });
    } catch { toast({ title: "Error removing image", variant: "destructive" }); }
  };

  const startEdit = (ge: any) => {
    setForm({ title: ge.title, description: ge.description || "", cover_image: ge.cover_image || "", year: ge.year || new Date().getFullYear() });
    setEditing(ge);
    setShowForm(true);
  };

  const moveGalleryEvent = async (id: string, direction: "up" | "down") => {
    const idx = galleryEvents.findIndex((ge: any) => ge.id === id);
    if (idx < 0) return;
    await normalizeAndPersist("gallery_events", galleryEvents, idx, direction, "display_order", qc, ["admin-gallery-events", "gallery-events"]);
    toast({ title: "Order updated" });
  };

  const moveImage = async (galleryEventId: string, imageId: string, direction: "up" | "down") => {
    const ge = galleryEvents.find((g: any) => g.id === galleryEventId) as any;
    if (!ge) return;
    const imgs = ge.gallery_event_images || [];
    const idx = imgs.findIndex((img: any) => img.id === imageId);
    if (idx < 0) return;
    await normalizeAndPersist("gallery_event_images", imgs, idx, direction, "image_order", qc, ["admin-gallery-events", "gallery-event-images"]);
    toast({ title: "Image order updated" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold">Gallery ({galleryEvents.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" /> Create Gallery</Button>
      </div>
      {showForm && (
        <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="text-sm font-medium block mb-1">Year</label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })} placeholder="e.g. 2024" /></div>
          </div>
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
                    <p className="text-xs text-muted-foreground">{ge.year ? `Year: ${ge.year} · ` : ""}{ge.gallery_event_images?.length || 0} photos</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(ge)}><Edit2 className="h-4 w-4" /></Button>
                  <DeleteButton onConfirm={() => handleDelete(ge.id)} label={`gallery "${ge.title}" and all its images`} />
                </div>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-3">
                {ge.gallery_event_images?.map((img: any, imgIdx: number) => (
                  <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6" disabled={imgIdx === 0} onClick={() => moveImage(ge.id, img.id, "up")}><ArrowUp className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6" disabled={imgIdx === (ge.gallery_event_images?.length || 1) - 1} onClick={() => moveImage(ge.id, img.id, "down")}><ArrowDown className="h-3 w-3" /></Button>
                      <DeleteButton onConfirm={() => handleDeleteImage(img.id)} label="this image" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  id={`gallery-upload-${ge.id}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) handleAddImages(ge.id, files);
                    e.target.value = "";
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploadingForGallery === ge.id}
                  onClick={() => document.getElementById(`gallery-upload-${ge.id}`)?.click()}
                >
                  {uploadingForGallery === ge.id ? <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading...</> : <><Upload className="h-3 w-3 mr-1" /> Add Photos</>}
                </Button>
                <span className="text-xs text-muted-foreground">→ Uploading to: <strong className="text-foreground">{ge.title}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ---- Publications Admin (new) ----
const PublicationsAdmin = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", year: new Date().getFullYear(), description: "", file_url: "", file_type: "pdf", display_order: 0, cover_image: "" });
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: publications = [], isLoading } = useQuery({
    queryKey: ["admin-publications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("publications").select("*").order("display_order", { ascending: true }).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => { setForm({ title: "", year: new Date().getFullYear(), description: "", file_url: "", file_type: "pdf", display_order: 0, cover_image: "" }); setEditing(null); setShowForm(false); };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["application/pdf", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Only PDF and PPT/PPTX files are allowed.", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 20MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("publication-files").upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("publication-files").getPublicUrl(path);
      const fileType = ext === "pdf" ? "pdf" : "pptx";
      setForm({ ...form, file_url: data.publicUrl, file_type: fileType });
      toast({ title: "File uploaded successfully" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!form.title || !form.file_url) { toast({ title: "Title and file are required", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, year: form.year, description: form.description || null, file_url: form.file_url, file_type: form.file_type, display_order: form.display_order };
      if (editing) { const { error } = await supabase.from("publications").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("publications").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-publications"] }); qc.invalidateQueries({ queryKey: ["publications"] });
      toast({ title: editing ? "Publication updated" : "Publication created" }); resetForm();
    } catch { toast({ title: "Error saving publication", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("publications").delete().eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-publications"] }); qc.invalidateQueries({ queryKey: ["publications"] });
      toast({ title: "Publication deleted" });
    } catch { toast({ title: "Error deleting", variant: "destructive" }); }
  };

  const startEdit = (p: any) => {
    setForm({ title: p.title, year: p.year, description: p.description || "", file_url: p.file_url, file_type: p.file_type || "pdf", display_order: p.display_order || 0 });
    setEditing(p); setShowForm(true);
  };

  const movePublication = async (id: string, direction: "up" | "down") => {
    const idx = publications.findIndex((p: any) => p.id === id);
    if (idx < 0) return;
    await normalizeAndPersist("publications", publications, idx, direction, "display_order", qc, ["admin-publications", "publications"]);
    toast({ title: "Order updated" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold">Publications ({publications.length})</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }}><Plus className="h-4 w-4 mr-2" /> Add Publication</Button>
      </div>
      {showForm && (
        <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Title *</label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><label className="text-sm font-medium block mb-1">Year *</label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })} /></div>
          </div>
          <div><label className="text-sm font-medium block mb-1">Description (optional)</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          <div>
            <label className="text-sm font-medium block mb-1">File (PDF or PPTX) *</label>
            <div className="flex items-center gap-3">
              {form.file_url && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <FileText className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">{form.file_type.toUpperCase()} uploaded</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx" className="hidden" onChange={handleFileUpload} />
              <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? <><Loader2 className="h-3 w-3 animate-spin mr-1" /> Uploading...</> : <><Upload className="h-3 w-3 mr-1" /> Upload File</>}
              </Button>
            </div>
          </div>
          <div className="flex gap-2"><Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button><Button variant="outline" onClick={resetForm}>Cancel</Button></div>
        </div>
      )}
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {publications.map((p: any, idx: number) => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-0.5">
                  <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === 0} onClick={() => movePublication(p.id, "up")}><ArrowUp className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === publications.length - 1} onClick={() => movePublication(p.id, "down")}><ArrowDown className="h-3 w-3" /></Button>
                </div>
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-medium">{p.title}</h3>
                  <p className="text-xs text-muted-foreground">{p.year} · {p.file_type?.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={() => startEdit(p)}><Edit2 className="h-4 w-4" /></Button>
                <DeleteButton onConfirm={() => handleDelete(p.id)} label={`"${p.title}"`} />
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
  const [form, setForm] = useState({ name: "", section: "Staff Coordinators", role: "", image_url: "", department: "", linkedin_url: "", display_order: 0 });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => { const { data, error } = await supabase.from("team_members").select("*").order("display_order", { ascending: true }).order("created_at"); if (error) throw error; return data; },
  });

  const resetForm = () => { setForm({ name: "", section: "Staff Coordinators", role: "", image_url: "", department: "", linkedin_url: "", display_order: 0 }); setEditing(null); setShowForm(false); };

  const handleSectionChange = (section: string) => {
    const roles = SECTION_ROLES[section] || [];
    setForm({ ...form, section, role: section === "Staff Coordinators" ? "Staff Coordinator" : (roles[0] || "") });
  };

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    const isStaffCoord = form.section === "Staff Coordinators";
    const role = isStaffCoord ? "Staff Coordinator" : form.role;
    if (!isStaffCoord && !role) { toast({ title: "Role is required", variant: "destructive" }); return; }
    if (form.linkedin_url && !form.linkedin_url.startsWith("http")) { toast({ title: "LinkedIn URL must start with http", variant: "destructive" }); return; }
    const dept = (form.section === "Core" || form.section === "Execom") ? roleToDepartment(role) : null;
    try {
      const payload: any = { name: form.name, role, section: form.section, image_url: form.image_url || null, department: dept, linkedin_url: form.linkedin_url || null, display_order: form.display_order };
      if (editing) { const { error } = await supabase.from("team_members").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("team_members").insert(payload); if (error) throw error; }
      qc.invalidateQueries({ queryKey: ["admin-team"] }); qc.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: editing ? "Member updated" : "Member added" }); resetForm();
    } catch { toast({ title: "Error saving member", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("team_members").delete().eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-team"] }); qc.invalidateQueries({ queryKey: ["team-members"] });
      toast({ title: "Member deleted" });
    } catch { toast({ title: "Error deleting", variant: "destructive" }); }
  };

  const startEdit = (m: any) => {
    setForm({ name: m.name, section: m.section, role: m.role, image_url: m.image_url || "", department: m.department || "", linkedin_url: (m as any).linkedin_url || "", display_order: m.display_order || 0 });
    setEditing(m);
    setShowForm(true);
  };

  const moveMember = async (section: string, id: string, direction: "up" | "down") => {
    const sectionMembers = members.filter((m: any) => m.section === section);
    const idx = sectionMembers.findIndex((m: any) => m.id === id);
    if (idx < 0) return;
    await normalizeAndPersist("team_members", sectionMembers, idx, direction, "display_order", qc, ["admin-team", "team-members"]);
    toast({ title: "Order updated" });
  };

  const roles = SECTION_ROLES[form.section] || [];
  const isStaffCoord = form.section === "Staff Coordinators";

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
            {!isStaffCoord && (
              <div><label className="text-sm font-medium block mb-1">Role *</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {roles.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            )}
          </div>
          <ImageUpload bucket="team-images" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} label="Member Photo" />
          <div><label className="text-sm font-medium block mb-1">LinkedIn Profile URL (optional)</label><Input placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} /></div>
          <div className="flex gap-2"><Button onClick={handleSave}>{editing ? "Update" : "Add"}</Button><Button variant="outline" onClick={resetForm}>Cancel</Button></div>
        </div>
      )}
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {["Staff Coordinators", "Governing Body", "Execom", "Core"].map((section) => {
            const sectionMembers = members.filter((m: any) => m.section === section);
            if (sectionMembers.length === 0) return null;
            return (
              <div key={section} className="mb-6">
                <h3 className="font-display font-semibold text-lg mb-3 text-primary">{section}</h3>
                <div className="space-y-2">
                  {sectionMembers.map((m: any, mIdx: number) => (
                    <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-0.5">
                          <Button size="icon" variant="ghost" className="h-6 w-6" disabled={mIdx === 0} onClick={() => moveMember(section, m.id, "up")}><ArrowUp className="h-3 w-3" /></Button>
                          <Button size="icon" variant="ghost" className="h-6 w-6" disabled={mIdx === sectionMembers.length - 1} onClick={() => moveMember(section, m.id, "down")}><ArrowDown className="h-3 w-3" /></Button>
                        </div>
                        {m.image_url && <img src={m.image_url} alt="" className="h-10 w-10 rounded-full object-cover" />}
                        <div>
                          <h4 className="font-medium text-sm">{m.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {section !== "Staff Coordinators" && m.role}
                            {m.department ? ` · ${m.department}` : ""}
                            {m.linkedin_url ? " · 🔗" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(m)}><Edit2 className="h-4 w-4" /></Button>
                        <DeleteButton onConfirm={() => handleDelete(m.id)} label={`"${m.name}"`} />
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
    } catch { toast({ title: "Error saving popup", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await supabase.from("popups").delete().eq("id", id);
      qc.invalidateQueries({ queryKey: ["admin-popups"] });
      qc.invalidateQueries({ queryKey: ["active-popup"] });
      toast({ title: "Popup deleted" });
    } catch { toast({ title: "Error deleting popup", variant: "destructive" }); }
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
                <DeleteButton onConfirm={() => handleDelete(p.id)} label={`popup "${p.title}"`} />
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
