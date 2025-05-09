
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Award, Flame, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  title: string;
  description: string;
  date?: string;
  icon?: React.ReactNode;
  color?: string;
  highlight?: boolean;
}

interface ActivityAchievementsProps {
  streak: number;
  achievements: Achievement[];
  loading: boolean;
}

const ActivityAchievements = ({ streak, achievements, loading }: ActivityAchievementsProps) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-amber-500" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Current Streak */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">Current Streak</h4>
                <p className="text-muted-foreground text-sm">Keep it going!</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-500">{streak} day{streak !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="space-y-4 mt-4">
          {achievements.map((achievement, idx) => (
            <div 
              key={idx}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                achievement.highlight 
                  ? 'bg-gradient-to-r from-primary/10 to-purple-500/10' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full ${achievement.color || 'bg-blue-100'} flex items-center justify-center`}>
                {achievement.icon || <Award className="h-5 w-5 text-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{achievement.title}</h4>
                  {achievement.date && (
                    <Badge variant="outline" className="text-xs">
                      {achievement.date}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityAchievements;
