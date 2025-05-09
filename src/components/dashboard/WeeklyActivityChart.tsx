
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface WeeklyActivityChartProps {
  data: Array<{
    name: string;
    steps: number;
    calories: number;
    active: number;
    completion: number;
  }>;
}

const WeeklyActivityChart = ({ data }: WeeklyActivityChartProps) => {
  return (
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
            <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
  );
};

export default WeeklyActivityChart;
