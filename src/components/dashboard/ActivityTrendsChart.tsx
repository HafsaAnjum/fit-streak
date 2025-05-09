
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";

interface ActivityData {
  date: string;
  steps?: number;
  calories?: number;
  distance?: number;
  activeMinutes?: number;
}

interface ActivityTrendsChartProps {
  data: ActivityData[];
  title: string;
  loading: boolean;
  dataKeys: Array<{
    key: keyof ActivityData;
    name: string;
    color: string;
    unit?: string;
  }>;
}

const ActivityTrendsChart = ({ data, title, loading, dataKeys }: ActivityTrendsChartProps) => {
  // Format dates for display
  const formattedData = data.map(item => {
    const date = new Date(item.date);
    return {
      ...item,
      formattedDate: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  // Calculate total values for each metric
  const totals: Record<string, number> = {};
  dataKeys.forEach(key => {
    totals[key.key as string] = formattedData.reduce((sum, item) => {
      return sum + (item[key.key as keyof ActivityData] as number || 0);
    }, 0);
  });

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 w-full bg-muted/20 rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <div className="flex gap-2">
          {dataKeys.map((dataKey) => (
            <Badge key={dataKey.key as string} variant="outline" className="text-xs">
              {dataKey.name}: {totals[dataKey.key as string]?.toLocaleString()} {dataKey.unit || ''}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="formattedDate"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none"
                }}
                formatter={(value, name) => {
                  const dataKey = dataKeys.find(dk => dk.name === name);
                  return [`${value.toLocaleString()} ${dataKey?.unit || ''}`, name];
                }}
              />
              <Legend />
              {dataKeys.map((dataKey) => (
                <Line
                  key={dataKey.key as string}
                  type="monotone"
                  dataKey={dataKey.key as string}
                  name={dataKey.name}
                  stroke={dataKey.color}
                  strokeWidth={3}
                  dot={{ r: 4, fill: dataKey.color }}
                  activeDot={{ r: 6, fill: dataKey.color }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTrendsChart;
