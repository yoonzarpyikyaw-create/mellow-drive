import { useState } from "react";
import { BookOpen, Plus, Heart, Pin, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotes } from "@/hooks/useNotes";
import { toast } from "@/hooks/use-toast";

export default function NotebookPreviewCard() {
  const { notes, addNote } = useNotes();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    addNote(title, content);
    toast({ title: "Note saved", description: title });
    setTitle("");
    setContent("");
    setAdding(false);
  };

  const latestNotes = [...notes]
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Notebook
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdding(true)}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          <Link to="/notebook" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
      </div>

      {/* Quick add note */}
      {adding && (
        <div className="mb-4 p-3 rounded-lg bg-muted space-y-2">
          <input
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <input
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Save</button>
            <button onClick={() => setAdding(false)} className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      {!adding && (
        <div className="mb-4">
          <input
            className="w-full bg-muted border-none rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="What's on your mind?"
            onFocus={() => setAdding(true)}
            readOnly
          />
        </div>
      )}

      {/* Recent notes */}
      <div className="space-y-3">
        {latestNotes.map((note) => (
          <Link key={note.id} to="/notebook" className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
              {note.pinned && <Pin className="w-3 h-3 text-primary" />}
              <p className="text-sm font-medium text-foreground line-clamp-1">{note.title}</p>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{note.content}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{note.createdAt}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Heart className="w-3 h-3" />
                {note.likes}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
