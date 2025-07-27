import { useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
        <Animated.Image
    source={require('../../assets/images/gimp.png')} // Update the path to your image
    style={[styles.logo, { opacity: fadeAnim, height:300, width: 380 ,}]}
    resizeMode="contain"
  />
      <Animated.Text style={[styles.title, { opacity: fadeAnim ,}]}>
        GPHS
      </Animated.Text>
      <Animated.Text style={[styles.title2, { opacity: fadeAnim ,}]}>
        Global PotHole System
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAE2EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000000ff',
  },
    title2: {
        fontSize: 24,
        color: '#000000ff',
        marginTop:5,
    },
});
