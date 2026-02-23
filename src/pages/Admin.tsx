import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Edit2, LogOut, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ADMIN_PASSWORD = "orators2024";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!authenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-full max-w-sm p-8 rounded-xl border border-border space-y-4">
          <h1 className="font-display text-2xl font-bold text-center">Admin Login</h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (password === ADMIN_PASSWORD) {
              setAuthenticated(true);
            } else {
              toast({ title: "Wrong password", variant: "destructive" });
            }
          }} className="space-y-4">
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
          <TabsList className="mb-6">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="events"><EventsAdmin /></TabsContent>
          <TabsContent value="podcasts"><PodcastsAdmin /></TabsContent>
          <TabsContent value="gallery"><GalleryAdmin /></TabsContent>
          <TabsContent value="subscribers"><SubscribersView /></TabsContent>
          <TabsContent value="applications"><ApplicationsView /></TabsContent>
          <TabsContent value="messages"><MessagesView /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ---- Events Admin ----
const EventsAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", category: "Workshops", image: "", slug: "" });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setForm({ title: "", description: "", date: "", category: "Workshops", image: "", slug: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.date || !form.slug) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }
    try {
      if (editing) {
        const { error } = await supabase.from("events").update({
          title: form.title, description: form.description, date: form.date,
          category: form.category, image: form.image || null, slug: form.slug,
        }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert({
          title: form.title, description: form.description, date: form.date,
          category: form.category, image: form.image || null, slug: form.slug,
        });
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: editing ? "Event updated" : "Event created" });
      resetForm();
    } catch {
      toast({ title: "Error saving event", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Event deleted" });
    }
  };

  const startEdit = (event: any) => {
    setForm({
      title: event.title, description: event.description || "", date: event.date?.split("T")[0] || "",
      category: event.category, image: event.image || "", slug: event.slug,
    });
    setEditing(event);
    setShowForm(true);
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
          <div><label className="text-sm font-medium block mb-1">Image URL</label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {events.map((e: any) => (
            <div key={e.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <h3 className="font-medium">{e.title}</h3>
                <p className="text-xs text-muted-foreground">{e.category} · {e.date?.split("T")[0]}</p>
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
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", embed_url: "", image: "", slug: "" });

  const { data: podcasts = [], isLoading } = useQuery({
    queryKey: ["admin-podcasts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("podcasts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => { setForm({ title: "", description: "", embed_url: "", image: "", slug: "" }); setEditing(null); setShowForm(false); };

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast({ title: "Fill required fields", variant: "destructive" }); return; }
    try {
      const payload = { title: form.title, description: form.description || null, embed_url: form.embed_url || null, image: form.image || null, slug: form.slug };
      if (editing) {
        const { error } = await supabase.from("podcasts").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("podcasts").insert(payload);
        if (error) throw error;
      }
      queryClient.invalidateQueries({ queryKey: ["admin-podcasts"] });
      queryClient.invalidateQueries({ queryKey: ["podcasts"] });
      toast({ title: editing ? "Podcast updated" : "Podcast created" });
      resetForm();
    } catch { toast({ title: "Error saving", variant: "destructive" }); }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("podcasts").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-podcasts"] });
    queryClient.invalidateQueries({ queryKey: ["podcasts"] });
    toast({ title: "Deleted" });
  };

  const startEdit = (p: any) => {
    setForm({ title: p.title, description: p.description || "", embed_url: p.embed_url || "", image: p.image || "", slug: p.slug });
    setEditing(p); setShowForm(true);
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
          <div><label className="text-sm font-medium block mb-1">Embed URL (Spotify/YouTube)</label><Input value={form.embed_url} onChange={(e) => setForm({ ...form, embed_url: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Image URL</label><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
          <div><label className="text-sm font-medium block mb-1">Description</label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>{editing ? "Update" : "Create"}</Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
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

// ---- Gallery Admin ----
const GalleryAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image_url: "", category: "Events", caption: "" });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleSave = async () => {
    if (!form.image_url) { toast({ title: "Image URL required", variant: "destructive" }); return; }
    const { error } = await supabase.from("gallery").insert({ image_url: form.image_url, category: form.category, caption: form.caption || null });
    if (!error) {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      toast({ title: "Added to gallery" });
      setForm({ image_url: "", category: "Events", caption: "" });
      setShowForm(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("gallery").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery"] });
    toast({ title: "Deleted" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold">Gallery ({items.length})</h2>
        <Button onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-2" /> Add Image</Button>
      </div>
      {showForm && (
        <div className="rounded-xl border border-border p-6 mb-6 space-y-4">
          <div><label className="text-sm font-medium block mb-1">Image URL *</label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-sm font-medium block mb-1">Category</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option>Events</option><option>Workshops</option><option>Competitions</option><option>general</option>
              </select>
            </div>
            <div><label className="text-sm font-medium block mb-1">Caption</label><Input value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} /></div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Add</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
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

// ---- Read-only views ----
const SubscribersView = () => {
  const { data: subs = [], isLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Newsletter Subscribers ({subs.length})</h2>
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-2">
          {subs.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <span className="text-sm">{s.email}</span>
              <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ApplicationsView = () => {
  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("join_applications").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Applications ({apps.length})</h2>
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-3">
          {apps.map((a: any) => (
            <div key={a.id} className="p-4 rounded-lg border border-border space-y-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{a.first_name} {a.last_name}</h3>
                <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">{a.email} · {a.phone}</p>
              <p className="text-sm"><span className="text-primary font-medium">{a.academic_year}</span> · {a.debate_experience}</p>
              {a.why_join && <p className="text-sm text-muted-foreground italic">"{a.why_join}"</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MessagesView = () => {
  const { data: msgs = [], isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Contact Messages ({msgs.length})</h2>
      {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : (
        <div className="space-y-3">
          {msgs.map((m: any) => (
            <div key={m.id} className="p-4 rounded-lg border border-border space-y-1">
              <div className="flex justify-between">
                <h3 className="font-medium">{m.name}</h3>
                <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">{m.email} · {m.subject}</p>
              <p className="text-sm">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
