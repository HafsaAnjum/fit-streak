
import { supabase } from './supabase';
import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';

// Key for storing last sync timestamp
const LAST_SYNC_KEY = 'LAST_SYNC_TIMESTAMP';

// Function to check if internet is available
export const isNetworkAvailable = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected === true;
};

// Save last sync timestamp
export const saveLastSyncTime = async () => {
  const timestamp = new Date().toISOString();
  await SecureStore.setItemAsync(LAST_SYNC_KEY, timestamp);
  return timestamp;
};

// Get last sync timestamp
export const getLastSyncTime = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(LAST_SYNC_KEY);
  } catch (error) {
    console.error('Error retrieving last sync time:', error);
    return null;
  }
};

// Sync fitness data with Supabase
export const syncFitnessData = async (fitnessData: any): Promise<boolean> => {
  try {
    if (!fitnessData) return false;
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Create a new record in the fitness_sync table
    const { error } = await supabase
      .from('activities')
      .insert([
        {
          user_id: userData.user.id,
          type: 'health_connect_sync',
          steps: fitnessData.steps.reduce((total: number, day: any) => total + day.value, 0),
          calories: fitnessData.calories.reduce((total: number, day: any) => total + day.value, 0),
          distance: fitnessData.distance.reduce((total: number, day: any) => total + day.value, 0),
          heart_rate: fitnessData.heartRate.length > 0 ? 
            Math.round(fitnessData.heartRate.reduce((total: number, day: any) => total + day.value, 0) / fitnessData.heartRate.length) : 
            null,
          completed_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error syncing fitness data:', error);
      return false;
    }
    
    // Store detailed metrics for each day
    for (const day of fitnessData.steps) {
      const matchingCalories = fitnessData.calories.find((c: any) => c.date === day.date);
      const matchingDistance = fitnessData.distance.find((d: any) => d.date === day.date);
      const matchingHeartRate = fitnessData.heartRate.find((h: any) => h.date === day.date);
      
      await supabase
        .from('activities')
        .insert([
          {
            user_id: userData.user.id,
            type: 'daily_metrics',
            steps: day.value,
            calories: matchingCalories ? matchingCalories.value : null,
            distance: matchingDistance ? matchingDistance.value : null,
            heart_rate: matchingHeartRate ? matchingHeartRate.value : null,
            completed_at: `${day.date}T12:00:00Z` // Set to noon on the given day
          }
        ]);
    }
    
    // Update last sync time
    await saveLastSyncTime();
    return true;
  } catch (error) {
    console.error('Error in syncFitnessData:', error);
    return false;
  }
};

// Schedule periodic sync (called on app start)
export const initializeBackgroundSync = () => {
  // Check and sync every hour when app is in foreground
  setInterval(async () => {
    const isConnected = await isNetworkAvailable();
    if (isConnected) {
      // Check if user is authenticated
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        console.log('Running background sync...');
        // Import dynamically to avoid circular dependencies
        const { getAllFitnessData } = require('./healthConnect');
        const fitnessData = await getAllFitnessData(7);
        await syncFitnessData(fitnessData);
      }
    }
  }, 60 * 60 * 1000); // Every hour
};
