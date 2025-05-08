
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Activity, Flame, Timer, Heart } from "lucide-react";

interface StatItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
}

const StatItem = ({ label, value, icon, color = "bg-primary/10" }: StatItemProps) => {
  return (
    <div className="flex justify-between items-center py-3 border-b last:border-0 last:pb-0 group hover:bg-muted/30 px-2 rounded-md transition-colors">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`${color} p-2 rounded-md`}>
            {icon}
          </div>
        )}
        <p className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</p>
      </div>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const ProfileStats: React.FC = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/10 transition-all duration-300 shadow-sm hover:shadow-md">
        <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-purple-400/5">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Fitness Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <motion.div className="space-y-4" variants={container}>
            <motion.div variants={item}>
              <StatItem 
                label="Average Daily Steps" 
                value="7,842" 
                icon={<Activity className="h-4 w-4 text-blue-500" />}
                color="bg-blue-500/10"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatItem 
                label="Average Daily Calories" 
                value="427 kcal" 
                icon={<Flame className="h-4 w-4 text-orange-500" />}
                color="bg-orange-500/10"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatItem 
                label="Average Active Minutes" 
                value="48 min" 
                icon={<Timer className="h-4 w-4 text-green-500" />}
                color="bg-green-500/10"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatItem 
                label="Average Resting Heart Rate" 
                value="72 bpm" 
                icon={<Heart className="h-4 w-4 text-red-500" />}
                color="bg-red-500/10"
              />
            </motion.div>
            <motion.div variants={item}>
              <StatItem 
                label="Weekly Distance" 
                value="23.6 km" 
                icon={<Activity className="h-4 w-4 text-purple-500" />}
                color="bg-purple-500/10"
              />
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileStats;
export { StatItem };
