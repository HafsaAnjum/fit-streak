
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Map, CheckCircle, Clock, Calendar } from "lucide-react";

const mockActivities = [
  {
    id: 1,
    type: "Running",
    date: "Today, 8:30 AM",
    duration: "35 min",
    distance: "5.2 km",
    calories: "420",
    completed: true,
  },
  {
    id: 2,
    type: "HIIT Workout",
    date: "Yesterday, 6:15 PM",
    duration: "25 min",
    distance: null,
    calories: "310",
    completed: true,
  },
  {
    id: 3,
    type: "Yoga",
    date: "May 4, 7:00 AM",
    duration: "45 min",
    distance: null,
    calories: "180",
    completed: true,
  },
  {
    id: 4,
    type: "Cycling",
    date: "May 3, 5:30 PM",
    duration: "50 min",
    distance: "15.7 km",
    calories: "480",
    completed: false,
  },
];

const ActivityTracker = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Activity Tracker</CardTitle>
          <Button variant="outline" size="sm" className="h-8">
            <Activity className="mr-2 h-4 w-4" /> Start Activity
          </Button>
        </div>
        <CardDescription>
          Track your workouts and daily activities
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs defaultValue="recent" className="w-full">
          <div className="px-6">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
              <TabsTrigger value="scheduled" className="flex-1">Scheduled</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="recent" className="m-0">
            <div className="space-y-1">
              {mockActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="m-0">
            <div className="px-6 py-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
              <h3 className="font-medium text-lg mb-1">No Scheduled Workouts</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Plan your next workouts with AI assistance
              </p>
              <Button variant="outline" size="sm">
                Schedule Workout
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="m-0">
            <div className="px-6 py-2 text-center">
              <p className="text-muted-foreground text-sm">
                Connect to Apple Health or Google Fit to view more history
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="ghost" className="text-xs text-muted-foreground">
          View All Activities
        </Button>
      </CardFooter>
    </Card>
  );
};

interface ActivityItemProps {
  activity: {
    id: number;
    type: string;
    date: string;
    duration: string;
    distance: string | null;
    calories: string;
    completed: boolean;
  };
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  return (
    <div className="flex items-center p-4 hover:bg-muted/50 transition-colors border-b last:border-0">
      <div className="p-2 mr-4 rounded-full bg-primary/10">
        {activity.type.includes("Run") ? (
          <Map className="h-4 w-4 text-primary" />
        ) : (
          <Activity className="h-4 w-4 text-primary" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium truncate">{activity.type}</p>
            <p className="text-xs text-muted-foreground flex items-center mt-0.5">
              <Clock className="inline h-3 w-3 mr-1" /> {activity.duration}
              {activity.distance && (
                <span className="ml-3">{activity.distance}</span>
              )}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant={activity.completed ? "secondary" : "outline"} className="ml-auto h-6">
              {activity.calories} kcal
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
