import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Project {
  id: string;
  name: string;
  progress: number;
  status: "in-progress" | "upcoming";
}

const defaultProjects: Project[] = [
  { id: "1", name: "Website Redesign", progress: 72, status: "in-progress" },
  { id: "2", name: "Mobile App MVP", progress: 45, status: "in-progress" },
  { id: "3", name: "Marketing Campaign", progress: 0, status: "upcoming" },
  { id: "4", name: "API Integration", progress: 0, status: "upcoming" },
];

export default function ProjectsOverviewCard() {
  const [projects] = useState(defaultProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const inProgress = projects.filter((p) => p.status === "in-progress");
  const upcoming = projects.filter((p) => p.status === "upcoming");

  return (
    <div className="dashboard-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Projects Overview</h3>
        <button className="text-primary hover:text-primary/80 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            In Progress
          </h4>
          <div className="space-y-3">
            {inProgress.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <div className="mt-2 progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${p.progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.progress}%</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Upcoming
          </h4>
          <div className="space-y-3">
            {upcoming.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Not started</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/30" onClick={() => setSelectedProject(null)}>
          <div className="bg-card rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">{selectedProject.name}</h3>
              <button onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-sm font-medium text-foreground capitalize">{selectedProject.status.replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progress</p>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${selectedProject.progress}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{selectedProject.progress}% complete</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
