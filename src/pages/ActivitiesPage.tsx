
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Calendar, 
  Clock, 
  MapPin, 
  Flame, 
  Timer, 
  BarChart, 
  Plus,
  ChevronRight,
  ArrowRight,
  CircleDot
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for recent activities
const recentActivities = [
  {
    id: 1,
    type: "Running",
    date: "Today, 8:30 AM",
    duration: "35 min",
    distance: "5.2 km",
    calories: 420,
    heartRate: 145,
    steps: 6240,
    pace: "6:45 /km",
  },
  {
    id: 2,
    type: "HIIT Workout",
    date: "Yesterday, 6:15 PM",
    duration: "25 min",
    distance: null,
    calories: 310,
    heartRate: 158,
    steps: 2800,
    pace: null,
  },
  {
    id: 3,
    type: "Yoga",
    date: "May 4, 7:00 AM",
    duration: "45 min",
    distance: null,
    calories: 180,
    heartRate: 95,
    steps: 1200,
    pace: null,
  },
  {
    id: 4,
    type: "Cycling",
    date: "May 3, 5:30 PM",
    duration: "50 min",
    distance: "15.7 km",
    calories: 480,
    heartRate: 138,
    steps: null,
    pace: "3:12 /km",
  },
];

// Mock data for charts
const weeklyActivityData = [
  { day: 'Mon', calories: 380, duration: 35 },
  { day: 'Tue', calories: 420, duration: 42 },
  { day: 'Wed', calories: 320, duration: 28 },
  { day: 'Thu', calories: 0, duration: 0 },
  { day: 'Fri', calories: 310, duration: 25 },
  { day: 'Sat', calories: 480, duration: 50 },
  { day: 'Sun', calories: 420, duration: 35 },
];

const ActivitiesPage = () => {
  return (
    <>
      <div className="container max-w-7xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Activities</h1>
            <p className="text-muted-foreground">Track your fitness activities</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Activity
          </Button>
        </header>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <SummaryCard 
                label="Total Activities" 
                value="7" 
                icon={<Activity className="h-4 w-4 text-primary" />}
                change={2}
              />
              <SummaryCard 
                label="Total Duration" 
                value="215 min" 
                icon={<Clock className="h-4 w-4 text-primary" />}
                change={15}
              />
              <SummaryCard 
                label="Total Distance" 
                value="28.4 km" 
                icon={<MapPin className="h-4 w-4 text-primary" />}
                change={-5}
              />
              <SummaryCard 
                label="Total Calories" 
                value="2,330" 
                icon={<Flame className="h-4 w-4 text-primary" />}
                change={8}
              />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyActivityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    name="Calories" 
                    stroke="#8B5CF6" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    name="Duration (min)" 
                    stroke="#0ED3CF" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="running">Running</TabsTrigger>
              <TabsTrigger value="workouts">Workouts</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="running" className="m-0">
              <div className="space-y-4">
                {recentActivities
                  .filter(a => a.type === "Running")
                  .map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="workouts" className="m-0">
              <div className="space-y-4">
                {recentActivities
                  .filter(a => a.type === "HIIT Workout")
                  .map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="other" className="m-0">
              <div className="space-y-4">
                {recentActivities
                  .filter(a => !["Running", "HIIT Workout"].includes(a.type))
                  .map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Navigation />
    </>
  );
};

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  change: number;
}

const SummaryCard = ({ label, value, icon, change }: SummaryCardProps) => {
  const isPositive = change >= 0;
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="bg-primary/10 p-2 rounded-md">
          {icon}
        </div>
        <Badge variant={isPositive ? "secondary" : "outline"} className="h-6">
          {isPositive ? "+" : ""}{change}%
        </Badge>
      </div>
      <div className="mt-2">
        <p className="text-xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

interface ActivityCardProps {
  activity: {
    id: number;
    type: string;
    date: string;
    duration: string;
    distance: string | null;
    calories: number;
    heartRate: number;
    steps: number | null;
    pace: string | null;
  };
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-start">
          <div className="py-4 px-4 flex flex-col items-center justify-center border-r w-24 text-center">
            <div className={`p-2 rounded-full ${activity.type === "Running" ? "bg-blue-100 text-blue-600" : activity.type === "HIIT Workout" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"}`}>
              {activity.type === "Running" ? (
                <Activity className="h-5 w-5" />
              ) : activity.type === "HIIT Workout" ? (
                <Flame className="h-5 w-5" />
              ) : (
                <Activity className="h-5 w-5" />
              )}
            </div>
            <p className="text-xs font-medium mt-2 line-clamp-1">{activity.type}</p>
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground">{activity.date}</p>
                <div className="flex items-center mt-1 space-x-3 text-sm">
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" /> {activity.duration}
                  </span>
                  {activity.distance && (
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" /> {activity.distance}
                    </span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <MetricPill 
                icon={<Flame className="h-3 w-3 text-orange-500" />} 
                value={activity.calories} 
                unit="kcal" 
              />
              <MetricPill 
                icon={<Timer className="h-3 w-3 text-red-500" />} 
                value={activity.heartRate} 
                unit="bpm" 
              />
              {activity.steps ? (
                <MetricPill 
                  icon={<BarChart className="h-3 w-3 text-blue-500" />} 
                  value={activity.steps} 
                  unit="steps" 
                />
              ) : activity.pace ? (
                <MetricPill 
                  icon={<CircleDot className="h-3 w-3 text-green-500" />} 
                  value={activity.pace} 
                  unit="" 
                />
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricPillProps {
  icon: React.ReactNode;
  value: string | number;
  unit: string;
}

const MetricPill = ({ icon, value, unit }: MetricPillProps) => {
  return (
    <div className="bg-muted/50 rounded-md px-2 py-1 flex items-center justify-center text-xs">
      <div className="mr-1">{icon}</div>
      <span className="font-medium">{value}</span>
      {unit && <span className="text-muted-foreground text-[10px] ml-0.5">{unit}</span>}
    </div>
  );
};

export default ActivitiesPage;
