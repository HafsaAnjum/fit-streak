
import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Navigation from "@/components/Navigation";
import { Loader2, Moon, Settings as SettingsIcon, Sun, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { settings, loading, updateSettings } = useUserSettings();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const handleClearData = async () => {
    toast.info("This feature is not yet implemented");
    // This would typically delete or reset user activity data
    // Implementation would depend on your specific data model
  };

  return (
    <div className="container max-w-3xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <SettingsIcon className="h-6 w-6 text-muted-foreground" />
      </div>

      <Tabs defaultValue="preferences" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how FitTrack looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading preferences...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={theme}
                      onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}
                    >
                      <SelectTrigger id="theme" className="w-full">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading preferences...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={settings?.notifications_enabled ?? true}
                    onCheckedChange={(checked) => updateSettings({ notifications_enabled: checked })}
                  />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>
                Manage your data and privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading preferences...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public-profile"
                      checked={settings?.public_profile ?? false}
                      onCheckedChange={(checked) => updateSettings({ public_profile: checked })}
                    />
                    <Label htmlFor="public-profile">Public profile</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, your profile and achievements will be visible to other users.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View and manage your account details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Email</Label>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
              <Separator />
              <div className="pt-4 space-y-4">
                <Button
                  variant="outline"
                  onClick={handleClearData}
                  className="w-full sm:w-auto"
                >
                  Clear Activity Data
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full sm:w-auto"
                >
                  Log Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Feedback</CardTitle>
              <CardDescription>
                Help us improve by sharing your thoughts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeedbackForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Navigation />
    </div>
  );
};

export default SettingsPage;
