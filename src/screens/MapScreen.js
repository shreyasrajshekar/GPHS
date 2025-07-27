import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../../supabase';
import PotholeDetector from '../Components/PotholeDetector';
import { uploadPothole } from '../utils/uploadPothole';


export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [confirmedPotholes, setConfirmedPotholes] = useState([]);
  const [tempMarkers, setTempMarkers] = useState([]);
  const [accelData, setAccelData] = useState({ x: 0, y: 0, z: 0 });
  const [unconfirmedPotholes, setUnconfirmedPotholes] = useState([]);



  useEffect(() => {
  const fetchPotholes = async () => {
    const { data, error } = await supabase
      .from('potholes')
      .select('*');

    if (error) {
      console.error('🛑 Fetch error:', error.message);
    } else {
      console.log('📍 Loaded potholes from DB:', data);
      setConfirmedPotholes(data);
    }
  };

  fetchPotholes();
}, []);
  
  useEffect(() => {
    const subscription = Accelerometer.addListener(data => {
      setAccelData(data);
    });
    Accelerometer.setUpdateInterval(200);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      
      const { data, error } = await supabase
        .from('potholes')
        .select('*'); 

      if (error) {
        console.error('Supabase fetch error:', error.message);
      } else {
        const confirmed = data.filter(p => p.confirmed);
        const unconfirmed = data.filter(p => !p.confirmed);

        const confirmedMarkers = confirmed.map(p => ({
          latitude: Number(p.latitude),
          longitude: Number(p.longitude),
          confirmed: true,
        }));

        const unconfirmedMarkers = unconfirmed.map(p => ({
          latitude: Number(p.latitude),
          longitude: Number(p.longitude),
          confirmed: false,
        }));
        setConfirmedPotholes([...confirmedMarkers, ...unconfirmedMarkers]);
      }
    })();
  }, []);

  let lastDetectionTime = 0;

  const handlePotholeDetection = async ({ data, timestamp, bufferedData }) => {
    const now = Date.now();
    if (now - lastDetectionTime < 5000) return;
    lastDetectionTime = now;

    if (!location) return;

    const tempCoord = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    setTempMarkers(prev => [...prev, tempCoord]);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    console.log("Sending to Gemini:", bufferedData);

    try {
      const response = await fetch('http://192.168.1.4:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorData: bufferedData }),
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const result = await response.json();
      console.log('Gemini:', result.message || result);

      await uploadPothole(tempCoord.latitude, tempCoord.longitude, result.isPothole);

      if (result.isPothole) {
        setConfirmedPotholes(prev => [
            ...prev,
            {
              latitude: Number(tempCoord.latitude),
              longitude: Number(tempCoord.longitude),
              confirmed: true,
            }
          ]);
      }
    } catch (err) {
      console.error('Gemini API error:', err.message || err);
    }

    setTempMarkers(prev => prev.filter(p => p !== tempCoord));
  };


  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PotholeDetector onDetect={(data) => {
    console.log("📍 Confirmed pothole added to map:", data);
    setConfirmedPotholes(prev => [...prev, data]);
  }}/>
      <MapView style={styles.map} region={region} showsUserLocation followsUserLocation>
         
          {confirmedPotholes.map((p, i) => (
            <Marker
                key={`confirmed-${i}`}
                coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                pinColor={
                  p.confirmed === true ? 'red' :
                  p.confirmed === false ? 'yellow' :
                  'orange'}
                  
                >
              {/*<View
                style={[
                  styles.potholeDot,
                  {
                    backgroundColor:
                      p.confirmed === true ? 'red' :
                      p.confirmed === false ? 'yellow' :
                      'orange'
                  }
                ]}
              /> */}
            </Marker>
          ))}

         
          {tempMarkers.map((p, i) => (
            <Marker key={`temp-${i}`} coordinate={p}>
              <View
                style={[styles.tempDot, { backgroundColor: 'orange' }]}
              />
            </Marker>
          ))}
        </MapView>

      <View style={styles.sensorBox}>
        <Text style={styles.sensorText}>X: {accelData.x?.toFixed(2)}</Text>
        <Text style={styles.sensorText}>Y: {accelData.y?.toFixed(2)}</Text>
        <Text style={styles.sensorText}>Z: {accelData.z?.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  potholeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    borderWidth: 1,
    borderColor: 'white',
  },
  tempDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'orange',
    borderWidth: 1,
    borderColor: 'white',
  },
  sensorBox: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
  },
  unconfirmedDot: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: 'yellow',
  borderWidth: 1,
  borderColor: 'white',
},
  sensorText: {
    color: 'white',
    fontSize: 14,
  },
});
