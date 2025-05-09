
import { useEffect, useState, useCallback } from 'react';
import { useFitnessData } from "@/hooks/useFitnessData";
import { StreakService } from "@/services/StreakService";
import { MilestoneService } from "@/services/MilestoneService";

export function useFitnessUpdates() {
  const { data, loading, refresh, isConnected } = useFitnessData({ days: 30 });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updatingAchievements, setUpdatingAchievements] = useState(false);
  
  // Check and update streak and achievements based on fitness data
  const updateStreakAndAchievements = useCallback(async () => {
    if (!data || !data.steps || data.steps.length === 0) return;
    
    try {
      setUpdatingAchievements(true);
      
      // Update streak based on latest fitness data
      await StreakService.checkAndUpdateStreak(data.steps);
      
      // Check and update milestones
      await MilestoneService.checkAllMilestones(data);
      
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error updating streak and achievements:", error);
    } finally {
      setUpdatingAchievements(false);
    }
  }, [data]);
  
  // Run update when data changes
  useEffect(() => {
    if (data && !loading && isConnected) {
      updateStreakAndAchievements();
    }
  }, [data, loading, isConnected, updateStreakAndAchievements]);
  
  return {
    lastUpdate,
    loading: loading || updatingAchievements,
    refresh,
    updateStreakAndAchievements
  };
}
