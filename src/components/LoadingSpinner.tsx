
import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />
    </div>
  );
};

export const FullPageLoader: React.FC = () => {
  const pulseVariants = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center z-50"
    >
      <motion.div 
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className="bg-card p-8 rounded-2xl shadow-lg flex flex-col items-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
          <LoadingSpinner size={48} />
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg font-medium bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
        >
          Loading FitStreak
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-full mt-4 w-48"
        ></motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;
