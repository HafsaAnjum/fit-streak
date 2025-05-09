
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Award, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
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

const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicProfile();
  }, [userId]);

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

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from("user_milestones")
        .select(`
          milestone_id,
          achieved_at,
          milestone_title,
          milestone_description,
          milestone_icon
        `)
        .eq("user_id", userId)
        .eq("achieved", true)
        .order("achieved_at", { ascending: false })
        .limit(5);

      // Calculate stats
      const { data: statsData } = await supabase
        .rpc("get_user_fitness_stats", { user_id_param: userId });

      const formattedProfile: PublicProfile = {
        ...profileData,
        streak: streakData || { current_streak: 0, longest_streak: 0 },
        workouts: workoutsData || [],
        achievements: achievementsData ? achievementsData.map(a => ({
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

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile Not Available</CardTitle>
            <CardDescription>
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>
              This profile does not exist or is set to private.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{profile.username}'s Fitness Profile</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4 pb-24 md:pb-6 space-y-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="pb-2">
            <Button asChild variant="ghost" className="w-fit -ml-2.5 mb-2">
              <Link to="/community">
                <span>← Back to Community</span>
              </Link>
            </Button>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url} alt={profile.username} />
                <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div>
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.fitness_level && (
                    <Badge variant="outline" className="bg-primary/10">
                      {profile.fitness_level}
                    </Badge>
                  )}
                  {profile.streak?.current_streak > 0 && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                      <TrendingUp className="h-3 w-3 mr-1" /> {profile.streak.current_streak} Day Streak
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {profile.bio && (
              <CardDescription className="text-sm mt-2">
                {profile.bio}
              </CardDescription>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="text-center">
                <div className="text-xl font-bold">{profile.stats?.total_workouts || 0}</div>
                <div className="text-xs text-muted-foreground">Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{(profile.stats?.total_steps || 0).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Steps</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{(profile.stats?.total_calories || 0).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Calories Burned</div>
              </div>
            </div>
            
            {/* Recent Workouts */}
            <div>
              <h3 className="font-semibold flex items-center mb-3">
                <Calendar className="h-4 w-4 mr-1.5" />
                Recent Workouts
              </h3>
              
              {profile.workouts && profile.workouts.length > 0 ? (
                <div className="space-y-3">
                  {profile.workouts.map(workout => (
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
            
            {/* Achievements */}
            <div>
              <h3 className="font-semibold flex items-center mb-3">
                <Award className="h-4 w-4 mr-1.5" />
                Achievements
              </h3>
              
              {profile.achievements && profile.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="bg-muted rounded-md p-3 flex gap-3">
                      <div className="rounded-full bg-primary/10 p-2 h-fit">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(achievement.achieved_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No achievements yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PublicProfilePage;
