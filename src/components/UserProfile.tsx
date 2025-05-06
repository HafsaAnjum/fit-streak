
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Settings, ChevronRight, User, Target, Weight, Calendar } from "lucide-react";

const UserProfile = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-0 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-background"></div>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Sarah Johnson</h3>
              <p className="text-xs text-muted-foreground">Fitness Enthusiast</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 mt-4 mb-6">
          <StatCard 
            label="Fitness Goal" 
            value="Lose Weight" 
            icon={<Target className="h-4 w-4 text-primary" />}
          />
          <StatCard 
            label="Current Weight" 
            value="142 lbs" 
            icon={<Weight className="h-4 w-4 text-primary" />}
          />
          <StatCard 
            label="Active Days" 
            value="18 / 30" 
            icon={<Calendar className="h-4 w-4 text-primary" />}
          />
          <StatCard 
            label="Workouts" 
            value="24 completed" 
            icon={<Calendar className="h-4 w-4 text-primary" />}
          />
        </div>
        
        <div className="space-y-4">
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
          
          <div>
            <p className="text-sm font-medium mb-2">Fitness Level</p>
            <Badge variant="secondary" className="bg-primary/10 text-primary font-normal text-xs">
              Intermediate
            </Badge>
          </div>
          
          <div className="mt-6 bg-muted/50 rounded-lg p-3 flex justify-between items-center">
            <p className="text-sm">Connect health data sources</p>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <div className="flex items-center mb-1">
        <div className="mr-2">{icon}</div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="font-medium text-sm ml-6">{value}</p>
    </div>
  );
};

export default UserProfile;
