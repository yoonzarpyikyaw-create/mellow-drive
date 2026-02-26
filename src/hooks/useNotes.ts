import { useState, useEffect, useCallback } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  pinned: boolean;
  createdAt: string;
  likes: number;
}

const defaultNotes: Note[] = [
  { id: "1", title: "Q2 Planning", content: "Need to finalize the roadmap by end of month. Key priorities include mobile app launch and API refactor.", tag: "Work", pinned: true, createdAt: "2026-02-25", likes: 3 },
  { id: "2", title: "Book Recommendations", content: "Atomic Habits, Deep Work, The Pragmatic Programmer", tag: "Personal", pinned: false, createdAt: "2026-02-24", likes: 1 },
  { id: "3", title: "Meeting Notes", content: "Discussed new feature requirements with the team. Action items: create wireframes, update timeline.", tag: "Work", pinned: false, createdAt: "2026-02-23", likes: 0 },
  { id: "4", title: "Recipe Ideas", content: "Try making homemade pasta this weekend. Need semolina flour and eggs.", tag: "Personal", pinned: true, createdAt: "2026-02-22", likes: 2 },
];

function loadNotes(): Note[] {
  const saved = localStorage.getItem("notebook");
  return saved ? JSON.parse(saved) : defaultNotes;
}

function saveNotes(notes: Note[]) {
  localStorage.setItem("notebook", JSON.stringify(notes));
  window.dispatchEvent(new Event("notes-updated"));
}

export function useNotes() {
  const [notes, setNotesState] = useState<Note[]>(loadNotes);

  const setNotes = useCallback((updater: Note[] | ((prev: Note[]) => Note[])) => {
    setNotesState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveNotes(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = () => setNotesState(loadNotes());
    window.addEventListener("notes-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("notes-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const addNote = useCallback((title: string, content: string, tag = "Work") => {
    if (!title.trim()) return;
    setNotes((prev) => [
      {
        id: Date.now().toString(),
        title,
        content,
        tag,
        pinned: false,
        createdAt: new Date().toISOString().split("T")[0],
        likes: 0,
      },
      ...prev,
    ]);
  }, [setNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, [setNotes]);

  const togglePin = useCallback((id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }, [setNotes]);

  const updateNote = useCallback((updated: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  }, [setNotes]);

  return { notes, setNotes, addNote, deleteNote, togglePin, updateNote };
}
