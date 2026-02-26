import { useState, useEffect } from "react";
import { Plus, Search, Pin, Trash2, X, Edit3 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  pinned: boolean;
  createdAt: string;
}

const defaultNotes: Note[] = [
  { id: "1", title: "Q2 Planning", content: "Need to finalize the roadmap by end of month. Key priorities include mobile app launch and API refactor.", tag: "Work", pinned: true, createdAt: "2026-02-25" },
  { id: "2", title: "Book Recommendations", content: "Atomic Habits, Deep Work, The Pragmatic Programmer", tag: "Personal", pinned: false, createdAt: "2026-02-24" },
  { id: "3", title: "Meeting Notes", content: "Discussed new feature requirements with the team. Action items: create wireframes, update timeline.", tag: "Work", pinned: false, createdAt: "2026-02-23" },
  { id: "4", title: "Recipe Ideas", content: "Try making homemade pasta this weekend. Need semolina flour and eggs.", tag: "Personal", pinned: true, createdAt: "2026-02-22" },
];

const tagColors: Record<string, string> = {
  Work: "bg-primary/10 text-primary",
  Personal: "bg-success/10 text-success",
  Ideas: "bg-warning/10 text-warning",
};

export default function NotebookPage() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("notebook");
    return saved ? JSON.parse(saved) : defaultNotes;
  });
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Note | null>(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Work");

  useEffect(() => {
    localStorage.setItem("notebook", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!title.trim()) return;
    const note: Note = {
      id: Date.now().toString(),
      title,
      content,
      tag,
      pinned: false,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setNotes((prev) => [note, ...prev]);
    setTitle("");
    setContent("");
    setAdding(false);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const saveEdit = () => {
    if (!editing) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === editing.id ? { ...editing } : n))
    );
    setEditing(null);
  };

  const filtered = notes
    .filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notebook</h1>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add note */}
      {adding && (
        <div className="dashboard-card mb-5">
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
            <button onClick={addNote} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Save</button>
            <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Notes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <button onClick={() => deleteNote(note.id)} className="p-1 rounded hover:bg-muted">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{note.content}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[note.tag] || "bg-muted text-muted-foreground"}`}>
                {note.tag}
              </span>
              <span className="text-xs text-muted-foreground">{note.createdAt}</span>
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
            <div className="flex gap-2">
              <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Save</button>
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
