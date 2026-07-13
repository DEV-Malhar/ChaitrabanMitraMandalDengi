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
import { Modal } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { UPI_ID } from "../constants/upiIds"; // Import the UPI ID from constants
import {
  getPendingDonations,
  markAsPaid,
  deleteDonation,
} from "../database/donationRepository";
import { getDefaultUpi } from "../database/upiRepository";

export default function PendingDonationsScreen() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const [showQr, setShowQr] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [upiUrl, setUpiUrl] = useState("");
  const [upiId, setUpiId] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);

      const defaultUpi: any = await getDefaultUpi();
      if (defaultUpi && defaultUpi.UpiId) {
        setUpiId(defaultUpi.UpiId);
      }

      const data = await getPendingDonations();

      console.log("PENDING DATA =>", data);

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
  };

  const handleDelete = (id: number) => {
    Alert.alert("Delete", "ही देणगी नोंद हटवायची आहे का?", [
      {
        text: "नाही",
        style: "cancel",
      },
      {
        text: "होय",
        onPress: async () => {
          try {
            await deleteDonation(id);

            Alert.alert("Success", "देणगी नोंद हटवली गेली.");

            loadData();
          } catch (error) {
            console.log(error);

            Alert.alert("Error", "Delete करण्यात समस्या आली.");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleMarkPaid = (item: any) => {
    Alert.alert("Payment Mode", "Payment Mode निवडा", [
      {
        text: "Cash",
        onPress: async () => {
          try {
            await markAsPaid(item.Id, "Cash");
            Alert.alert("Success", "Payment Paid म्हणून अपडेट झाले.");
            loadData();
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "Update करण्यात समस्या झाली.");
          }
        },
      },
      {
        text: "UPI",
        onPress: () => {
          const remark = `ReceiptNo-${item.ReceiptNo}`;

          const qrUrl =
            `upi://pay?pa=${upiId}` +
            `&pn=${encodeURIComponent("Chaitraban Mitra Mandal")}` +
            `&am=${item.Amount}` +
            `&tn=${encodeURIComponent(remark)}`;

          setSelectedDonation(item);

          setUpiUrl(qrUrl);

          setShowQr(true);
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
          <Text style={styles.title}>नाव : {item.DonorName}</Text>
          <View style={styles.twoColumnRow}>
            <Text style={styles.columnText}>पावती: {item.ReceiptNo}</Text>

            <Text style={styles.columnText}>गल्ली: {item.Lane}</Text>
          </View>

          <View style={styles.twoColumnRow}>
            <Text style={styles.columnText}>रक्कम ₹ {item.Amount}</Text>

            <Text style={styles.columnText}>
              संकलन दिनांक : {item.CollectionDate}
            </Text>
          </View>

          <Text style={styles.addressText}>पत्ता : {item.Address}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.paidButton}
              onPress={() => handleMarkPaid(item)}
            >
              <Text style={styles.buttonText}>येणे प्राप्त झाले</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("EditDonation", {
                  donationId: item.Id,
                })
              }
            >
              <Text style={styles.buttonText}>संपादन</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.Id)}
            >
              <Text style={styles.buttonText}>हटवा</Text>
            </TouchableOpacity>

            <Modal visible={showQr} transparent animationType="slide">
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <View
                  style={{
                    width: "90%",
                    backgroundColor: "#FFF",
                    padding: 20,
                    borderRadius: 15,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Chaitraban Mitra Mandal
                  </Text>

                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#2E7D32",
                      marginBottom: 15,
                    }}
                  >
                    ₹ {selectedDonation?.Amount}
                  </Text>

                  <QRCode value={upiUrl} size={220} />

                  <Text
                    style={{
                      marginTop: 15,
                    }}
                  >
                    Receipt No:
                    {selectedDonation?.ReceiptNo}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: "#C62828",
                        padding: 12,
                        borderRadius: 8,
                        marginRight: 5,
                      }}
                      onPress={() => {
                        setShowQr(false);
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFF",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: "#2E7D32",
                        padding: 12,
                        borderRadius: 8,
                        marginLeft: 5,
                      }}
                      onPress={async () => {
                        try {
                          await markAsPaid(selectedDonation.Id, "UPI");

                          setShowQr(false);

                          Alert.alert("Success", "UPI पेमेंट प्राप्त झाले.");

                          loadData();
                        } catch (error) {
                          console.log(error);
                        }
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFF",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        Payment Received
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
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

  twoColumnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  columnText: {
    flex: 1,
    fontSize: 14,
  },

  addressText: {
    marginTop: 4,
    color: "#4B5563",
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
