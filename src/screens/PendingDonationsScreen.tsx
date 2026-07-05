import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import {
  getPendingDonations,
  markAsPaid,
} from "../database/donationRepository";

export default function PendingDonationsScreen() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getPendingDonations();

      if (Array.isArray(data)) {
        setDonations(data);
      } else {
        setDonations([]);
      }
    } catch (error) {
      console.log("Load Error:", error);

      Alert.alert("Error", "Pending donations load करण्यात समस्या आली.");
    } finally {
      setLoading(false);
    }

    const data = await getPendingDonations();

console.log("PENDING DATA =>", data);

if (Array.isArray(data)) {
  setDonations(data);
}
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleMarkPaid = (id: number) => {
    Alert.alert("Payment Mode", "Payment Mode निवडा", [
      {
        text: "Cash",
        onPress: async () => {
          try {
            await markAsPaid(id, "Cash");
            Alert.alert("Success", "Payment Paid म्हणून अपडेट झाले.");
            loadData();
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "Update करण्यात समस्या आली.");
          }
        },
      },
      {
        text: "UPI",
        onPress: async () => {
          try {
            await markAsPaid(id, "UPI");
            Alert.alert("Success", "Payment Paid म्हणून अपडेट झाले.");
            loadData();
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "Update करण्यात समस्या आली.");
          }
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (donations.length === 0) {
    return (
      <View style={styles.center}>
        <Text>कोणतीही प्रलंबित देणगी उपलब्ध नाही.</Text>
      </View>
    );  
  }

  return (
    <FlatList
      data={donations}
      keyExtractor={(item, index) => String(item.Id ?? index)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.DonorName}</Text>
          <Text>पावती: {item.ReceiptNo}</Text>
          <Text>मोबाईल: {item.Mobile}</Text>
          <Text>पत्ता: {item.Address}</Text>
          <Text>रक्कम: ₹{item.Amount}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleMarkPaid(item.Id)}
          >
            <Text style={styles.buttonText}>येणे प्राप्त झाले </Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  button: {
    backgroundColor: "#2E7D32",
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});
