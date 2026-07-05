import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddDonationScreen from '../screens/AddDonationScreen';
import PendingDonationsScreen from '../screens/PendingDonationsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import UpiQrScreen from '../screens/UpiQrScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddDonation" component={AddDonationScreen} />
        <Stack.Screen name="PendingDonations" component={PendingDonationsScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="UpiQr" component={UpiQrScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}