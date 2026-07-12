import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

import QRCode from "react-native-qrcode-svg";

export default function UpiQrScreen() {

  const route = useRoute<any>();

const [amount, setAmount] = useState(
  route.params?.amount?.toString() ?? ""
);

const [receiptNo, setReceiptNo] = useState(
  route.params?.receiptNo ?? ""
);

  const [upiId, setUpiId] = useState("");
  // const [receiptNo, setReceiptNo] = useState("");
  // const [amount, setAmount] = useState("");
  const [name, setName] = useState("Chaitraban Mitra Mandal");

  const [upiLink, setUpiLink] = useState("");

  const generateQR = () => {
    const UPIID= "chaitraban@okaxis";
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

      <Text style={styles.header}>
       || चैत्रबन मित्र मंडळ ||
      </Text>
    <Text style={styles.label}>
        पावती क्रमांक / Receipt No
      </Text>

      <TextInput
        style={styles.input}
        value={receiptNo}
        onChangeText={setReceiptNo}
        placeholder="1001"
      />

      <Text style={styles.label}>
        UPI ID
      </Text>

      <TextInput
        style={styles.input}
        value={upiId}
        onChangeText={setUpiId}
        placeholder="example@upi"
      />      

      <Text style={styles.label}>
        Amount (₹)
      </Text>

      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="100"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={generateQR}
      >
        <Text style={styles.buttonText}>
          QR Generate करा
        </Text>
      </TouchableOpacity>

      {upiLink ? (
        <View style={styles.qrContainer}>
          <QRCode
            value={upiLink}
            size={250}
          />

          <Text style={styles.upiText}>
            {upiId}
          </Text>
          
          <Text style={styles.receiptText}>
            Receipt No : {receiptNo}
          </Text>
          
          <Text style={styles.amountText}>
            ₹ {amount}
          </Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#FFF8E1",
  },

receiptText: {
  marginTop: 10,
  fontSize: 16,
  fontWeight: "bold",
},

  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
  },

  button: {
    backgroundColor: "#FF6F00",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },

  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  qrContainer: {
    alignItems: "center",
    marginTop: 30,
  },

  upiText: {
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 16,
  },

  amountText: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
});

