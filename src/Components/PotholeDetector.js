import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../supabase';

const BUFFER_SIZE = 30;
const SPIKE_THRESHOLD = 2.5;

export default function PotholeDetector({ onDetect }) {
  const [subscription, setSubscription] = useState(null);
  const buffer = useRef([]);
  const cooldown = useRef(Date.now());

  useEffect(() => {
    const subscribe = Accelerometer.addListener(data => {
      const timestamp = Date.now();
      const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
      buffer.current.push({ ...data, timestamp });

      if (buffer.current.length > BUFFER_SIZE) buffer.current.shift();

      if (magnitude > SPIKE_THRESHOLD && timestamp - cooldown.current > 5000) {
        cooldown.current = timestamp;
        handlePotholeDetected();
      }
    });

    setSubscription(subscribe);
    Accelerometer.setUpdateInterval(200);

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const handlePotholeDetected = async () => {
    const sensorBuffer = [...buffer.current];
    if (sensorBuffer.length === 0) return;

    const { coords } = await Location.getCurrentPositionAsync({});

    // Step 1: Add orange marker temporarily
    onDetect({
      latitude: coords.latitude,
      longitude: coords.longitude,
      confirmed: null, // orange
    });

    try {
      const response = await fetch('http://192.168.0.112:3001/analyze-pothole', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sensorBuffer }),
      });

      const result = await response.json();
      const confirmed = result.confirmed ? true : false;

      // Step 2: Show red or yellow
      onDetect({
        latitude: coords.latitude,
        longitude: coords.longitude,
        confirmed,
      });

      // Step 3: Upload to Supabase
      const { error } = await supabase
        .from('potholes')
        .insert({
          latitude: coords.latitude,
          longitude: coords.longitude,
          confirmed,
        });

      if (error) {
        console.error('❌ Supabase upload error:', error.message);
      } else {
        console.log('✅ Pothole uploaded to Supabase');
      }

    } catch (err) {
      console.error('🔥 Gemini API error:', err.message);
    }
  };

  return null;
}
