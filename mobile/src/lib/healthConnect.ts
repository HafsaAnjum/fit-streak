
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
import { Time, TimeUnit } from 'react-native-health-connect/lib/typescript/types/base.types';

// Initialize Health Connect
export const initializeHealthConnect = async () => {
  try {
    const isInitialized = await initialize();
    return isInitialized;
  } catch (error) {
    console.error('Failed to initialize Health Connect:', error);
    return false;
  }
};

// Request necessary permissions
export const requestHealthConnectPermissions = async () => {
  try {
    const grantedPermissions = await requestPermission([
      { accessType: 'read', recordType: 'Steps' },
      { accessType: 'read', recordType: 'HeartRate' },
      { accessType: 'read', recordType: 'TotalCaloriesBurned' },
      { accessType: 'read', recordType: 'Distance' },
      { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
    ]);
    return grantedPermissions;
  } catch (error) {
    console.error('Error requesting Health Connect permissions:', error);
    return null;
  }
};

// Get steps data for a specific time range
export const getStepsData = async (startTime: string, endTime: string) => {
  try {
    const response = await readRecords('Steps', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime,
        endTime: endTime,
      },
    });
    return response;
  } catch (error) {
    console.error('Error reading steps data:', error);
    return [];
  }
};

// Get heart rate data for a specific time range
export const getHeartRateData = async (startTime: string, endTime: string) => {
  try {
    const response = await readRecords('HeartRate', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime,
        endTime: endTime,
      },
    });
    return response;
  } catch (error) {
    console.error('Error reading heart rate data:', error);
    return [];
  }
};

// Get calories burned data for a specific time range
export const getCaloriesData = async (startTime: string, endTime: string) => {
  try {
    const response = await readRecords('TotalCaloriesBurned', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime,
        endTime: endTime,
      },
    });
    return response;
  } catch (error) {
    console.error('Error reading calories data:', error);
    return [];
  }
};

// Get distance data for a specific time range
export const getDistanceData = async (startTime: string, endTime: string) => {
  try {
    const response = await readRecords('Distance', {
      timeRangeFilter: {
        operator: 'between',
        startTime: startTime,
        endTime: endTime,
      },
    });
    return response;
  } catch (error) {
    console.error('Error reading distance data:', error);
    return [];
  }
};

// Get all fitness data needed for syncing
export const getAllFitnessData = async (days = 7) => {
  try {
    // Calculate time range
    const endTime = new Date().toISOString();
    const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    
    // Get all data types
    const [steps, heartRate, calories, distance] = await Promise.all([
      getStepsData(startTime, endTime),
      getHeartRateData(startTime, endTime),
      getCaloriesData(startTime, endTime),
      getDistanceData(startTime, endTime),
    ]);

    // Process and format data by day
    const processedData = processAllData(steps, heartRate, calories, distance);
    
    return {
      steps: processedData.steps,
      heartRate: processedData.heartRate,
      calories: processedData.calories,
      distance: processedData.distance,
      lastSynced: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching all fitness data:', error);
    return null;
  }
};

// Process and aggregate data by day
function processAllData(steps: any, heartRate: any, calories: any, distance: any) {
  // Create maps to aggregate data by day
  const stepsMap: Record<string, number> = {};
  const heartRateMap: Record<string, number[]> = {};
  const caloriesMap: Record<string, number> = {};
  const distanceMap: Record<string, number> = {};
  
  // Process steps data
  steps.forEach((record: any) => {
    const date = new Date(record.startTime).toISOString().split('T')[0];
    stepsMap[date] = (stepsMap[date] || 0) + record.count;
  });
  
  // Process heart rate data (calculate average per day)
  heartRate.forEach((record: any) => {
    const date = new Date(record.time).toISOString().split('T')[0];
    if (!heartRateMap[date]) heartRateMap[date] = [];
    heartRateMap[date].push(record.beatsPerMinute);
  });
  
  // Process calories data
  calories.forEach((record: any) => {
    const date = new Date(record.startTime).toISOString().split('T')[0];
    caloriesMap[date] = (caloriesMap[date] || 0) + record.energy.inCalories;
  });
  
  // Process distance data
  distance.forEach((record: any) => {
    const date = new Date(record.startTime).toISOString().split('T')[0];
    distanceMap[date] = (distanceMap[date] || 0) + record.distance.inMeters / 1000;
  });
  
  // Convert maps to array format with date and value properties
  return {
    steps: Object.entries(stepsMap).map(([date, value]) => ({ date, value })),
    heartRate: Object.entries(heartRateMap).map(([date, values]) => {
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      return { date, value: Math.round(average) };
    }),
    calories: Object.entries(caloriesMap).map(([date, value]) => ({ date, value })),
    distance: Object.entries(distanceMap).map(([date, value]) => ({ date, value: parseFloat(value.toFixed(2)) })),
  };
}
