
import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Activity, Calendar, Flame, Heart } from "lucide-react";

// Mock data for analytics
const weeklyActivityData = [
  { day: "Mon", calories: 320, steps: 8540, active: 42 },
  { day: "Tue", calories: 450, steps: 9200, active: 58 },
  { day: "Wed", calories: 380, steps: 7800, active: 45 },
  { day: "Thu", calories: 520, steps: 10500, active: 65 },
  { day: "Fri", calories: 480, steps: 9700, active: 61 },
  { day: "Sat", calories: 370, steps: 7300, active: 47 },
  { day: "Sun", calories: 420, steps: 8900, active: 52 }
];

const monthlyTrendData = [
  { week: "W1", calories: 2600, steps: 53000, active: 320 },
  { week: "W2", calories: 2800, steps: 57000, active: 345 },
  { week: "W3", calories: 3100, steps: 61000, active: 370 },
  { week: "W4", calories: 2900, steps: 59000, active: 350 }
];

const activityDistributionData = [
  { name: "Running", value: 35, color: "#8B5CF6" },
  { name: "Walking", value: 25, color: "#0EA5E9" },
  { name: "Cycling", value: 20, color: "#10B981" },
  { name: "Swimming", value: 10, color: "#F97316" },
  { name: "Other", value: 10, color: "#6B7280" }
];

const COLORS = ["#8B5CF6", "#0EA5E9", "#10B981", "#F97316", "#6B7280"];

const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Calories"
          value="12,840"
          change="+8.2%"
          icon={<Flame className="h-4 w-4 text-orange-400" />}
          description="Burned this month"
          trend="up"
        />
        <MetricCard 
          title="Active Minutes"
          value="1,285"
          change="+12.5%"
          icon={<Activity className="h-4 w-4 text-blue-500" />}
          description="This month"
          trend="up"
        />
        <MetricCard 
          title="Average BPM"
          value="72"
          change="-3.2%"
          icon={<Heart className="h-4 w-4 text-rose-500" />}
          description="Resting heart rate"
          trend="down"
        />
        <MetricCard 
          title="Workouts"
          value="28"
          change="+4"
          icon={<Calendar className="h-4 w-4 text-emerald-500" />}
          description="Completed this month"
          trend="up"
        />
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Activity Trends</h2>
          <TabsList className="bg-muted/80">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="weekly" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyActivityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px", 
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="calories" name="Calories" stroke="#F97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="steps" name="Steps" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="active" name="Active Min" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px", 
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }} 
                  />
                  <Legend />
                  <Area type="monotone" dataKey="calories" name="Calories" stroke="#F97316" fill="#F97316" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="steps" name="Steps" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="active" name="Active Min" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {activityDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px", 
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px", 
                      border: "1px solid #e0e0e0",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="steps" name="Steps" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" name="Active Min" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  description: string;
  trend: "up" | "down" | "neutral";
}

const MetricCard = ({ title, value, change, icon, description, trend }: MetricCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 border-none">
      <CardContent className="p-6 bg-gradient-to-br from-card to-card/80">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
              <span className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground"
              )}>{change}</span>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
