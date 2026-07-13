import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";

import QRCode from "react-native-qrcode-svg";

export default function UpiQrScreen() {
  const route = useRoute<any>();

  const [amount, setAmount] = useState(route.params?.amount?.toString() ?? "");

  const [receiptNo, setReceiptNo] = useState(route.params?.receiptNo ?? "");

  const [upiId, setUpiId] = useState("");
  // const [receiptNo, setReceiptNo] = useState("");
  // const [amount, setAmount] = useState("");
  const [name, setName] = useState("Chaitraban Mitra Mandal");

  const [upiLink, setUpiLink] = useState("");

  const generateQR = () => {
    const UPIID = "chaitraban@okaxis";
    const remark = `ReceiptNo-${receiptNo}`;
    const link =
      `upi://pay?pa=${upiId}` +
      `&pn=${encodeURIComponent("Chaitraban Mitra Mandal")}` +
      `&am=${amount}` +
      `&tn=${encodeURIComponent(remark)}` +
      `&cu=INR`;

    setUpiLink(link);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>|| चैत्रबन मित्र मंडळ ||</Text>
      <Text style={styles.label}>पावती क्रमांक / Receipt No</Text>

      <TextInput
        style={styles.input}
        value={receiptNo}
        onChangeText={setReceiptNo}
        placeholder="1001"
      />

      <Text style={styles.label}>UPI ID</Text>

      <TextInput
        style={styles.input}
        value={upiId}
        onChangeText={setUpiId}
        placeholder="example@upi"
      />

      <Text style={styles.label}>Amount (₹)</Text>

      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="100"
      />

      <TouchableOpacity style={styles.button} onPress={generateQR}>
        <Text style={styles.buttonText}>QR Generate करा</Text>
      </TouchableOpacity>

      {upiLink ? (
        <View style={styles.qrContainer}>
          <QRCode value={upiLink} size={250} />

          <Text style={styles.upiText}>{upiId}</Text>

          <Text style={styles.receiptText}>Receipt No : {receiptNo}</Text>

          <Text style={styles.amountText}>₹ {amount}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F6F1",
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 25,
    letterSpacing: 0.5,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginTop: 14,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 14,

    paddingHorizontal: 16,
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

  button: {
    backgroundColor: "#7C3AED",

    paddingVertical: 16,

    borderRadius: 16,

    marginTop: 25,

    elevation: 6,

    shadowColor: "#7C3AED",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  qrContainer: {
    marginTop: 35,

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    padding: 25,

    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  receiptText: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  upiText: {
    marginTop: 18,
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },

  amountText: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: "700",
    color: "#16A34A",
  },
});
