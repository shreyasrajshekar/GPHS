import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import MapViewScreen from './src/screens/MapViewScreen';
import SplashScreen from './src/screens/SplashScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="MapView" component={MapViewScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
