import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/HomeScreen';
import Login from './components/login';
import Signup from './components/Signup';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
    
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff5ee',
        },
        headerTintColor: 'coral',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
               <Stack.Screen
                   name="Signup" 
                   component={Signup} 
                   options={{ title: 'Signup' }}
                />
                
            </Stack.Navigator>
        </NavigationContainer>
    );
}