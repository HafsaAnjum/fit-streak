
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StreakData {
  id?: string;
  user_id?: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
}

export const StreakService = {
  // Get the current streak for the user
  getUserStreak: async (): Promise<StreakData | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }
      
      // Get streak from database
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching streak data:', error);
        return null;
      }
      
      // If no streak record exists yet, create one
      if (!data) {
        const newStreak = {
          user_id: user.id,
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: null
        };
        
        const { data: createdStreak, error: createError } = await supabase
          .from('streaks')
          .insert(newStreak)
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating new streak record:', createError);
          return newStreak;
        }
        
        return createdStreak;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getUserStreak:', error);
      return null;
    }
  },
  
  // Update streak based on daily activity
  updateStreak: async (activityDate: Date = new Date()): Promise<StreakData | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }
      
      // Get current streak data
      const { data: streakData, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching streak for update:', error);
        return null;
      }
      
      // Format today's date as ISO string YYYY-MM-DD
      const formattedDate = activityDate.toISOString().split('T')[0];
      
      let currentStreak = 0;
      let longestStreak = streakData?.longest_streak || 0;
      let lastActivityDate = streakData?.last_activity_date;
      
      if (streakData) {
        // If there's already streak data, update it
        if (!lastActivityDate) {
          // First activity
          currentStreak = 1;
        } else {
          const lastDate = new Date(lastActivityDate);
          const today = new Date(formattedDate);
          
          // Calculate day difference
          const diffTime = Math.abs(today.getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) {
            // Same day, no change to streak
            currentStreak = streakData.current_streak;
          } else if (diffDays === 1 || (lastDate > today && diffDays <= 1)) {
            // Next consecutive day or backdated activity for yesterday
            currentStreak = streakData.current_streak + 1;
          } else {
            // Streak broken - either missed days or backdated too far
            currentStreak = 1;
          }
        }
      } else {
        // First time recording activity
        currentStreak = 1;
      }
      
      // Update longest streak if needed
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
      
      // Prepare update data
      const streakUpdate = {
        user_id: user.id,
        current_streak: currentStreak,
        longest_streak: longestStreak,
        last_activity_date: formattedDate,
        updated_at: new Date().toISOString()
      };
      
      // Update or insert streak data
      let result;
      if (streakData) {
        const { data, error: updateError } = await supabase
          .from('streaks')
          .update(streakUpdate)
          .eq('id', streakData.id)
          .select()
          .single();
          
        if (updateError) {
          console.error('Error updating streak:', updateError);
          return null;
        }
        
        result = data;
      } else {
        const { data, error: insertError } = await supabase
          .from('streaks')
          .insert(streakUpdate)
          .select()
          .single();
          
        if (insertError) {
          console.error('Error inserting streak:', insertError);
          return null;
        }
        
        result = data;
      }
      
      return result;
    } catch (error) {
      console.error('Error updating streak:', error);
      return null;
    }
  },
  
  // Check if activity meets minimum requirements for streak
  isValidActivity: (stepsCount: number = 0): boolean => {
    // Minimum step count for a valid activity day
    const MIN_STEPS_FOR_STREAK = 500;
    return stepsCount >= MIN_STEPS_FOR_STREAK;
  },
  
  // Check and update streak based on fitness data
  checkAndUpdateStreak: async (stepsData: { date: string, value: number }[]): Promise<void> => {
    try {
      // Find the most recent day with valid activity
      const validActivityDay = stepsData
        .filter(day => StreakService.isValidActivity(day.value))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        
      if (validActivityDay) {
        // Update streak with this activity date
        await StreakService.updateStreak(new Date(validActivityDay.date));
      }
    } catch (error) {
      console.error('Error in checkAndUpdateStreak:', error);
    }
  }
};
