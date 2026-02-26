import { Settings as SettingsIcon, User, Bell, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Settings
        </h1>
      </div>

      <div className="space-y-5">
        {/* Profile */}
        <div className="dashboard-card">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <User className="w-4 h-4" />
            Profile
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <input
                className="w-full mt-1 bg-muted rounded-lg px-4 py-2 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                defaultValue="Alex Johnson"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <input
                className="w-full mt-1 bg-muted rounded-lg px-4 py-2 text-sm text-foreground border-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                defaultValue="alex@example.com"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard-card">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about reminders and deadlines</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email Digest</p>
                <p className="text-xs text-muted-foreground">Weekly summary of your productivity</p>
              </div>
              <Switch checked={emailDigest} onCheckedChange={setEmailDigest} />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="dashboard-card">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4" />
            Appearance
          </h3>
          <p className="text-sm text-muted-foreground">Theme customization coming soon.</p>
        </div>
      </div>
    </div>
  );
}
