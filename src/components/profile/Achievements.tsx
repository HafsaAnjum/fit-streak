
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award } from "lucide-react";

interface AchievementCardProps {
  title: string;
  icon: React.ReactNode;
  earned: boolean;
  progress?: number;
  date?: string;
}

const AchievementCard = ({ title, icon, earned, progress, date }: AchievementCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className={`p-4 flex flex-col items-center text-center ${earned ? '' : 'opacity-50'}`}>
        <div className={`p-3 rounded-full mb-3 ${earned ? 'fitness-gradient text-white' : 'bg-muted text-muted-foreground'}`}>
          {icon}
        </div>
        <h3 className="font-medium text-sm">{title}</h3>
        {earned ? (
          <p className="text-xs text-muted-foreground mt-1">Earned {date}</p>
        ) : (
          <div className="w-full mt-2">
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">{progress}% complete</p>
          </div>
        )}
      </div>
    </Card>
  );
};

const Achievements: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <AchievementCard title="7-Day Streak" icon={<Award />} earned={true} date="May 2, 2025" />
      <AchievementCard title="Marathon Runner" icon={<Award />} earned={true} date="Apr 28, 2025" />
      <AchievementCard title="Early Bird" icon={<Award />} earned={true} date="Apr 25, 2025" />
      <AchievementCard title="Power Lifter" icon={<Award />} earned={false} progress={65} />
      <AchievementCard title="Century Club" icon={<Award />} earned={false} progress={23} />
      <AchievementCard title="Night Owl" icon={<Award />} earned={false} progress={45} />
      <AchievementCard title="Mountain Climber" icon={<Award />} earned={false} progress={10} />
    </div>
  );
};

export default Achievements;
export { AchievementCard };
