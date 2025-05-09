
import React from "react";
import { Award, CheckCircle } from "lucide-react";

interface Achievement {
  title: string;
  description: string;
  achieved_at: string;
  icon?: string;
}

interface ProfileAchievementsProps {
  achievements?: Achievement[];
}

const ProfileAchievements: React.FC<ProfileAchievementsProps> = ({ achievements = [] }) => {
  return (
    <div>
      <h3 className="font-semibold flex items-center mb-3">
        <Award className="h-4 w-4 mr-1.5" />
        Achievements
      </h3>
      
      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
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
  );
};

export default ProfileAchievements;
