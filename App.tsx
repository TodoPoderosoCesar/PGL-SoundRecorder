import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RecorderScreen from './screens/RecorderScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Grabadora"
          component={RecorderScreen}
          options={{ title: 'Grabadora de Audio' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
