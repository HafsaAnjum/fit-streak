
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DailyGoalsCardProps {
  mockData: {
    dailySteps: number;
    dailyStepsGoal: number;
    caloriesBurned: number;
    caloriesBurnedGoal: number;
    activeMinutes: number;
    activeMinutesGoal: number;
    hydration: number;
    hydrationGoal: number;
    sleep: number;
    sleepGoal: number;
    [key: string]: any;
  };
}

const DailyGoalsCard = ({ mockData }: DailyGoalsCardProps) => {
  return (
    <Card className="hover:shadow-md transition-all duration-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 pb-2">
        <CardTitle className="text-lg font-medium">Daily Goals</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Steps</span>
            <span className="text-sm text-muted-foreground">{mockData.dailySteps}/{mockData.dailyStepsGoal}</span>
          </div>
          <Progress value={(mockData.dailySteps/mockData.dailyStepsGoal) * 100} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Calories</span>
            <span className="text-sm text-muted-foreground">{mockData.caloriesBurned}/{mockData.caloriesBurnedGoal}</span>
          </div>
          <Progress value={(mockData.caloriesBurned/mockData.caloriesBurnedGoal) * 100} className="h-2 bg-orange-100" indicatorClassName="bg-orange-500" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Active Minutes</span>
            <span className="text-sm text-muted-foreground">{mockData.activeMinutes}/{mockData.activeMinutesGoal}</span>
          </div>
          <Progress value={(mockData.activeMinutes/mockData.activeMinutesGoal) * 100} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Hydration</span>
            <span className="text-sm text-muted-foreground">{mockData.hydration}/{mockData.hydrationGoal}L</span>
          </div>
          <Progress value={(mockData.hydration/mockData.hydrationGoal) * 100} className="h-2 bg-blue-100" indicatorClassName="bg-cyan-500" />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Sleep</span>
            <span className="text-sm text-muted-foreground">{mockData.sleep}/{mockData.sleepGoal}hrs</span>
          </div>
          <Progress value={(mockData.sleep/mockData.sleepGoal) * 100} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyGoalsCard;
