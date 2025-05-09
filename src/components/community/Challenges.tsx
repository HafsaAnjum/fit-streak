
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, Flag, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Challenge {
  id: string;
  title: string;
  description: string;
  goal_type: "steps" | "workouts" | "calories";
  goal_value: number;
  start_date: string;
  end_date: string;
  badge_image?: string;
  joined?: boolean;
  progress?: number;
  completed?: boolean;
}

const Challenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<Record<string, { progress: number, completed: boolean }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      // Fetch all active challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from("challenges")
        .select("*")
        .gte("end_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (challengesError) {
        console.error("Error fetching challenges:", challengesError);
        setLoading(false);
        return;
      }

      // Fetch user's joined challenges
      const { data: userChallengesData, error: userChallengesError } = await supabase
        .from("user_challenges")
        .select("challenge_id, progress, completed")
        .eq("user_id", user.id);

      if (userChallengesError) {
        console.error("Error fetching user challenges:", userChallengesError);
      }

      // Create a map of user's challenges for easier lookup
      const userChallengesMap: Record<string, { progress: number, completed: boolean }> = {};
      if (userChallengesData) {
        userChallengesData.forEach(item => {
          userChallengesMap[item.challenge_id] = {
            progress: item.progress,
            completed: item.completed
          };
        });
      }

      setUserChallenges(userChallengesMap);

      // Merge challenge data with user progress
      const enrichedChallenges = challengesData?.map(challenge => ({
        ...challenge,
        joined: !!userChallengesMap[challenge.id],
        progress: userChallengesMap[challenge.id]?.progress || 0,
        completed: userChallengesMap[challenge.id]?.completed || false
      })) || [];

      setChallenges(enrichedChallenges);
    } catch (error) {
      console.error("Error in challenges fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to join a challenge");
        return;
      }

      const { error } = await supabase
        .from("user_challenges")
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
          progress: 0,
          completed: false
        });

      if (error) {
        console.error("Error joining challenge:", error);
        toast.error("Failed to join challenge");
        return;
      }

      toast.success("Successfully joined the challenge!");
      await fetchChallenges();
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const getDaysLeft = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const renderGoal = (challenge: Challenge) => {
    switch (challenge.goal_type) {
      case "steps": return `${challenge.goal_value.toLocaleString()} steps`;
      case "workouts": return `${challenge.goal_value} workouts`;
      case "calories": return `${challenge.goal_value.toLocaleString()} calories burned`;
      default: return `${challenge.goal_value}`;
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Flag className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Fitness Challenges</CardTitle>
          </div>
        </div>
        <CardDescription>
          Join time-bound challenges and compete with the community
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className={`overflow-hidden border ${
                  challenge.completed ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" : ""
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-base">{challenge.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateRange(challenge.start_date, challenge.end_date)}</span>
                      </div>
                    </div>
                    {challenge.completed && (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" /> Completed
                      </Badge>
                    )}
                    {!challenge.completed && challenge.joined && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                        <TrendingUp className="h-3 w-3 mr-1" /> In Progress
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    {challenge.description}
                  </p>
                  
                  <div className="mt-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Goal: {renderGoal(challenge)}</span>
                      {challenge.joined && (
                        <span>
                          {challenge.progress} / {challenge.goal_value} ({Math.round((challenge.progress / challenge.goal_value) * 100)}%)
                        </span>
                      )}
                    </div>
                    
                    {challenge.joined && (
                      <Progress 
                        value={(challenge.progress / challenge.goal_value) * 100} 
                        className="h-2 mt-1"
                        indicatorClassName={challenge.completed ? "bg-green-500" : undefined}
                      />
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    {challenge.joined ? (
                      <span className="text-xs text-muted-foreground">
                        {getDaysLeft(challenge.end_date)} days left
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Join now to start tracking your progress!
                      </span>
                    )}
                    
                    {!challenge.joined && (
                      <Button 
                        size="sm" 
                        onClick={() => joinChallenge(challenge.id)}
                      >
                        Join Challenge
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            
            {challenges.length === 0 && (
              <div className="py-12 text-center text-muted-foreground col-span-2">
                No active challenges available at the moment. Check back soon!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Challenges;
