
// Process and aggregate data by day
export function processDataPoints(
  apiResponse: any,
  startTimeMillis: number,
  days: number
) {
  // Create a map for all days in the range
  const dayMap: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const date = new Date(startTimeMillis + i * 86400000);
    const dateStr = date.toISOString().split('T')[0];
    dayMap[dateStr] = 0;
  }
  
  // Process data points from the API response
  try {
    if (apiResponse?.bucket) {
      for (const bucket of apiResponse.bucket) {
        if (bucket.dataset?.[0]?.point) {
          for (const point of bucket.dataset[0].point) {
            if (point.value?.[0]?.intVal || point.value?.[0]?.fpVal) {
              const value = point.value[0].intVal || point.value[0].fpVal;
              const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0];
              dayMap[date] = (dayMap[date] || 0) + value;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error processing data points:", error);
  }
  
  // Convert to array format
  return Object.entries(dayMap).map(([date, value]) => ({ date, value }));
}

// Generate mock fitness data for testing
export function generateMockFitnessData(days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const steps: { date: string; value: number }[] = [];
  const calories: { date: string; value: number }[] = [];
  const distance: { date: string; value: number }[] = [];
  const activeMinutes: { date: string; value: number }[] = [];
  
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Generate some realistic-looking random data with a weekly pattern
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const baseSteps = isWeekend ? 12000 : 9000;
    const baseCalories = isWeekend ? 2500 : 2200;
    const baseDistance = isWeekend ? 8 : 6;
    const baseActiveMinutes = isWeekend ? 90 : 60;
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    
    steps.push({
      date: dateStr,
      value: Math.round(baseSteps * randomFactor)
    });
    
    calories.push({
      date: dateStr,
      value: Math.round(baseCalories * randomFactor)
    });
    
    distance.push({
      date: dateStr,
      value: Math.round(baseDistance * randomFactor * 10) / 10
    });
    
    activeMinutes.push({
      date: dateStr,
      value: Math.round(baseActiveMinutes * randomFactor)
    });
  }
  
  return {
    steps,
    calories,
    distance,
    activeMinutes,
    lastSynced: new Date().toISOString()
  };
}
