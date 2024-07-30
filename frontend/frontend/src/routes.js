import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import RememberAccountPage from './components/RememberAccountPage'


const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="login" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="register" component={RegisterPage} options={{ headerShown: false }} />
            <Stack.Screen name="remember-account" component={RememberAccountPage} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}