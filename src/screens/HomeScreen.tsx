import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <LinearGradient
        colors={[
          'rgb(207, 187, 220)',
          'rgb(214, 107, 107)',
          'rgba(184, 82, 88, 0.73)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("AddDonation")
        }
      >
        <Text style={styles.cardText}>
          ➕ नवीन देणगी
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("PendingDonations")
        }
      >
        <Text style={styles.cardText}>
          ⏳ प्रलंबित देणग्या
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("Reports")
        }
      >
        <Text style={styles.cardText}>
          📊 अहवाल
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("UpiQrScreen")
        }
      >
        <Text style={styles.cardText}>
          📱 UPI QR
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.card}
  onPress={() =>
    navigation.navigate("AdminClearData")
  }
>
  <Text style={styles.cardText}>
    🗑️ डेटा साफ करा
  </Text>
</TouchableOpacity>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fcffe1",
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },

  cardText: {
    fontSize: 18,
    fontWeight: "600",
  },
});