
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem = ({ label, value }: StatItemProps) => {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0 last:pb-0">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const ProfileStats: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Fitness Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <StatItem label="Average Daily Steps" value="7,842" />
          <StatItem label="Average Daily Calories" value="427 kcal" />
          <StatItem label="Average Active Minutes" value="48 min" />
          <StatItem label="Average Resting Heart Rate" value="72 bpm" />
          <StatItem label="Weekly Distance" value="23.6 km" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileStats;
export { StatItem };
