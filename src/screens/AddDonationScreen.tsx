import React, { useState } from "react";
import {
ScrollView,
StyleSheet,
Text,
TextInput,
TouchableOpacity,
View,
Alert,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { createDonation } from "../database/donationRepository";
import { DONOR_TYPES } from "../constants/donorTypes";
import { LANES } from "../constants/lanes";
import { PAYMENT_MODES } from "../constants/paymentModes";
import { useNavigation } from "@react-navigation/native";

export default function AddDonationScreen() {
const today = new Date().toISOString().split("T")[0];

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
const navigation = useNavigation();

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

  if (paymentMode === "Pending") {
    status = "Unpaid";
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
    PaymentMode: paymentMode,
    Status: status,
    CollectorName: collectorName,
    Remarks: remarks,
  };

  console.log(donation);

try {
  await createDonation(donation);

  Alert.alert(
    "Success",
    "देणगी यशस्वीरित्या जतन झाली",
    [
      {
        text: "OK",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]
  );
} catch (error) {
  console.log(error);

  Alert.alert(
    "Error",
    "देणगी जतन करताना समस्या आली"
  );
}
};

return (
  <ScrollView style={styles.container}>
    <Text style={styles.label}>
      पावती क्रमांक / Receipt No
    </Text>

    <TextInput
      style={styles.input}
      value={receiptNo}
      onChangeText={setReceiptNo}
      placeholder="Receipt Number"
    />

    <Text style={styles.label}>
      दिनांक / Date
    </Text>

    <TextInput
      style={styles.input}
      value={collectionDate}
      editable={false}
    />

    <Text style={styles.label}>
      देणगीदाराचे नाव / Donor Name
    </Text>

    <TextInput
      style={styles.input}
      value={donorName}
      onChangeText={setDonorName}
      placeholder="Donor Name"
    />

    <Text style={styles.label}>
      मोबाईल नंबर / Mobile Number
    </Text>

    <TextInput
      style={styles.input}
      value={mobile}
      onChangeText={setMobile}
      keyboardType="phone-pad"
      placeholder="Mobile Number"
    />

    <Text style={styles.label}>
      पत्ता / Address
    </Text>

    <TextInput
      style={styles.input}
      value={address}
      onChangeText={setAddress}
      placeholder="Address"
    />

    <Text style={styles.label}>
      देणगीदार प्रकार / Donor Type
    </Text>

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

    <Text style={styles.label}>
      गल्ली / Lane
    </Text>

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

    <Text style={styles.label}>
      रक्कम / Amount
    </Text>

    <TextInput
      style={styles.input}
      value={amount}
      onChangeText={setAmount}
      keyboardType="numeric"
      placeholder="Amount"
    />

    <Text style={styles.label}>
      पेमेंट प्रकार / Payment Mode
    </Text>

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

    <Text style={styles.label}>
      संकलकाचे नाव / Collector Name
    </Text>

    <TextInput
      style={styles.input}
      value={collectorName}
      onChangeText={setCollectorName}
      placeholder="Collector Name"
    />

    <Text style={styles.label}>
      शेरा / Remarks
    </Text>

    <TextInput
      style={[styles.input, styles.remarks]}
      value={remarks}
      onChangeText={setRemarks}
      multiline
      numberOfLines={4}
      placeholder="Remarks"
    />

    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
      <Text style={styles.saveButtonText}>
        जतन करा / Save
      </Text>
    </TouchableOpacity>
  </ScrollView>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: "#FFF8E1",
padding: 15,
},

label: {
fontSize: 16,
fontWeight: "600",
marginTop: 10,
marginBottom: 5,
},

input: {
backgroundColor: "#FFFFFF",
borderWidth: 1,
borderColor: "#DDDDDD",
borderRadius: 8,
padding: 12,
},

pickerContainer: {
backgroundColor: "#FFFFFF",
borderWidth: 1,
borderColor: "#DDDDDD",
borderRadius: 8,
overflow: "hidden",
},

remarks: {
height: 90,
textAlignVertical: "top",
},

saveButton: {
backgroundColor: "#FF6F00",
padding: 15,
borderRadius: 8,
alignItems: "center",
marginTop: 20,
marginBottom: 30,
},

saveButtonText: {
color: "#FFFFFF",
fontWeight: "bold",
fontSize: 18,
},
});
