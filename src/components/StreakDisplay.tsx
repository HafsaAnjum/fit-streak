
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, Trophy, Star, Medal, Flame } from "lucide-react";

const mockAchievements = [
  {
    id: 1,
    name: "7-Day Streak",
    icon: <Flame className="h-5 w-5" />,
    earned: true,
    date: "May 2, 2025",
  },
  {
    id: 2,
    name: "Marathon Runner",
    icon: <Trophy className="h-5 w-5" />,
    earned: true,
    date: "Apr 28, 2025",
  },
  {
    id: 3,
    name: "Early Bird",
    icon: <Star className="h-5 w-5" />,
    earned: true,
    date: "Apr 25, 2025",
  },
  {
    id: 4,
    name: "Power Lifter",
    icon: <Award className="h-5 w-5" />,
    earned: false,
    progress: 65,
  },
  {
    id: 5,
    name: "Century Club",
    icon: <Medal className="h-5 w-5" />,
    earned: false,
    progress: 23,
  },
];

const StreakDisplay = () => {
  const currentStreak = 7;
  const bestStreak = 14;
  const streakPercentage = (currentStreak / 30) * 100; // Showing percentage of monthly goal

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-full fitness-gradient text-white">
            <Flame className="h-4 w-4" />
          </div>
          <CardTitle className="text-lg font-medium">Activity Streak</CardTitle>
        </div>
        <CardDescription>Keep your workout momentum going</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center pt-2 pb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-8 border-muted flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{currentStreak}</div>
                <div className="text-xs text-muted-foreground">days</div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-8 border-primary border-t-transparent border-r-transparent border-b-transparent transform -rotate-90" 
                 style={{ 
                   transform: `rotate(${streakPercentage * 3.6 - 90}deg)`,
                   transition: "transform 1s ease"
                 }}>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
              <div className="bg-yellow-500 text-white p-1 rounded-full">
                <Flame className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-1">
          <div>
            <p className="text-muted-foreground">Best Streak</p>
            <p className="font-medium">{bestStreak} days</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">Monthly Goal</p>
            <p className="font-medium">30 days</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <p className="text-sm font-medium">Recent Achievements</p>
          <div className="grid grid-cols-3 gap-2">
            {mockAchievements.slice(0, 3).map((achievement) => (
              <div 
                key={achievement.id}
                className="aspect-square flex flex-col items-center justify-center rounded-lg bg-secondary/50 p-2 text-center"
              >
                <div className={`p-2 rounded-full ${achievement.earned ? 'fitness-gradient text-white' : 'bg-muted text-muted-foreground'}`}>
                  {achievement.icon}
                </div>
                <p className="text-xs font-medium mt-1 line-clamp-1">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
