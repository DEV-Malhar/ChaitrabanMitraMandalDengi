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

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  getPendingDonations,
  markAsPaid,
  deleteDonation,
} from "../database/donationRepository";

export default function PendingDonationsScreen() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

const loadData = async () => {
  try {
    setLoading(true);

    const data = await getPendingDonations();

    console.log("PENDING DATA =>", data);

    if (Array.isArray(data)) {
      setDonations(data);
    } else {
      setDonations([]);
    }
  } catch (error) {
    console.log("Load Error:", error);

    Alert.alert(
      "Error",
      "Pending donations load करण्यात समस्या आली."
    );
  } finally {
    setLoading(false);
  }
};

const handleDelete = (id: number) => {
  Alert.alert(
    "Delete",
    "ही देणगी नोंद हटवायची आहे का?",
    [
      {
        text: "नाही",
        style: "cancel",
      },
      {
        text: "होय",
        onPress: async () => {
          try {
            await deleteDonation(id);

            Alert.alert(
              "Success",
              "देणगी नोंद हटवली गेली."
            );

            loadData();
          } catch (error) {
            console.log(error);

            Alert.alert(
              "Error",
              "Delete करण्यात समस्या आली."
            );
          }
        },
      },
    ]
  );
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
    <Text style={styles.title}>
      {item.DonorName}
    </Text>

    <Text>
      पावती क्रमांक : {item.ReceiptNo}
    </Text>

    <Text>
      मोबाईल : {item.Mobile}
    </Text>

    <Text>
      पत्ता : {item.Address}
    </Text>

    <Text>
      रक्कम : ₹{item.Amount}
    </Text>

    <Text>
      संकलन दिनांक : {item.CollectionDate}
    </Text>

    <Text>
      सुधारित दिनांक :
      {item.ModifiedDate ?? "-"}
    </Text>

    <View style={styles.actionRow}>
      <TouchableOpacity
        style={styles.paidButton}
        onPress={() => handleMarkPaid(item.Id)}
      >
        <Text style={styles.buttonText}>
          येणे प्राप्त झाले
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
    style={styles.editButton}
    onPress={() =>
      navigation.navigate(
        "EditDonation",
        {
          donationId: item.Id,
        }
      )
    }
  >
    <Text style={styles.buttonText}>
      संपादन
    </Text>
  </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.Id)}
      >
        <Text style={styles.buttonText}>
          हटवा
        </Text>
      </TouchableOpacity>
    </View>
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

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  button: {
    backgroundColor: "#2E7D32",
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
  },

  paidButton: {
    flex: 1,
    backgroundColor: "#2E7D32",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#C62828",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },

  editButton: {
  flex: 1,
  backgroundColor: "#F57C00",
  padding: 10,
  borderRadius: 8,
  marginHorizontal: 4,
},
});
