
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Footprints, Heart, Activity, Award } from "lucide-react";

interface FitnessMetric {
  name: string;
  value: number;
  goal?: number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  loading: boolean;
}

interface FitnessMetricsSectionProps {
  metrics: FitnessMetric[];
  loading: boolean;
}

const MetricSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-6 w-24 bg-muted rounded mb-2"></div>
    <div className="h-10 w-32 bg-muted rounded mb-3"></div>
    <div className="h-2 w-full bg-muted rounded"></div>
  </div>
);

const FitnessMetricsSection = ({ metrics, loading }: FitnessMetricsSectionProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <MetricSkeleton />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-card to-secondary/10">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg ${metric.color}/10`}>{metric.icon}</div>
                {metric.trend !== undefined && (
                  <Badge variant={metric.trend >= 0 ? "default" : "destructive"} className="text-xs">
                    {metric.trend >= 0 ? "+" : ""}{metric.trend}%
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold mb-1">
                {metric.value.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{metric.name}</p>
              {metric.goal && (
                <div className="mt-2">
                  <Progress value={(metric.value / metric.goal) * 100} className="h-1.5" />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Goal: {metric.goal.toLocaleString()}</span>
                    <span className="font-medium">{Math.round((metric.value / metric.goal) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FitnessMetricsSection;
