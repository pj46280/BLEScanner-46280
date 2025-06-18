import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  FlatList,
  Text,
  View,
  Button,
} from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

export default function App() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    requestPermissions();
    return () => {
      manager.destroy();
    }
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  };

  const startScan = () => {
    setDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn(error);
        return;
      }

      if (device && !devices.find(d => d.id === device.id)) {
        setDevices(prev => [...prev, device]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Start BLE Scan" onPress={startScan} />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>Name: {item.name || 'Unknown'}</Text>
            <Text>ID: {item.id}</Text>
            <Text>RSSI: {item.rssi}</Text>
          </View>
        )}
      />
    </View>
  );
}