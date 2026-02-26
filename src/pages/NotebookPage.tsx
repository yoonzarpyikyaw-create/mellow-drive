import { useState } from "react";
import { Plus, Search, Pin, Trash2, X, Edit3, Grid, List, Heart, MessageCircle } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { toast } from "@/hooks/use-toast";

const tagColors: Record<string, string> = {
  Work: "bg-primary/10 text-primary",
  Personal: "bg-success/10 text-success",
  Ideas: "bg-warning/10 text-warning",
};

export default function NotebookPage() {
  const { notes, addNote, deleteNote, togglePin, updateNote } = useNotes();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<typeof notes[0] | null>(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Work");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterTag, setFilterTag] = useState<string>("All");

  const handleAdd = () => {
    if (!title.trim()) return;
    addNote(title, content, tag);
    toast({ title: "Note saved", description: title });
    setTitle("");
    setContent("");
    setAdding(false);
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    toast({ title: "Note deleted" });
  };

  const saveEdit = () => {
    if (!editing) return;
    updateNote(editing);
    toast({ title: "Note updated" });
    setEditing(null);
  };

  const likeNote = (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (note) updateNote({ ...note, likes: note.likes + 1 });
  };

  const filtered = notes
    .filter((n) => filterTag === "All" || n.tag === filterTag)
    .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notebook</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Note
          </button>
        </div>
      </div>

      {/* Search + tag filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {["All", "Work", "Personal", "Ideas"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTag(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterTag === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Add note */}
      {adding && (
        <div className="dashboard-card mb-5 animate-fade-in">
          <input
            className="w-full bg-muted rounded-lg px-4 py-2 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-3"
            rows={4}
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2 items-center">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground border-none focus:outline-none"
            >
              <option>Work</option>
              <option>Personal</option>
              <option>Ideas</option>
            </select>
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Save</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-3"}>
        {filtered.map((note) => (
          <div key={note.id} className="dashboard-card group">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {note.pinned && <Pin className="w-3.5 h-3.5 text-primary" />}
                <h3 className="text-sm font-semibold text-foreground">{note.title}</h3>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => togglePin(note.id)} className="p-1 rounded hover:bg-muted">
                  <Pin className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => setEditing({ ...note })} className="p-1 rounded hover:bg-muted">
                  <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(note.id)} className="p-1 rounded hover:bg-muted">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{note.content}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[note.tag] || "bg-muted text-muted-foreground"}`}>
                {note.tag}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => likeNote(note.id)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Heart className="w-3.5 h-3.5" />
                  {note.likes}
                </button>
                <span className="text-xs text-muted-foreground">{note.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No notes found</p>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/30" onClick={() => setEditing(null)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Edit Note</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              className="w-full bg-muted rounded-lg px-4 py-2 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50 mb-3"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            />
            <textarea
              className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-3"
              rows={5}
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
            />
            <div className="flex gap-2 items-center">
              <select
                value={editing.tag}
                onChange={(e) => setEditing({ ...editing, tag: e.target.value })}
                className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground border-none focus:outline-none"
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Ideas</option>
              </select>
              <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Save</button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
