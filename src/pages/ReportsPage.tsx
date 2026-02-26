import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, CheckCircle2, Flame, Target } from "lucide-react";

const weeklyData = [
  { day: "Mon", tasks: 8, completed: 6 },
  { day: "Tue", tasks: 10, completed: 7 },
  { day: "Wed", tasks: 6, completed: 6 },
  { day: "Thu", tasks: 9, completed: 5 },
  { day: "Fri", tasks: 7, completed: 7 },
  { day: "Sat", tasks: 4, completed: 3 },
  { day: "Sun", tasks: 3, completed: 2 },
];

const monthlyTrend = [
  { week: "W1", rate: 72 },
  { week: "W2", rate: 81 },
  { week: "W3", rate: 68 },
  { week: "W4", rate: 88 },
];

const stats = [
  { label: "Tasks Completed", value: "142", icon: CheckCircle2, color: "text-success" },
  { label: "Completion Rate", value: "84%", icon: Target, color: "text-primary" },
  { label: "Current Streak", value: "12 days", icon: Flame, color: "text-warning" },
  { label: "Productivity Score", value: "A+", icon: TrendingUp, color: "text-primary" },
];

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">Your productivity insights</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-card flex items-center gap-4">
            <div className={`${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Task Completion */}
        <div className="dashboard-card">
          <h3 className="text-base font-semibold text-foreground mb-4">Weekly Task Completion</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="tasks" fill="hsl(var(--border))" radius={[4, 4, 0, 0]} name="Total" />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="dashboard-card">
          <h3 className="text-base font-semibold text-foreground mb-4">Monthly Completion Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Rate"]}
                />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 5, fill: "hsl(var(--success))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
