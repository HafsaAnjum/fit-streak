
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Heart, 
  Flame, 
  Footprints, 
  Timer,
  ArrowUp,
  TrendingUp,
  Award,
  BarChart,
  ChevronRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Enhanced mock data
const mockData = {
  dailySteps: 7842,
  dailyStepsGoal: 10000,
  caloriesBurned: 427,
  caloriesBurnedGoal: 650,
  activeMinutes: 48,
  activeMinutesGoal: 60,
  heartRate: 72,
  distance: 5.2,
  streakDays: 14,
  completionRate: 86,
  hydration: 1.8,
  hydrationGoal: 2.5,
  sleep: 7.2,
  sleepGoal: 8
};

const weeklyData = [
  { name: 'Mon', steps: 6500, calories: 380, active: 45, completion: 78 },
  { name: 'Tue', steps: 7200, calories: 420, active: 50, completion: 82 },
  { name: 'Wed', steps: 6800, calories: 400, active: 47, completion: 80 },
  { name: 'Thu', steps: 7842, calories: 427, active: 48, completion: 86 },
  { name: 'Fri', steps: 9200, calories: 510, active: 62, completion: 91 },
  { name: 'Sat', steps: 8300, calories: 470, active: 58, completion: 88 },
  { name: 'Sun', steps: 6700, calories: 390, active: 46, completion: 79 },
];

const monthlyTrend = [
  { name: 'Week 1', steps: 45000, calories: 2600, active: 320 },
  { name: 'Week 2', steps: 48000, calories: 2750, active: 345 },
  { name: 'Week 3', steps: 52000, calories: 2900, active: 370 },
  { name: 'Week 4', steps: 49000, calories: 2800, active: 350 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
          <BarChart className="mr-2 h-6 w-6 text-primary" />
          Dashboard Overview
        </h2>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>View Reports</span>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <EnhancedMetricCard 
          icon={<Footprints className="h-5 w-5 text-blue-500" />}
          title="Daily Steps"
          value={mockData.dailySteps.toLocaleString()}
          goal={mockData.dailyStepsGoal}
          current={mockData.dailySteps}
          unit=""
          trend={8}
          color="bg-blue-500"
        />
        <EnhancedMetricCard 
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          title="Calories Burned"
          value={mockData.caloriesBurned}
          goal={mockData.caloriesBurnedGoal}
          current={mockData.caloriesBurned}
          unit="kcal"
          trend={12}
          color="bg-orange-500"
        />
        <EnhancedMetricCard 
          icon={<Activity className="h-5 w-5 text-green-500" />}
          title="Active Minutes"
          value={mockData.activeMinutes}
          goal={mockData.activeMinutesGoal}
          current={mockData.activeMinutes}
          unit="min"
          trend={-5}
          color="bg-green-500"
        />
        <EnhancedMetricCard 
          icon={<Award className="h-5 w-5 text-purple-500" />}
          title="Streak Days"
          value={mockData.streakDays}
          goal={null}
          current={null}
          unit="days"
          showProgress={false}
          trend={3}
          color="bg-purple-500"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="md:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">Weekly Activity</CardTitle>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ED3CF" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ED3CF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      border: "none"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#8B5CF6" }} 
                    activeDot={{ r: 6, fill: "#8B5CF6" }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#F97316" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#F97316" }} 
                    activeDot={{ r: 6, fill: "#F97316" }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="active" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10B981" }} 
                    activeDot={{ r: 6, fill: "#10B981" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorMonthlySteps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#8B5CF6" 
                    fillOpacity={1} 
                    fill="url(#colorMonthlySteps)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border border-primary/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Weekly Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <defs>
                    <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="completion" 
                    name="Completion %" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorCompletion)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="hover:shadow-md transition-all duration-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-primary/10 pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Workouts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {[
                { name: "Morning Run", time: "Today, 7:00 AM", duration: "30 min" },
                { name: "HIIT Workout", time: "Tomorrow, 6:30 PM", duration: "45 min" },
                { name: "Yoga Session", time: "Wed, 8:00 AM", duration: "60 min" }
              ].map((workout, i) => (
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
      </motion.div>
    </div>
  );
};

interface EnhancedMetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  goal: number | null;
  current: number | null;
  unit: string;
  showProgress?: boolean;
  trend: number;
  color: string;
}

const EnhancedMetricCard = ({ 
  icon, 
  title, 
  value, 
  goal, 
  current, 
  unit, 
  showProgress = true,
  trend,
  color
}: EnhancedMetricCardProps) => {
  const progress = goal && current ? (current / goal) * 100 : null;
  const trendColor = trend >= 0 ? "text-emerald-500" : "text-rose-500";
  const trendIcon = trend >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowUp className="h-3 w-3 transform rotate-180" />;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-card to-secondary/10">
      <CardContent className="p-0">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className={`p-2 rounded-lg ${color}/10`}>{icon}</div>
            <div className={`flex items-center ${trendColor} text-xs font-medium`}>
              {trendIcon}
              <span className="ml-1">{Math.abs(trend)}%</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {value}
            <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">{title}</p>
          {showProgress && progress !== null && (
            <div className="mt-2">
              <Progress value={progress} className="h-1.5" />
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
