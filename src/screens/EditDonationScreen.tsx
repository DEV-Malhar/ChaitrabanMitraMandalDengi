
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import {
  getDonationById,
  updateDonation,
} from "../database/donationRepository";

import { DONOR_TYPES } from "../constants/donorTypes";
import { LANES } from "../constants/lanes";

export default function EditDonationScreen({
  route,
  navigation,
}: any) {
  const { donationId } = route.params;

  const [donation, setDonation] = useState<any>(null);

  const [donorName, setDonorName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [lane, setLane] = useState("");
  const [donorType, setDonorType] = useState("");
  const [amount, setAmount] = useState("");
  const [collectorName, setCollectorName] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    loadDonation();
  }, []);

  const loadDonation = async () => {
    try {
      const data: any = await getDonationById(donationId);

      if (data) {
        setDonation(data);

        setDonorName(data.DonorName ?? "");
        setMobile(data.Mobile ?? "");
        setAddress(data.Address ?? "");
        setLane(data.Lane ?? "");
        setDonorType(data.DonorType ?? "");
        setAmount(String(data.Amount ?? ""));
        setCollectorName(data.CollectorName ?? "");
        setRemarks(data.Remarks ?? "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    if (!donorName.trim()) {
      Alert.alert("Validation", "देणगीदाराचे नाव भरा");
      return;
    }

    if (!amount.trim()) {
      Alert.alert("Validation", "रक्कम भरा");
      return;
    }

    try {
      await updateDonation({
        ...donation,

        DonorName: donorName,
        Mobile: mobile,
        Address: address,
        Lane: lane,
        DonorType: donorType,
        Amount: Number(amount),
        CollectorName: collectorName,
        Remarks: remarks,
      });

      Alert.alert(
        "Success",
        "देणगी माहिती अपडेट झाली",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Error",
        "डेटा अपडेट करताना समस्या आली"
      );
    }
  };

  if (!donation) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        देणगी संपादन
      </Text>

      <Text style={styles.label}>
        पावती क्रमांक
      </Text>

      <TextInput
        style={styles.input}
        value={donation.ReceiptNo}
        editable={false}
      />

      <Text style={styles.label}>
        संकलन दिनांक
      </Text>

      <TextInput
        style={styles.input}
        value={donation.CollectionDate}
        editable={false}
      />

      <Text style={styles.label}>
        देणगीदाराचे नाव
      </Text>

      <TextInput
        style={styles.input}
        value={donorName}
        onChangeText={setDonorName}
      />

      <Text style={styles.label}>
        मोबाईल
      </Text>

      <TextInput
        style={styles.input}
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>
        पत्ता
      </Text>

      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>
        देणगीदार प्रकार
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={donorType}
          onValueChange={(value) =>
            setDonorType(String(value))
          }
        >
          {DONOR_TYPES.map((item) => (
            <Picker.Item
              key={item}
              label={item}
              value={item}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>
        गल्ली
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={lane}
          onValueChange={(value) =>
            setLane(String(value))
          }
        >
          {LANES.map((item) => (
            <Picker.Item
              key={item}
              label={item}
              value={item}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>
        रक्कम
      </Text>

      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>
        संकलकाचे नाव
      </Text>

      <TextInput
        style={styles.input}
        value={collectorName}
        onChangeText={setCollectorName}
      />

      <Text style={styles.label}>
        शेरा
      </Text>

      <TextInput
        style={[styles.input, styles.remarks]}
        value={remarks}
        onChangeText={setRemarks}
        multiline
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          अपडेट करा
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

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
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
    marginTop: 20,
    marginBottom: 30,
  },

  saveButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
