
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Share, Share2, Link, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { WorkoutSession } from "@/services/workout/types";

interface WorkoutSharingProps {
  workout?: WorkoutSession;
  userId?: string;
}

const WorkoutSharing = ({ workout, userId }: WorkoutSharingProps) => {
  const [isPublic, setIsPublic] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl = window.location.origin;
  const shareUrl = userId ? `${baseUrl}/u/${userId}` : baseUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWorkout = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my workout!',
        text: `I just completed a ${workout?.activity_type} workout. ${workout?.duration ? `Duration: ${Math.floor(workout.duration / 60)} minutes. ` : ''}${workout?.steps ? `Steps: ${workout.steps}. ` : ''}${workout?.calories_burned ? `Calories burned: ${workout.calories_burned}.` : ''}`,
        url: shareUrl,
      })
      .then(() => toast.success("Shared successfully"))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      handleCopyLink();
    }
  };

  const updatePrivacySettings = async () => {
    try {
      const newValue = !isPublic;
      // Update privacy settings in the database
      // Placeholder for actual implementation
      setIsPublic(newValue);
      toast.success(`Profile visibility ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error("Failed to update privacy settings");
    }
  };

  return (
    <Card className="border shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/10 p-1.5">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">Share Your Progress</CardTitle>
        </div>
        <CardDescription>
          Share your workouts and fitness journey with friends
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium mb-1">Public Profile</h3>
            <p className="text-sm text-muted-foreground">
              Allow others to view your fitness profile and achievements
            </p>
          </div>
          <Switch 
            checked={isPublic} 
            onCheckedChange={updatePrivacySettings}
          />
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Your Public Profile</h3>
          <div className="flex gap-2">
            <Input 
              readOnly 
              value={shareUrl} 
              className="bg-muted font-mono text-xs"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isPublic ? "Your profile is visible to anyone with this link" : "Enable public profile to share with others"}
          </p>
        </div>
        
        {workout && (
          <div className="pt-2">
            <h3 className="font-medium mb-3">Share Your Recent Workout</h3>
            <div className="bg-muted p-3 rounded-md mb-3">
              <div className="text-sm font-medium">{workout.activity_type} Workout</div>
              <div className="text-xs text-muted-foreground mt-1">
                {workout.duration && <span>Duration: {Math.floor(workout.duration / 60)} minutes • </span>}
                {workout.steps && <span>Steps: {workout.steps} • </span>}
                {workout.calories_burned && <span>Calories: {workout.calories_burned}</span>}
              </div>
            </div>
            <Button 
              onClick={handleShareWorkout} 
              className="w-full"
              disabled={!isPublic}
            >
              <Share className="h-4 w-4 mr-2" /> 
              Share This Workout
            </Button>
            {!isPublic && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Enable public profile to share your workouts
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutSharing;
