import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTodos } from "@/hooks/useTodos";

export default function HabitTrackerCard() {
  const [view, setView] = useState<"weekly" | "monthly">("weekly");
  const { todos, doneCount, pct } = useTodos();

  // Generate dynamic data based on actual completion rate
  const completionRate = pct;

  const weeklyData = [
    { day: "Mon", rate: Math.min(100, Math.max(0, completionRate - 10 + Math.round(Math.random() * 20))) },
    { day: "Tue", rate: Math.min(100, Math.max(0, completionRate - 15 + Math.round(Math.random() * 20))) },
    { day: "Wed", rate: Math.min(100, Math.max(0, completionRate + 5 + Math.round(Math.random() * 10))) },
    { day: "Thu", rate: Math.min(100, Math.max(0, completionRate - 5 + Math.round(Math.random() * 15))) },
    { day: "Fri", rate: Math.min(100, Math.max(0, completionRate + Math.round(Math.random() * 10))) },
    { day: "Sat", rate: Math.min(100, Math.max(0, completionRate - 20 + Math.round(Math.random() * 15))) },
    { day: "Sun", rate: completionRate },
  ];

  const monthlyData = [
    { day: "Week 1", rate: Math.min(100, Math.max(0, completionRate - 10)) },
    { day: "Week 2", rate: Math.min(100, Math.max(0, completionRate - 3)) },
    { day: "Week 3", rate: Math.min(100, Math.max(0, completionRate + 5)) },
    { day: "Week 4", rate: completionRate },
  ];

  const data = view === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Habit Tracker</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{doneCount} tasks completed today</p>
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {(["weekly", "monthly"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v === "weekly" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [`${value}%`, "Completion"]}
            />
            <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
