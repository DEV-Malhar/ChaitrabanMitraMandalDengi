import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>

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
          navigation.navigate("UPIQR")
        }
      >
        <Text style={styles.cardText}>
          📱 UPI QR
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#FFF8E1",
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