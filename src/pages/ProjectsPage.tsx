import { useState, useEffect } from "react";
import { Plus, Trash2, X, Users } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  team: string[];
}

const defaultProjects: Project[] = [
  { id: "1", title: "Website Redesign", description: "Complete overhaul of the company website with new branding", progress: 72, deadline: "2026-03-15", team: ["A", "B", "C"] },
  { id: "2", title: "Mobile App MVP", description: "First version of the cross-platform mobile application", progress: 45, deadline: "2026-04-01", team: ["D", "E"] },
  { id: "3", title: "Marketing Campaign", description: "Q2 digital marketing campaign across social platforms", progress: 10, deadline: "2026-03-20", team: ["F", "G", "H"] },
  { id: "4", title: "API Integration", description: "Third-party API integration for payment processing", progress: 30, deadline: "2026-03-10", team: ["A", "D"] },
  { id: "5", title: "Data Pipeline", description: "Automated data processing and reporting pipeline", progress: 85, deadline: "2026-02-28", team: ["B", "E", "F"] },
  { id: "6", title: "User Research", description: "User interviews and usability testing for new features", progress: 60, deadline: "2026-03-05", team: ["C"] },
];

const avatarColors = ["bg-primary", "bg-success", "bg-warning", "bg-destructive", "bg-chart-4"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : defaultProjects;
  });
  const [selected, setSelected] = useState<Project | null>(null);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (!newTitle.trim()) return;
    setProjects((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTitle, description: newDesc, progress: 0, deadline: "2026-04-01", team: ["A"] },
    ]);
    setNewTitle("");
    setNewDesc("");
    setAdding(false);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelected(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">{projects.length} projects</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {adding && (
        <div className="dashboard-card mb-5">
          <div className="space-y-3">
            <input
              className="w-full bg-muted rounded-lg px-4 py-2 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Project title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="w-full bg-muted rounded-lg px-4 py-2 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              rows={2}
              placeholder="Description..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={addProject} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                Create
              </button>
              <button onClick={() => setAdding(false)} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="dashboard-card cursor-pointer hover:scale-[1.01] transition-transform"
            onClick={() => setSelected(project)}
          >
            <h3 className="text-base font-semibold text-foreground mb-1">{project.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

            <div className="progress-bar mb-1">
              <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mb-3">{project.progress}% complete</p>

            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.team.map((member, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground border-2 border-card ${avatarColors[i % avatarColors.length]}`}
                  >
                    {member}
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{project.deadline}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/30" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{selected.description}</p>
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Progress</p>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${selected.progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selected.progress}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-sm font-medium text-foreground">{selected.deadline}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Team</p>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{selected.team.length} members</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteProject(selected.id)}
              className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
