import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }: any) {
  return (
    <LinearGradient
      colors={[
        "rgb(184, 146, 210)",
        "rgb(203, 212, 230)",
        "rgba(227, 142, 148, 0.73)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity
        style={[styles.card, styles.addDonationCard]}
        onPress={() => navigation.navigate("AddDonation")}
      >
        <Text style={styles.cardText}>➕ नवीन देणगी</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.pendingCard]}
        onPress={() => navigation.navigate("PendingDonations")}
      >
        <Text style={styles.cardText}>⏳ प्रलंबित देणग्या</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.reportCard]}
        onPress={() => navigation.navigate("Reports")}
      >
        <Text style={styles.cardText}>📊 अहवाल</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.upiCardSettings]}
        onPress={() => navigation.navigate("UpiSettings")}
      >
        <Text style={styles.cardText}>⚙️ UPI Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.upiCard]}
        onPress={() => navigation.navigate("UpiQrScreen")}
      >
        <Text style={styles.cardText}>📱 UPI QR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, styles.adminCard]}
        onPress={() => navigation.navigate("AdminClearData")}
      >
        <Text style={styles.cardText}>🗑️ डेटा साफ करा</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2026 Chaitraban Mitra Mandal Dengi App
        </Text>

        <Text style={styles.footerSubText}>
          Version 1.0.0 | Developed by Malhar Kshirsagar
        </Text>
      </View>
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
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,

    elevation: 8,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  cardText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "justify",
  },

  addDonationCard: {
    backgroundColor: "#2E7D32", // Green
  },

  pendingCard: {
    backgroundColor: "#EF6C00", // Orange
  },

  reportCard: {
    backgroundColor: "#1565C0", // Blue
  },

  upiCard: {
    backgroundColor: "#6A1B9A", // Purple
  },

  upiCardSettings: {
    backgroundColor: "#9f4a08", // Purple
  },

  adminCard: {
    backgroundColor: "#C62828", // Red
  },

  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 15,
  },

  footerText: {
    color: "#FFF8E1",
    fontSize: 13,
    fontWeight: "700",
  },

  footerSubText: {
    color: "#FCE4EC",
    fontSize: 11,
  },
});
