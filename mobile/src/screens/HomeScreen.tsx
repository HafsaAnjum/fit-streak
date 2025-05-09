
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../providers/AuthProvider';
import { initializeHealthConnect, getAllFitnessData } from '../lib/healthConnect';
import { syncFitnessData, getLastSyncTime } from '../lib/syncService';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { signOut, user } = useAuth();
  const [healthConnectAvailable, setHealthConnectAvailable] = useState<boolean | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    checkHealthConnectAvailability();
    loadLastSyncTime();
    fetchUserProfile();
  }, []);
  
  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, fitness_level')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      setUserData(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };
  
  const checkHealthConnectAvailability = async () => {
    const isInitialized = await initializeHealthConnect();
    setHealthConnectAvailable(isInitialized);
  };
  
  const loadLastSyncTime = async () => {
    const timestamp = await getLastSyncTime();
    setLastSync(timestamp);
  };
  
  const handlePermissions = () => {
    navigation.navigate('Permissions');
  };
  
  const handleSync = () => {
    navigation.navigate('Sync');
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await checkHealthConnectAvailability();
    await loadLastSyncTime();
    await fetchUserProfile();
    setRefreshing(false);
  };
  
  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert('Error signing out', error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>
            Welcome{userData?.username ? `, ${userData.username}` : ''}!
          </Text>
          <Text style={styles.subtitleText}>
            FitStreak Mobile Companion
          </Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>Health Connect Status</Text>
        <View style={styles.statusItem}>
          <Text>Health Connect Available:</Text>
          <Text style={healthConnectAvailable ? styles.statusAvailable : styles.statusUnavailable}>
            {healthConnectAvailable === null ? 'Checking...' : 
             healthConnectAvailable ? 'Available' : 'Unavailable'}
          </Text>
        </View>
        
        <View style={styles.statusItem}>
          <Text>Last Sync:</Text>
          <Text>{lastSync ? new Date(lastSync).toLocaleString() : 'Never'}</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, !healthConnectAvailable && styles.disabledButton]} 
          onPress={handlePermissions}
          disabled={!healthConnectAvailable}
        >
          <Text style={styles.actionButtonText}>Manage Permissions</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton, !healthConnectAvailable && styles.disabledButton]} 
          onPress={handleSync}
          disabled={!healthConnectAvailable}
        >
          <Text style={styles.primaryButtonText}>Sync Health Data</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.infoText}>
          This app syncs your fitness data from Health Connect to your FitStreak web account.
        </Text>
        <Text style={styles.infoText}>
          1. Enable Health Connect permissions
        </Text>
        <Text style={styles.infoText}>
          2. Sync your data manually or let it sync automatically
        </Text>
        <Text style={styles.infoText}>
          3. View your combined fitness data on the FitStreak web app
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#334155',
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  signOutButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signOutText: {
    color: '#64748b',
    fontSize: 14,
  },
  statusContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#334155',
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  statusAvailable: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  statusUnavailable: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  actionsContainer: {
    margin: 20,
    marginTop: 0,
    flexDirection: 'column',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    opacity: 0.7,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    color: '#64748b',
    marginBottom: 10,
    lineHeight: 20,
  },
});
