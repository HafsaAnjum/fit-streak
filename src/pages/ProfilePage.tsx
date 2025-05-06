
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Settings, Edit, ChevronRight, User, LogOut, Award, Smartphone, Heart, Share } from "lucide-react";
import Navigation from "@/components/Navigation";
import StreakDisplay from "@/components/StreakDisplay";

const ProfilePage = () => {
  return (
    <>
      <div className="container max-w-7xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Profile</h1>
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </header>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-0 pt-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-500 border-2 border-background"></div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">Sarah Johnson</h2>
                  <p className="text-muted-foreground">Fitness Enthusiast</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">Workouts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-xs text-muted-foreground">Active Days</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">7</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">Weight Loss Goal</span>
                  <span className="text-muted-foreground">8 lbs to go</span>
                </div>
                <Progress value={60} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>Started: 150 lbs</span>
                  <span>Goal: 134 lbs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="m-0">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Fitness Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <StatItem label="Average Daily Steps" value="7,842" />
                    <StatItem label="Average Daily Calories" value="427 kcal" />
                    <StatItem label="Average Active Minutes" value="48 min" />
                    <StatItem label="Average Resting Heart Rate" value="72 bpm" />
                    <StatItem label="Weekly Distance" value="23.6 km" />
                  </div>
                </CardContent>
              </Card>
              
              <StreakDisplay />
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="m-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <AchievementCard title="7-Day Streak" icon={<Award />} earned={true} date="May 2, 2025" />
              <AchievementCard title="Marathon Runner" icon={<Award />} earned={true} date="Apr 28, 2025" />
              <AchievementCard title="Early Bird" icon={<Award />} earned={true} date="Apr 25, 2025" />
              <AchievementCard title="Power Lifter" icon={<Award />} earned={false} progress={65} />
              <AchievementCard title="Century Club" icon={<Award />} earned={false} progress={23} />
              <AchievementCard title="Night Owl" icon={<Award />} earned={false} progress={45} />
              <AchievementCard title="Mountain Climber" icon={<Award />} earned={false} progress={10} />
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="m-0">
            <Card>
              <CardContent className="p-0 divide-y">
                <SettingsItem 
                  icon={<Smartphone className="h-5 w-5 text-primary" />}
                  label="Connect Health Data"
                  description="Link Apple Health or Google Fit"
                />
                <SettingsItem 
                  icon={<Heart className="h-5 w-5 text-red-500" />}
                  label="Health Preferences"
                  description="Customize your health metrics"
                />
                <SettingsItem 
                  icon={<Share className="h-5 w-5 text-blue-500" />}
                  label="Share Progress"
                  description="Connect social accounts"
                />
                <SettingsItem 
                  icon={<LogOut className="h-5 w-5 text-muted-foreground" />}
                  label="Log Out"
                  description="Sign out of your account"
                  showArrow={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </>
  );
};

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem = ({ label, value }: StatItemProps) => {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0 last:pb-0">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

interface AchievementCardProps {
  title: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  date?: string;
}

const AchievementCard = ({ title, icon, earned, progress, date }: AchievementCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className={`p-4 flex flex-col items-center text-center ${earned ? '' : 'opacity-50'}`}>
        <div className={`p-3 rounded-full mb-3 ${earned ? 'fitness-gradient text-white' : 'bg-muted text-muted-foreground'}`}>
          {icon}
        </div>
        <h3 className="font-medium text-sm">{title}</h3>
        {earned ? (
          <p className="text-xs text-muted-foreground mt-1">Earned {date}</p>
        ) : (
          <div className="w-full mt-2">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
          </div>
        )}
      </div>
    </Card>
  );
};

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  showArrow?: boolean;
}

const SettingsItem = ({ icon, label, description, showArrow = true }: SettingsItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
      <div className="flex items-center">
        <div className="mr-4">
          {icon}
        </div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {showArrow && (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
};

export default ProfilePage;
