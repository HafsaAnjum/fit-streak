
import { useState, useEffect } from "react";
import { GoogleFitService } from "@/services/GoogleFitService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export interface FitnessData {
  steps: { date: string; value: number }[];
  calories: { date: string; value: number }[];
  distance: { date: string; value: number }[];
  activeMinutes: { date: string; value: number }[];
  lastSynced: string;
}

interface UseFitnessDataOptions {
  days?: number;
  refreshInterval?: number | null;
}

export const useFitnessData = (options: UseFitnessDataOptions = {}) => {
  const { days = 7, refreshInterval = null } = options;
  const [data, setData] = useState<FitnessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  
  // Function to fetch fitness data
  const fetchFitnessData = async () => {
    setLoading(true);
    try {
      // Check if connected to Google Fit
      const connected = await GoogleFitService.isConnected();
      setIsConnected(connected);
      
      if (!connected) {
        setData(null);
        setLoading(false);
        return;
      }
      
      // Get data from Google Fit
      const fitnessData = await GoogleFitService.getFitnessData(days);
      
      if (fitnessData) {
        setData(fitnessData);
      }
    } catch (err) {
      console.error('Error fetching fitness data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error('Failed to load fitness data', {
        description: 'Please try again or reconnect your fitness account'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data initially
  useEffect(() => {
    if (user) {
      fetchFitnessData();
    } else {
      setIsConnected(false);
      setData(null);
    }
  }, [user, days]);
  
  // Set up refresh interval if specified
  useEffect(() => {
    if (!refreshInterval || !user) return;
    
    const intervalId = setInterval(fetchFitnessData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, user]);
  
  return {
    data,
    loading,
    error, 
    isConnected,
    refresh: fetchFitnessData
  };
};
