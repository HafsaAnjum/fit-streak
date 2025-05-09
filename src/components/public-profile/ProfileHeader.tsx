
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  avatar_url: string;
  bio?: string;
  fitness_level?: string;
  streak?: {
    current_streak: number;
    longest_streak: number;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  avatar_url,
  bio,
  fitness_level,
  streak
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-2">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatar_url} alt={username} />
          <AvatarFallback>{username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-2xl font-semibold">{username}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {fitness_level && (
              <Badge variant="outline" className="bg-primary/10">
                {fitness_level}
              </Badge>
            )}
            {streak?.current_streak > 0 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                <TrendingUp className="h-3 w-3 mr-1" /> {streak.current_streak} Day Streak
              </Badge>
            )}
          </div>
        </div>
      </div>

      {bio && (
        <p className="text-sm text-muted-foreground mt-2">
          {bio}
        </p>
      )}
    </>
  );
};

export default ProfileHeader;
