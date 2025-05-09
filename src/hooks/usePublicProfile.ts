
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PublicProfile {
  username: string;
  avatar_url: string;
  bio?: string;
  fitness_level?: string;
  streak?: {
    current_streak: number;
    longest_streak: number;
  };
  workouts?: {
    id: string;
    activity_type: string;
    duration: number;
    calories_burned: number;
    steps: number;
    start_time: string;
    completed: boolean;
  }[];
  achievements?: {
    title: string;
    description: string;
    achieved_at: string;
    icon?: string;
  }[];
  stats?: {
    total_workouts: number;
    total_steps: number;
    total_calories: number;
  };
}

export function usePublicProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const fetchPublicProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url, bio, fitness_level")
          .eq("id", userId)
          .eq("public_profile", true) // Only fetch profiles that are set to public
          .single();

        if (profileError) {
          if (profileError.code === "PGRST116") {
            setError("This profile is private or does not exist.");
          } else {
            console.error("Error fetching profile:", profileError);
            setError("Failed to load profile information.");
          }
          setLoading(false);
          return;
        }

        // Fetch user streak
        const { data: streakData } = await supabase
          .from("streaks")
          .select("current_streak, longest_streak")
          .eq("user_id", userId)
          .single();

        // Fetch recent workouts
        const { data: workoutsData } = await supabase
          .from("workout_sessions")
          .select("id, activity_type, duration, calories_burned, steps, start_time, completed")
          .eq("user_id", userId)
          .eq("completed", true)
          .order("start_time", { ascending: false })
          .limit(5);

        // Fetch achievements using RPC function
        const { data: achievementsData } = await supabase
          .rpc("get_user_milestones", { p_user_id: userId });

        // Calculate stats using RPC function
        const { data: statsData } = await supabase
          .rpc("get_user_fitness_stats", { user_id_param: userId });

        const formattedProfile: PublicProfile = {
          ...profileData,
          streak: streakData || { current_streak: 0, longest_streak: 0 },
          workouts: workoutsData || [],
          achievements: achievementsData ? achievementsData.map((a: any) => ({
            title: a.milestone_title || "Achievement",
            description: a.milestone_description || "",
            achieved_at: a.achieved_at || "",
            icon: a.milestone_icon
          })) : [],
          stats: statsData?.[0] || { 
            total_workouts: 0,
            total_steps: 0,
            total_calories: 0
          }
        };

        setProfile(formattedProfile);
      } catch (err) {
        console.error("Error fetching public profile:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  return { profile, loading, error };
}

export default usePublicProfile;
