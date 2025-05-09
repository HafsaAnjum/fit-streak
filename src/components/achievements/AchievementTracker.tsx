
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Medal, Flame, Footprints, Dumbbell, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { MilestoneService, UserMilestone } from "@/services/MilestoneService";
import { StreakService, StreakData } from "@/services/StreakService";

const AchievementTracker: React.FC = () => {
  const [achievements, setAchievements] = useState<UserMilestone[]>([]);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    setLoading(true);
    try {
      // Load achievements
      const userAchievements = await MilestoneService.getUserMilestones();
      setAchievements(userAchievements);
      
      // Load streak
      const userStreak = await StreakService.getUserStreak();
      setStreak(userStreak);
      
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="mr-2 p-1.5 rounded-md bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg font-medium">Achievements & Streaks</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Streak Display */}
            <StreakDisplay streak={streak} />
            
            {/* Achievement Categories */}
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="steps">Steps</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="streak">Streaks</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.map(achievement => (
                    <AchievementCard key={achievement.milestone_id} achievement={achievement} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="steps" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements
                    .filter(a => a.milestone?.type === 'steps')
                    .map(achievement => (
                      <AchievementCard key={achievement.milestone_id} achievement={achievement} />
                    ))
                  }
                </div>
              </TabsContent>
              
              <TabsContent value="workouts" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements
                    .filter(a => a.milestone?.type === 'workouts')
                    .map(achievement => (
                      <AchievementCard key={achievement.milestone_id} achievement={achievement} />
                    ))
                  }
                </div>
              </TabsContent>
              
              <TabsContent value="streak" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements
                    .filter(a => a.milestone?.type === 'streak')
                    .map(achievement => (
                      <AchievementCard key={achievement.milestone_id} achievement={achievement} />
                    ))
                  }
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StreakDisplayProps {
  streak: StreakData | null;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak }) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-4 border border-amber-500/30"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 mr-3 rounded-full bg-amber-500/20">
            <Flame className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h3 className="font-medium">Activity Streak</h3>
            <p className="text-sm text-muted-foreground">Stay active to keep your streak going</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">
            {streak?.current_streak || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            Best: {streak?.longest_streak || 0} days
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface AchievementCardProps {
  achievement: UserMilestone;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const getAchievementIcon = (type?: string) => {
    switch(type) {
      case 'steps': return <Footprints className="h-4 w-4" />;
      case 'workouts': return <Dumbbell className="h-4 w-4" />;
      case 'streak': return <Flame className="h-4 w-4" />;
      case 'calories': return <Flame className="h-4 w-4" />;
      default: return <Medal className="h-4 w-4" />;
    }
  };
  
  const getProgressPercentage = () => {
    if (!achievement.milestone) return 0;
    const target = achievement.milestone.target_value;
    const progress = achievement.progress;
    return Math.min(100, Math.round((progress / target) * 100));
  };
  
  const progressPercent = getProgressPercentage();
  
  return (
    <motion.div 
      className={`p-3 rounded-md border ${
        achievement.achieved ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' : 'bg-muted/20'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className={`p-1 rounded-md ${
            achievement.achieved ? 'bg-green-100 dark:bg-green-900/50' : 'bg-muted'
          } mr-2`}>
            {getAchievementIcon(achievement.milestone?.type)}
          </div>
          <h3 className="font-medium text-sm">{achievement.milestone?.title}</h3>
        </div>
        {achievement.achieved && (
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
            Earned
          </Badge>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mb-2">{achievement.milestone?.description}</p>
      
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span>{achievement.progress} / {achievement.milestone?.target_value}</span>
          <span>{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-1.5" />
      </div>
      
      {achievement.achieved && achievement.achieved_at && (
        <div className="text-xs text-muted-foreground mt-2">
          Achieved on {new Date(achievement.achieved_at).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );
};

export default AchievementTracker;
