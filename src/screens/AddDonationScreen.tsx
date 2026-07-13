import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Modal } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { createDonation, markAsPaid } from "../database/donationRepository";
import { DONOR_TYPES } from "../constants/donorTypes";
import { LANES } from "../constants/lanes";
import { PAYMENT_MODES } from "../constants/paymentModes";
import { useNavigation } from "@react-navigation/native";
import { getDefaultUpi } from "../database/upiRepository";

export default function AddDonationScreen() {
  const today = new Date().toISOString().split("T")[0];
  const navigation = useNavigation<any>();
  const [showQr, setShowQr] = useState(false);
  const [upiUrl, setUpiUrl] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [collectionDate] = useState(today);
  const [donorName, setDonorName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [lane, setLane] = useState(LANES[0]);
  const [donorType, setDonorType] = useState(DONOR_TYPES[0]);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState(PAYMENT_MODES[0]);
  const [collectorName, setCollectorName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [qrAmount, setQrAmount] = useState("");
  const [qrReceiptNo, setQrReceiptNo] = useState("");
  const [savedDonationId, setSavedDonationId] = useState<number | null>(null);
  
  const [upiId, setUpiId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const defaultUpi = await getDefaultUpi();
        if (mounted) setUpiId((defaultUpi as any)?.UpiId ?? null);
      } catch (e) {
        console.log("Failed to load default UPI", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (!receiptNo.trim()) {
      Alert.alert("Validation", "कृपया पावती क्रमांक भरा");
      return;
    }

    if (!donorName.trim()) {
      Alert.alert("Validation", "कृपया देणगीदाराचे नाव भरा");
      return;
    }

    if (!amount.trim()) {
      Alert.alert("Validation", "कृपया रक्कम भरा");
      return;
    }

    let status = "Paid";
    let actualPaymentMode = paymentMode;

    if (paymentMode === "Pending" || paymentMode === "UPI") {
      status = "Unpaid";
      actualPaymentMode = "Pending";
    }

    const donation = {
      ReceiptNo: receiptNo,
      CollectionDate: collectionDate,
      DonorName: donorName,
      Mobile: mobile,
      Address: address,
      Lane: lane,
      DonorType: donorType,
      Amount: Number(amount),
      PaymentMode: actualPaymentMode,
      Status: status,
      CollectorName: collectorName,
      Remarks: remarks,
    };

    console.log(donation);

    try {
      const donationId = await createDonation(donation);

      setSavedDonationId(Number(donationId));

      if (paymentMode === "UPI") {
        if (!upiId) {
          Alert.alert("Error", "UPI ID is not configured");
          return;
        }

        const remark = `ReceiptNo-${receiptNo}`;

        const qrUrl =
          `upi://pay?pa=${upiId}` +
          `&pn=Chaitraban Mitra Mandal` +
          `&am=${amount}` +
          `&tn=${encodeURIComponent(remark)}`;

        console.log("QR URL =>", qrUrl);

        setQrAmount(amount);
        setQrReceiptNo(receiptNo);
        setUpiUrl(qrUrl);
        setShowQr(true);
      } else {
        Alert.alert("Success", "देणगी यशस्वीरित्या जतन झाली", [
          {
            text: "OK",
            onPress: () => {
              clearForm();
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "देणगी जतन करताना समस्या आली");
    }
  };
  const clearForm = () => {
    setReceiptNo("");
    setDonorName("");
    setMobile("");
    setAddress("");
    setAmount("");
    setCollectorName("");
    setRemarks("");
  };

  return (
    
    <ScrollView style={styles.container}>
      <Text style={styles.label}>पावती क्रमांक / Receipt No</Text>

      <TextInput
        style={styles.input}
        value={receiptNo}
        onChangeText={setReceiptNo}
        placeholder="Receipt Number"
      />

      <Text style={styles.label}>दिनांक / Date</Text>

      <TextInput style={styles.input} value={collectionDate} editable={false} />

      <Text style={styles.label}>देणगीदाराचे नाव / Donor Name</Text>

      <TextInput
        style={styles.input}
        value={donorName}
        onChangeText={setDonorName}
        placeholder="Donor Name"
      />

      <Text style={styles.label}>मोबाईल नंबर / Mobile Number</Text>

      <TextInput
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        placeholder="Mobile Number"
      />

      <Text style={styles.label}>पत्ता / Address</Text>

      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
      />

      <Text style={styles.label}>देणगीदार प्रकार / Donor Type</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={donorType}
          onValueChange={(itemValue) => setDonorType(String(itemValue))}
        >
          {DONOR_TYPES.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>गल्ली / Lane</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={lane}
          onValueChange={(itemValue) => setLane(String(itemValue))}
        >
          {LANES.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>रक्कम / Amount</Text>

      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Amount"
      />

      <Text style={styles.label}>पेमेंट प्रकार / Payment Mode</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={paymentMode}
          onValueChange={(itemValue) => setPaymentMode(String(itemValue))}
        >
          {PAYMENT_MODES.map((item) => (
            <Picker.Item key={item} label={item} value={item} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>संकलकाचे नाव / Collector Name</Text>

      <TextInput
        style={styles.input}
        value={collectorName}
        onChangeText={setCollectorName}
        placeholder="Collector Name"
      />

      <Text style={styles.label}>शेरा / Remarks</Text>

      <TextInput
        style={[styles.input, styles.remarks]}
        value={remarks}
        onChangeText={setRemarks}
        multiline
        numberOfLines={4}
        placeholder="Remarks"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>जतन करा / Save</Text>
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
              backgroundColor: "#FFF",
              padding: 20,
              borderRadius: 15,
              alignItems: "center",
              width: "90%",
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
                marginBottom: 15,
                color: "#2E7D32",
              }}
            >
              ₹ {qrAmount}
            </Text>

            {upiUrl ? (
              <QRCode value={upiUrl} size={220} />
            ) : (
              <Text>QR तयार होत आहे...</Text>
            )}

            <Text
              style={{
                marginTop: 15,
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              पावती क्रमांक:- {qrReceiptNo}
            </Text>

            <Text
              style={{
                marginTop: 5,
                color: "#666",
                textAlign: "center",
              }}
            >
              UPI द्वारे देणगी स्वीकारा
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 25,
              }}
            >
              {/* Cancel Button */}
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

                  Alert.alert(
                    "Pending - येणे Payment",
                    "देणगी येणे म्हणून जतन केली गेली.",
                  );
                  clearForm();
                  navigation.goBack();
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

              {/* Payment Received Button */}
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
                    if (savedDonationId) {
                      await markAsPaid(savedDonationId, "UPI");
                    }

                    setShowQr(false);

                    Alert.alert("Success", "UPI पेमेंट प्राप्त झाले.");

                    clearForm();
                    navigation.goBack();
                  } catch (error) {
                    console.log(error);

                    Alert.alert("Error", "पेमेंट अपडेट करण्यात समस्या आली.");
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F1",
    padding: 16,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginTop: 14,
    marginBottom: 6,
    marginLeft: 2,
  },

  input: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 14,

    paddingHorizontal: 14,
    paddingVertical: 14,

    fontSize: 15,
    color: "#111827",

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 14,

    overflow: "hidden",

    elevation: 2,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  remarks: {
    height: 110,
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: "#7C3AED",

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: "center",

    marginTop: 30,
    marginBottom: 40,

    elevation: 6,

    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  formCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 16,

  elevation: 4,

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.08,
  shadowRadius: 8,
},
});
