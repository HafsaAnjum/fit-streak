
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface WorkoutItem {
  name: string;
  time: string;
  duration: string;
}

const UpcomingWorkouts = () => {
  const workouts: WorkoutItem[] = [
    { name: "Morning Run", time: "Today, 7:00 AM", duration: "30 min" },
    { name: "HIIT Workout", time: "Tomorrow, 6:30 PM", duration: "45 min" },
    { name: "Yoga Session", time: "Wed, 8:00 AM", duration: "60 min" }
  ];

  return (
    <Card className="hover:shadow-md transition-all duration-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-primary/10 pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Workouts</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {workouts.map((workout, i) => (
            <div key={i} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between">
              <div>
                <h4 className="font-medium">{workout.name}</h4>
                <p className="text-sm text-muted-foreground">{workout.time}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-4">{workout.duration}</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/workouts">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/workouts">View All Workouts</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingWorkouts;
