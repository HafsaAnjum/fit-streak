
import React from "react";
import { Calendar } from "lucide-react";

interface Workout {
  id: string;
  activity_type: string;
  duration: number;
  calories_burned: number;
  steps: number;
  start_time: string;
  completed: boolean;
}

interface RecentWorkoutsProps {
  workouts?: Workout[];
}

const RecentWorkouts: React.FC<RecentWorkoutsProps> = ({ workouts = [] }) => {
  return (
    <div>
      <h3 className="font-semibold flex items-center mb-3">
        <Calendar className="h-4 w-4 mr-1.5" />
        Recent Workouts
      </h3>
      
      {workouts.length > 0 ? (
        <div className="space-y-3">
          {workouts.map(workout => (
            <div key={workout.id} className="bg-muted rounded-md p-3">
              <div className="flex justify-between">
                <div className="font-medium">{workout.activity_type} Workout</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(workout.start_time).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Duration: {Math.floor(workout.duration / 60)} min • 
                Calories: {workout.calories_burned} • 
                Steps: {workout.steps}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No recent workouts to show
        </div>
      )}
    </div>
  );
};

export default RecentWorkouts;
