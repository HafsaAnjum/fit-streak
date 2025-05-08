
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Edit, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const UserCard: React.FC = () => {
  const { profile } = useAuth();
  const userData = {
    name: profile?.username || "Sarah Johnson",
    role: "Fitness Enthusiast",
    workouts: 24,
    activeDays: 18,
    achievements: 7,
    weightStart: 150,
    weightCurrent: 142,
    weightGoal: 134
  };
  
  const weightProgress = ((userData.weightStart - userData.weightCurrent) / 
    (userData.weightStart - userData.weightGoal)) * 100;

  return (
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
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-muted-foreground">{userData.role}</p>
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
              <p className="text-2xl font-bold">{userData.workouts}</p>
              <p className="text-xs text-muted-foreground">Workouts</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userData.activeDays}</p>
              <p className="text-xs text-muted-foreground">Active Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{userData.achievements}</p>
              <p className="text-xs text-muted-foreground">Achievements</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-medium">Weight Loss Goal</span>
              <span className="text-muted-foreground">{userData.weightGoal - userData.weightCurrent} lbs to go</span>
            </div>
            <Progress value={weightProgress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>Started: {userData.weightStart} lbs</span>
              <span>Goal: {userData.weightGoal} lbs</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
