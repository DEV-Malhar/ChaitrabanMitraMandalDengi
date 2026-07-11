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
    padding: 20,
    backgroundColor: "#FFF8E1",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
  },

  deleteButton: {
    backgroundColor: "#C62828",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});