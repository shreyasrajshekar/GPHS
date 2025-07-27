import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../../supabase';

export default function MapViewScreen() {
  const [region, setRegion] = useState(null);
  const [confirmedPotholes, setConfirmedPotholes] = useState([]);
  const [unconfirmedPotholes, setUnconfirmedPotholes] = useState([]);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [showStats, setShowStats] = useState(false);


  
  useEffect(() => {
    const fetchPotholes = async () => {
      const { data, error } = await supabase.from('potholes').select('*');

      if (error) {
        console.error('🛑 Error fetching potholes:', error.message);
      } else {
        const confirmed = data.filter(p => p.confirmed);
        const unconfirmed = data.filter(p => !p.confirmed);

        setConfirmedPotholes(confirmed);
        setUnconfirmedPotholes(unconfirmed);
        setConfirmedCount(confirmed.length);

        // Center map roughly on first pothole if no region set
        if (data.length > 0 && !region) {
          setRegion({
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      }
    };

    fetchPotholes();
  }, []);

  if (!region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation
      >
        {confirmedPotholes.map((p, i) => (
          <Marker
            key={`confirmed-${i}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            pinColor="red"
          />
        ))}
        {unconfirmedPotholes.map((p, i) => (
          <Marker
            key={`unconfirmed-${i}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            pinColor="yellow"
          />
        ))}
      </MapView>
        <TouchableOpacity style={styles.statsButton} onPress={() => setShowStats(true)}>
            <Text style={styles.statsButtonText}>Stats</Text>
        </TouchableOpacity>

        {showStats && (
        <View style={styles.statsModal}>
            <Text style={styles.statsText}>✅ Confirmed: {confirmedPotholes.length}</Text>
            <Text style={styles.statsText}>🟡 Unconfirmed: {unconfirmedPotholes.length}</Text>
            <Text style={styles.statsText}>🕒 Pending: {
                confirmedPotholes.length + unconfirmedPotholes.length === 0
                    ? 'Unknown'
                    : Math.max(0, (confirmedPotholes.length + unconfirmedPotholes.length) - (confirmedPotholes.length + unconfirmedPotholes.length))
            }</Text>

                <TouchableOpacity style={styles.closeButton} onPress={() => setShowStats(false)}>
                <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
  </View>
)}
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
  footer: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  backgroundColor: '#2b4d70ff',
  padding: 10,
  alignItems: 'center',
},
footerText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
statsButton: {
  position: 'absolute',
  bottom: 60,
  right: 20,
  backgroundColor: '#9dc5eeff',
  paddingVertical: 12,
  paddingHorizontal: 18,
  borderRadius: 25,
  shadowColor: '#000',
  shadowOffset: { width: 2, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 6,
},
statsButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},
statsModal: {
  position: 'absolute',
  bottom: 110,
  right: 20,
  backgroundColor: 'rgba(157, 197, 238, 0.6)',
  padding: 16,
  borderRadius: 10,
  width: 220,
  borderWidth:1,
  borderColor: '#81b7ecff',
},
statsText: {
  color: '#fff',
  fontSize: 16,
  marginVertical: 4,
},
closeButton: {
  marginTop: 10,
  alignSelf: 'flex-end',
  justifyContent: 'center',
  alignItems: 'center',
    borderRadius:7,
    width:70,
    height:30,
    backgroundColor:'#4da0ffff',
    
    borderRadius: 12,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
},
closeText: {
  color: '#000000ff',
  fontSize: 14,
},
});
