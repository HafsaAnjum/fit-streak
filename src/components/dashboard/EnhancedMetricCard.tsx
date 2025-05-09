
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default EnhancedMetricCard;
