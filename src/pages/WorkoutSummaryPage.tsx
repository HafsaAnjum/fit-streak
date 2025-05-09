
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Award, Share2, Star, Calendar, Clock, Flame, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface WorkoutStats {
  duration: number;
  calories: number;
  steps: number;
}

const WorkoutSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stats: WorkoutStats = location.state?.stats || {
    duration: 1500,  // 25 minutes in seconds
    calories: 320,
    steps: 3200,
  };
  
  // Format duration from seconds to minutes:seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate a random workout score between 80-100 based on calories and duration
  const calculateScore = () => {
    const baseScore = 80;
    const calorieBonus = Math.min(Math.floor(stats.calories / 50), 15);
    const durationBonus = Math.min(Math.floor(stats.duration / 300), 5);
    return baseScore + calorieBonus + durationBonus;
  };
  
  const score = calculateScore();
  
  const handleShare = () => {
    toast.success("Workout shared to your profile");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 pb-24 md:pb-6 space-y-6"
    >
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Workout Summary</h1>
      </div>
      
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 p-6">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className="mb-2 bg-background/50">Today</Badge>
              <h2 className="text-xl font-bold">Great Workout!</h2>
              <p className="text-muted-foreground">You've completed your session</p>
            </div>
            <div className="bg-background/80 rounded-full h-16 w-16 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-primary">{score}</span>
              <span className="text-xs">Score</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-primary mr-2" />
                <span className="font-bold">{formatDuration(stats.duration)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Calories</p>
              <div className="flex items-center">
                <Flame className="h-4 w-4 text-orange-500 mr-2" />
                <span className="font-bold">{stats.calories} kcal</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Steps</p>
              <div className="flex items-center">
                <Activity className="h-4 w-4 text-blue-500 mr-2" />
                <span className="font-bold">{stats.steps}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Level</p>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-500 mr-2" />
                <span className="font-bold">Intermediate</span>
              </div>
            </div>
          </div>
          
          {/* Achievement Card */}
          <Card className="bg-gradient-to-r from-amber-100/50 to-amber-200/50 dark:from-amber-900/20 dark:to-amber-800/20 mb-6 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4 flex items-center">
              <div className="bg-amber-200/50 dark:bg-amber-700/30 p-2 rounded-full mr-3">
                <Award className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-sm">Achievement Unlocked!</h3>
                <p className="text-xs text-muted-foreground">3 Workouts This Week</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button 
              className="w-full"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/workouts')}
            >
              <Calendar className="mr-2 h-5 w-5" />
              More Workouts
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendations Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended Next</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <RecommendationItem 
              title="Upper Body Focus" 
              description="Balance your training with this upper body workout"
            />
            <RecommendationItem 
              title="Recovery Stretch" 
              description="Improve flexibility and recovery with this 15-minute routine"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface RecommendationItemProps {
  title: string;
  description: string;
}

const RecommendationItem = ({ title, description }: RecommendationItemProps) => (
  <Button 
    variant="outline" 
    className="w-full justify-between h-auto p-3 hover:bg-muted/50"
    asChild
  >
    <Link to="/workouts">
      <div className="flex flex-col items-start">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground text-left">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4" />
    </Link>
  </Button>
);

// Add this at the top level of the file
const Link = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>(
  ({ to, children, ...props }, ref) => {
    return (
      <a href={to} ref={ref} {...props}>
        {children}
      </a>
    );
  }
);
Link.displayName = 'Link';

export default WorkoutSummaryPage;
