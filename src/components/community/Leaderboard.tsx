import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, TrendingUp, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type LeaderboardMetric = "steps" | "workouts" | "calories";
type LeaderboardPeriod = "weekly" | "monthly";
type LeaderboardScope = "global" | "friends";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string;
  rank: number;
  steps?: number;
  workouts?: number;
  calories_burned?: number;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<LeaderboardMetric>("steps");
  const [period, setPeriod] = useState<LeaderboardPeriod>("weekly");
  const [scope, setScope] = useState<LeaderboardScope>("global");

  useEffect(() => {
    fetchLeaderboardData();
  }, [metric, period, scope]);

  const fetchLeaderboardData = async () => {
    setLoading(true);
    try {
      // Use a simulated leaderboard data since we need to wait for the database to populate
      const mockData: LeaderboardEntry[] = [
        {
          user_id: "1",
          username: "JohnDoe",
          avatar_url: "",
          rank: 1,
          steps: 12500,
          workouts: 5,
          calories_burned: 1200
        },
        {
          user_id: "2",
          username: "JaneSmith",
          avatar_url: "",
          rank: 2,
          steps: 10800,
          workouts: 4,
          calories_burned: 980
        },
        {
          user_id: "3",
          username: "MikeJohnson",
          avatar_url: "",
          rank: 3,
          steps: 9500,
          workouts: 3,
          calories_burned: 850
        }
      ];
      
      setLeaderboardData(mockData);
    } catch (error) {
      console.error("Error in leaderboard fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (metric) {
      case "steps": return entry.steps?.toLocaleString() || "0";
      case "workouts": return entry.workouts?.toString() || "0";
      case "calories": return entry.calories_burned?.toLocaleString() || "0";
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case "steps": return "Steps";
      case "workouts": return "Workouts";
      case "calories": return "Calories";
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-1.5">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">Community Leaderboard</CardTitle>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {period === "weekly" ? "This Week" : "This Month"}
          </Badge>
        </div>
        <CardDescription>
          See how you stack up against other fitness enthusiasts
        </CardDescription>
        
        <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
          <Tabs defaultValue="global" value={scope} onValueChange={(value) => setScope(value as LeaderboardScope)} className="w-full max-w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="global">Global</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Select value={period} onValueChange={(value) => setPeriod(value as LeaderboardPeriod)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={metric} onValueChange={(value) => setMetric(value as LeaderboardMetric)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="steps">Steps</SelectItem>
              <SelectItem value="workouts">Workouts</SelectItem>
              <SelectItem value="calories">Calories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-1">
            {leaderboardData.map((entry, index) => (
              <div 
                key={entry.user_id} 
                className={`flex items-center justify-between rounded-md p-2.5 ${
                  index === 0 ? "bg-amber-50 dark:bg-amber-950/20" :
                  index === 1 ? "bg-slate-100 dark:bg-slate-900/30" :
                  index === 2 ? "bg-orange-50 dark:bg-orange-950/20" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-center w-6 font-semibold">
                    {index === 0 ? <Medal className="h-5 w-5 text-yellow-500" /> :
                     index === 1 ? <Medal className="h-5 w-5 text-slate-400" /> :
                     index === 2 ? <Medal className="h-5 w-5 text-amber-700" /> :
                     `${index + 1}`}
                  </div>
                  
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={entry.avatar_url} alt={entry.username} />
                    <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-sm font-medium">
                    {entry.username}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="font-semibold mr-1.5 text-right">
                    {getMetricValue(entry)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getMetricLabel()}
                  </span>
                </div>
              </div>
            ))}
            
            {leaderboardData.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No leaderboard data available yet. Get active to join the rankings!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
