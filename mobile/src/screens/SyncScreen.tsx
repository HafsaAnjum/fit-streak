
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllFitnessData } from '../lib/healthConnect';
import { syncFitnessData, saveLastSyncTime, getLastSyncTime } from '../lib/syncService';

export default function SyncScreen() {
  const navigation = useNavigation();
  const [syncState, setSyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [fitnessData, setFitnessData] = useState<any | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadLastSyncTime();
  }, []);
  
  const loadLastSyncTime = async () => {
    const timestamp = await getLastSyncTime();
    setLastSync(timestamp);
  };
  
  const handleSync = async (days: number) => {
    try {
      setSyncState('loading');
      setError(null);
      
      // Fetch data from Health Connect
      const data = await getAllFitnessData(days);
      setFitnessData(data);
      
      if (!data) {
        throw new Error('No fitness data available');
      }
      
      // Sync with Supabase
      const syncSuccess = await syncFitnessData(data);
      
      if (!syncSuccess) {
        throw new Error('Failed to sync with server');
      }
      
      // Update last sync time and state
      const newTimestamp = await saveLastSyncTime();
      setLastSync(newTimestamp);
      setSyncState('success');
      
      // Show success message
      Alert.alert(
        'Sync Complete',
        'Your fitness data has been successfully synced with FitStreak',
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      console.error('Sync error:', err);
      setSyncState('error');
      setError(err.message || 'An unknown error occurred');
      
      Alert.alert(
        'Sync Failed',
        `Error: ${err.message || 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.title}>Sync Health Data</Text>
          <Text style={styles.description}>
            Sync your health and fitness data from Health Connect to your FitStreak account.
          </Text>
          
          {lastSync && (
            <View style={styles.lastSyncContainer}>
              <Text style={styles.lastSyncLabel}>Last synced:</Text>
              <Text style={styles.lastSyncTime}>
                {new Date(lastSync).toLocaleString()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.syncOptions}>
          <Text style={styles.sectionTitle}>Choose Data Range</Text>
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, syncState === 'loading' && styles.disabledButton]}
              onPress={() => handleSync(7)}
              disabled={syncState === 'loading'}
            >
              <Text style={styles.optionButtonText}>Last 7 Days</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionButton, syncState === 'loading' && styles.disabledButton]}
              onPress={() => handleSync(30)}
              disabled={syncState === 'loading'}
            >
              <Text style={styles.optionButtonText}>Last 30 Days</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.optionButton, syncState === 'loading' && styles.disabledButton]}
              onPress={() => handleSync(90)}
              disabled={syncState === 'loading'}
            >
              <Text style={styles.optionButtonText}>Last 90 Days</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {syncState === 'loading' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Syncing data...</Text>
          </View>
        )}
        
        {syncState === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Sync Failed</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => handleSync(7)}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {syncState === 'success' && fitnessData && (
          <View style={styles.resultCard}>
            <View style={styles.successHeader}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>Sync Complete</Text>
            </View>
            
            <Text style={styles.resultSubtitle}>Synced Data Summary:</Text>
            
            <View style={styles.statGrid}>
              <StatItem 
                label="Steps" 
                value={fitnessData.steps.reduce((sum: number, day: any) => sum + day.value, 0).toLocaleString()} 
              />
              <StatItem 
                label="Calories" 
                value={`${Math.round(fitnessData.calories.reduce((sum: number, day: any) => sum + day.value, 0)).toLocaleString()} cal`} 
              />
              <StatItem 
                label="Distance" 
                value={`${fitnessData.distance.reduce((sum: number, day: any) => sum + day.value, 0).toFixed(1)} km`} 
              />
              <StatItem 
                label="Days" 
                value={fitnessData.steps.length.toString()} 
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Stat item component for displaying summary stats
function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 10,
  },
  lastSyncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  lastSyncLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  lastSyncTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  syncOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#334155',
  },
  buttonGroup: {
    flexDirection: 'column',
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  optionButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#b91c1c',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#b91c1c',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#b91c1c',
    fontWeight: '500',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 20,
    color: '#10b981',
    backgroundColor: '#d1fae5',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 10,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
});
