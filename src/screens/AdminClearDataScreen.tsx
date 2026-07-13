import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { deleteAllDonations } from "../database/donationRepository";

const ADMIN_USERNAME = "chaitraban_admin";
const ADMIN_PASSWORD = "Ch@!tr@b@n@1993";

export default function AdminClearDataScreen() {
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleDelete = async () => {
    if (!username.trim()) {
      Alert.alert(
        "Validation",
        "कृपया Username भरा"
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        "Validation",
        "कृपया Password भरा"
      );
      return;
    }

    if (username !== ADMIN_USERNAME) {
      Alert.alert(
        "Error",
        "चुकीचा Username"
      );
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      Alert.alert(
        "Error",
        "चुकीचा Password"
      );
      return;
    }

    Alert.alert(
      "डेटा हटवा",
      "संपूर्ण देणगी डेटा कायमचा हटवायचा आहे का?",
      [
        {
          text: "नाही",
          style: "cancel",
        },
        {
          text: "होय",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAllDonations();

              Alert.alert(
                "यशस्वी",
                "संपूर्ण डेटा हटविण्यात आला.",
                [
                  {
                    text: "OK",
                    onPress: () =>
                      navigation.navigate("Home"),
                  },
                ]
              );
            } catch (error) {
              console.log(error);

              Alert.alert(
                "Error",
                "डेटा हटविताना समस्या आली."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Username
      </Text>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
      />

      <Text style={styles.label}>
        Password
      </Text>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Text style={styles.deleteButtonText}>
          सर्व डेटा हटवा
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6F1",
    padding: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.5,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
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

  deleteButton: {
    backgroundColor: "#DC2626",

    paddingVertical: 16,

    borderRadius: 14,

    alignItems: "center",

    marginTop: 35,

    elevation: 6,

    shadowColor: "#DC2626",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});