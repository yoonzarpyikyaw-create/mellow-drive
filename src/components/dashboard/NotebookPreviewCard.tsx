import { useState, useEffect } from "react";
import { BookOpen, MessageCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface Note {
  id: string;
  text: string;
  date: string;
  likes: number;
}

export default function NotebookPreviewCard() {
  const [quickNote, setQuickNote] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("quickNotes");
    return saved
      ? JSON.parse(saved)
      : [
          { id: "1", text: "Design system colors need updating for Q2 rebrand", date: "Today", likes: 3 },
          { id: "2", text: "Look into new charting library options", date: "Yesterday", likes: 1 },
        ];
  });

  useEffect(() => {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (!quickNote.trim()) return;
    setNotes((prev) => [
      { id: Date.now().toString(), text: quickNote, date: "Just now", likes: 0 },
      ...prev,
    ]);
    setQuickNote("");
  };

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          Notebook
        </h3>
        <Link to="/notebook" className="text-xs text-primary hover:underline">
          View all
        </Link>
      </div>

      {/* Quick note input */}
      <div className="mb-4">
        <input
          className="w-full bg-muted border-none rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="What's on your mind?"
          value={quickNote}
          onChange={(e) => setQuickNote(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
        />
      </div>

      {/* Recent notes */}
      <div className="space-y-3">
        {notes.slice(0, 3).map((note) => (
          <div key={note.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <p className="text-sm text-foreground line-clamp-2">{note.text}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">{note.date}</span>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-3.5 h-3.5" />
                  {note.likes}
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
