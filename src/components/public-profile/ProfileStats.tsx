
import React from "react";

interface ProfileStatsProps {
  stats: {
    total_workouts: number;
    total_steps: number;
    total_calories: number;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4 py-2">
      <div className="text-center">
        <div className="text-xl font-bold">{stats?.total_workouts || 0}</div>
        <div className="text-xs text-muted-foreground">Workouts</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold">{(stats?.total_steps || 0).toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">Total Steps</div>
      </div>
      <div className="text-center">
        <div className="text-xl font-bold">{(stats?.total_calories || 0).toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">Calories Burned</div>
      </div>
    </div>
  );
};

export default ProfileStats;
