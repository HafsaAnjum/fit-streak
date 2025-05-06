
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, CalendarDays, Dumbbell, Search, Filter, ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import WorkoutPlanner from "@/components/WorkoutPlanner";

const mockWorkouts = [
  {
    id: 1,
    name: "Full Body HIIT",
    duration: "30 min",
    type: "HIIT",
    difficulty: "Medium",
    aiRecommended: true,
  },
  {
    id: 2,
    name: "Upper Body Strength",
    duration: "45 min",
    type: "Strength",
    difficulty: "Hard",
    aiRecommended: false,
  },
  {
    id: 3,
    name: "Morning Yoga Flow",
    duration: "25 min",
    type: "Yoga",
    difficulty: "Easy",
    aiRecommended: false,
  },
  {
    id: 4,
    name: "Core and Abs",
    duration: "20 min",
    type: "Strength",
    difficulty: "Medium",
    aiRecommended: true,
  },
  {
    id: 5,
    name: "Cardio Blast",
    duration: "35 min",
    type: "Cardio",
    difficulty: "Hard",
    aiRecommended: false,
  },
  {
    id: 6,
    name: "Recovery Stretch",
    duration: "15 min",
    type: "Recovery",
    difficulty: "Easy",
    aiRecommended: false,
  },
];

const WorkoutsPage = () => {
  return (
    <>
      <div className="container max-w-7xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">Discover and plan your workouts</p>
        </header>

        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <Button size="sm" className="h-8">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Workout
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="strength">Strength</TabsTrigger>
            <TabsTrigger value="cardio">Cardio</TabsTrigger>
            <TabsTrigger value="yoga">Yoga</TabsTrigger>
            <TabsTrigger value="recovery">Recovery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="strength" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWorkouts
                .filter(w => w.type === "Strength")
                .map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cardio" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWorkouts
                .filter(w => w.type === "Cardio" || w.type === "HIIT")
                .map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="yoga" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWorkouts
                .filter(w => w.type === "Yoga")
                .map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recovery" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWorkouts
                .filter(w => w.type === "Recovery")
                .map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Personalized for You</h2>
          <WorkoutPlanner />
        </div>
      </div>
      <Navigation />
    </>
  );
};

interface WorkoutCardProps {
  workout: {
    id: number;
    name: string;
    duration: string;
    type: string;
    difficulty: string;
    aiRecommended: boolean;
  };
}

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
        <Dumbbell className="h-12 w-12 text-primary/50" />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{workout.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {workout.duration}
              <span className="mx-1">•</span>
              {workout.difficulty}
            </p>
          </div>
          {workout.aiRecommended && (
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              <Sparkles className="h-3 w-3 mr-1" /> AI Pick
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Badge variant="outline" className="text-xs">{workout.type}</Badge>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutsPage;
