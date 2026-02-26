import DailyRoutineCard from "@/components/dashboard/DailyRoutineCard";
import RemindersCard from "@/components/dashboard/RemindersCard";
import HabitTrackerCard from "@/components/dashboard/HabitTrackerCard";
import ProjectsOverviewCard from "@/components/dashboard/ProjectsOverviewCard";
import NotebookPreviewCard from "@/components/dashboard/NotebookPreviewCard";

const DashboardPage = () => {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{greeting()} 👋</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's what's happening today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <DailyRoutineCard />
        <RemindersCard />
        <HabitTrackerCard />
        <ProjectsOverviewCard />
        <NotebookPreviewCard />
      </div>
    </div>
  );
};

export default DashboardPage;
