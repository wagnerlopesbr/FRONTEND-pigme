import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import RememberAccountPage from './components/RememberAccountPage'
import MainPage from './components/MainPage'
import CreateList from './components/CreateList'
import NotFoundPage from './components/notFoundPage';
import EditList from './components/EditList';
import CheckList from './components/CheckList';
import PremiumPage from './components/PremiumPage';
import PremiumCheckList from './components/PremiumCheckList';


const Stack = createNativeStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="login" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="register" component={RegisterPage} options={{ headerShown: false }} />
            <Stack.Screen name="remember-account" component={RememberAccountPage} options={{ headerShown: false }} />
            <Stack.Screen name="main" component={MainPage} options={{ headerShown: false }} />
            <Stack.Screen name="not-found-page" component={NotFoundPage} options={{ headerShown: false }} />
            <Stack.Screen name="create-list" component={CreateList} options={{ headerShown: false }} />
            <Stack.Screen name="edit-list" component={EditList} options={{ headerShown: false }} />
            <Stack.Screen name="check-list" component={CheckList} options={{ headerShown: false }} />
            <Stack.Screen name="premium-check-list" component={PremiumCheckList} options={{ headerShown: false }} />
            <Stack.Screen name="premium" component={PremiumPage} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}