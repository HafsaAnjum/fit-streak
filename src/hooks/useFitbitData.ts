
import { useState, useEffect } from "react";
import { FitbitService } from "@/services/FitbitService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export interface FitbitData {
  steps: { date: string; value: number }[];
  calories: { date: string; value: number }[];
  heartRate: { date: string; value: number }[];
  sleep: { date: string; value: number }[];
  lastSynced: string;
}

interface UseFitbitDataOptions {
  days?: number;
  refreshInterval?: number | null;
}

export const useFitbitData = (options: UseFitbitDataOptions = {}) => {
  const { days = 7, refreshInterval = null } = options;
  const [data, setData] = useState<FitbitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  
  // Function to fetch fitness data
  const fetchFitnessData = async () => {
    setLoading(true);
    try {
      // Check if connected to Fitbit
      const connected = await FitbitService.isConnected();
      setIsConnected(connected);
      
      if (!connected) {
        setData(null);
        return;
      }
      
      // Get data from Fitbit
      const fitbitData = await FitbitService.getFitnessData(days);
      
      if (fitbitData) {
        setData(fitbitData);
      }
    } catch (err) {
      console.error('Error fetching Fitbit data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error('Failed to load Fitbit data', {
        description: 'Please try again or reconnect your Fitbit account'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data initially
  useEffect(() => {
    if (user) {
      fetchFitnessData();
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
