import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import UpiSettingsScreen from "../screens/UpiSettingsScreen";
import HomeScreen from "../screens/HomeScreen";
import AddDonationScreen from "../screens/AddDonationScreen";
import PendingDonationsScreen from "../screens/PendingDonationsScreen";
import EditDonationScreen from "../screens/EditDonationScreen";
import ReportsScreen from "../screens/ReportsScreen";
import UpiQrScreen from "../screens/UpiQrScreen";
import AdminClearDataScreen from "../screens/AdminClearDataScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "#FFFFFF",
          headerTitleAlign: "center",

          headerBackground: () => (
            <LinearGradient
              colors={[
                "rgba(2, 0, 36, 1)",
                "rgba(121, 9, 117, 1)",
                "rgba(255, 0, 13, 1)",
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ flex: 1 }}
            />
          ),
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => (
              <Image
                source={require("../../assets/gold.png")}
                style={{
                  width: 300,
                  height: 90,
                  resizeMode: "contain",
                }}
              />
            ),
          }}
        />

        <Stack.Screen
          name="AddDonation"
          component={AddDonationScreen}
          options={{
            title: "नवीन देणगी",
          }}
        />

        <Stack.Screen
          name="EditDonation"
          component={EditDonationScreen}
          options={{
            title: "देणगी संपादन",
          }}
        />

        <Stack.Screen
          name="PendingDonations"
          component={PendingDonationsScreen}
          options={{
            title: "येणे देणगी",
          }}
        />

        <Stack.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            title: "अहवाल",
          }}
        />

        <Stack.Screen
          name="UpiQrScreen"
          component={UpiQrScreen}
          options={{
            title: "UPI QR",
          }}
        />

        <Stack.Screen
          name="UpiSettings"
          component={UpiSettingsScreen}
          options={{
            title: "UPI Settings",
          }}
        />

        <Stack.Screen
          name="AdminClearData"
          component={AdminClearDataScreen}
          options={{
            title: "डेटा साफ करा",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
