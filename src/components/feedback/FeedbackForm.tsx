
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface FeedbackFormProps {
  onClose?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackType, setFeedbackType] = useState<"general" | "bug" | "feature">("general");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit feedback");
      return;
    }
    
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback before submitting");
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { error } = await supabase.from("user_feedback").insert({
        user_id: user.id,
        feedback_text: feedbackText.trim(),
        feedback_type: feedbackType,
        rating: rating || null,
      });
      
      if (error) throw error;
      
      toast.success("Thank you for your feedback!");
      setFeedbackText("");
      setRating(0);
      setFeedbackType("general");
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-6 w-6 cursor-pointer ${
            index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => setRating(index + 1)}
        />
      ));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
          <CardDescription>
            Help us improve your experience by sharing your thoughts.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Feedback Type</label>
            <Select
              value={feedbackType}
              onValueChange={(value: "general" | "bug" | "feature") => setFeedbackType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Feedback</SelectItem>
                <SelectItem value="bug">Report a Bug</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Feedback</label>
            <Textarea
              placeholder="Tell us what you think..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[120px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Rate Your Experience (Optional)</label>
            <div className="flex space-x-1">{renderStars()}</div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={submitting || !feedbackText.trim()}>
            {submitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default FeedbackForm;
