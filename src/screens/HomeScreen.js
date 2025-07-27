import LottieView from 'lottie-react-native';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {


  const handleStartTracking = async () => {
    try {
      // Your logic here
      navigation.navigate('Map');
    } catch (error) {
      console.log('Tracking Error:', error);
      Alert.alert('Error', error.message);
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>GPHS</Text>
      <Text style={styles.header1}>Global PotHole System</Text>
     
      <LottieView
      source={require('../../assets/Globe.json')}
      autoPlay
      loop
      resizeMode="cover"
      style={{
          width: 370,
          height: 350,
          alignSelf: 'center',
          marginTop: 50,
          marginRight:20,
        }}
      />

      
      <View style={styles.buttonContainer}>

         <TouchableOpacity
        style={[styles.button, { backgroundColor: '#c0c0c0ff' }]}
        onPress={() => navigation.navigate('Map')}
      >
        <Text style={[styles.buttonText]}> Start Tracking</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.link} 
      onPress={() => navigation.navigate('MapView')}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name="map-marker" size={22} color="#000" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText1}>View Map</Text>
        </View>
      </TouchableOpacity>

     
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAE2EA',
    alignItems: 'center',
    
  },
  buttonText1: {
    color: '#000000ff',
    fontSize: 18,
    
  },
  buttonText2: {
    color: '#ffffffff',
  },
  link:{
    margin:10,

  },
  buttonContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  header: {
    fontSize: 36,
    color: '#000000ff',
    marginTop: 50,
    fontWeight: 'bold',
  },
  header1: {
    fontSize: 20,
    color: '#000000ff',
    marginTop: 5,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  button: {
    
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 1,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 5,
  },
  buttonText: {
    color: '#000000ff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
