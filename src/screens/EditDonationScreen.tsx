
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
    backgroundColor: "#F8F6F1",
    padding: 16,
  },

  heading: {
    fontSize: 26,
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

    marginTop: 30,
    marginBottom: 40,

    alignItems: "center",

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
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F6F1",
  },
});
