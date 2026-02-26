import { useState } from "react";
import { Bell, Plus, X, Clock, Edit3 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  text: string;
  time: string;
  enabled: boolean;
}

const defaultReminders: Reminder[] = [
  { id: "1", text: "Team standup", time: "09:00", enabled: true },
  { id: "2", text: "Submit report", time: "14:00", enabled: true },
  { id: "3", text: "Call client", time: "16:30", enabled: false },
];

function loadReminders(): Reminder[] {
  const saved = localStorage.getItem("reminders");
  return saved ? JSON.parse(saved) : defaultReminders;
}

export default function RemindersCard() {
  const [reminders, setReminders] = useState<Reminder[]>(loadReminders);
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const save = (updated: Reminder[]) => {
    setReminders(updated);
    localStorage.setItem("reminders", JSON.stringify(updated));
  };

  const toggleReminder = (id: string) => {
    save(reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const addReminder = () => {
    if (!newText.trim()) return;
    save([...reminders, { id: Date.now().toString(), text: newText, time: newTime || "12:00", enabled: true }]);
    toast({ title: "Reminder added", description: newText });
    setNewText("");
    setNewTime("");
    setAdding(false);
  };

  const removeReminder = (id: string) => {
    save(reminders.filter((r) => r.id !== id));
    toast({ title: "Reminder removed" });
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Reminders
        </h3>
        <button
          onClick={() => setAdding(true)}
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {adding && (
        <div className="flex flex-col gap-2 mb-4 p-3 rounded-lg bg-muted animate-fade-in">
          <input
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Reminder text..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addReminder()}
            autoFocus
          />
          <div className="flex gap-2">
            <input
              type="time"
              className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
            <button onClick={addReminder} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Add</button>
            <button onClick={() => setAdding(false)} className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">Cancel</button>
          </div>
        </div>
      )}

      <ul className="space-y-2">
        {reminders.map((r) => (
          <li key={r.id} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted transition-colors group">
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${r.enabled ? "text-foreground" : "text-muted-foreground"}`}>{r.text}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                {formatTime(r.time)}
              </p>
            </div>
            <Switch checked={r.enabled} onCheckedChange={() => toggleReminder(r.id)} />
            <button
              onClick={() => removeReminder(r.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
        {reminders.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No reminders yet</p>
        )}
      </ul>
    </div>
  );
}
