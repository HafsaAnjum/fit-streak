
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { requestHealthConnectPermissions } from '../lib/healthConnect';

export default function PermissionsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<any>(null);
  
  const handleRequestPermissions = async () => {
    setLoading(true);
    try {
      const result = await requestHealthConnectPermissions();
      setPermissions(result);
      
      if (result) {
        Alert.alert(
          'Success',
          'Permissions granted successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.title}>Health Connect Permissions</Text>
          <Text style={styles.description}>
            This app needs permission to read your fitness data from Health Connect:
          </Text>
          
          <View style={styles.permissionsList}>
            <PermissionItem title="Steps" description="Read your daily step count" />
            <PermissionItem title="Heart Rate" description="Read your heart rate measurements" />
            <PermissionItem title="Calories" description="Read your calories burned" />
            <PermissionItem title="Distance" description="Read your walking/running distance" />
          </View>
          
          <Text style={styles.note}>
            You can change these permissions at any time in your device settings.
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRequestPermissions}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Requesting...' : 'Request Permissions'}
          </Text>
        </TouchableOpacity>
        
        {permissions && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Permission Status</Text>
            <Text style={styles.resultText}>
              {JSON.stringify(permissions, null, 2)}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Permission item component
function PermissionItem({ title, description }: { title: string, description: string }) {
  return (
    <View style={styles.permissionItem}>
      <View style={styles.permissionDot} />
      <View>
        <Text style={styles.permissionTitle}>{title}</Text>
        <Text style={styles.permissionDescription}>{description}</Text>
      </View>
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
    marginBottom: 20,
  },
  permissionsList: {
    marginBottom: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  permissionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginRight: 12,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  permissionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#334155',
  },
  resultText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'monospace',
  },
});
