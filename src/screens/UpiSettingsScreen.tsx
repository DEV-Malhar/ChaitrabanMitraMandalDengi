import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

import {
  addUpiAccount,
  deleteUpiAccount,
  getUpiAccounts,
  setDefaultUpi,
} from "../database/upiRepository";

export default function UpiSettingsScreen() {

  const [accountName, setAccountName] =
    useState("");

  const [upiId, setUpiId] =
    useState("");

  const [data, setData] =
    useState<any[]>([]);

  const loadData = async () => {

    const result =
      await getUpiAccounts();

    setData(result as any[]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {

    if (!accountName.trim()) {
      Alert.alert(
        "Validation",
        "Account Name आवश्यक आहे"
      );
      return;
    }

    if (!upiId.trim()) {
      Alert.alert(
        "Validation",
        "UPI Id आवश्यक आहे"
      );
      return;
    }

    await addUpiAccount(
      accountName,
      upiId
    );

    setAccountName("");
    setUpiId("");

    loadData();
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        UPI Settings
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Account Name"
        value={accountName}
        onChangeText={setAccountName}
      />

      <TextInput
        style={styles.input}
        placeholder="UPI ID"
        value={upiId}
        onChangeText={setUpiId}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
      >
        <Text style={styles.btnText}>
          Save UPI
        </Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={(item) =>
          String(item.Id)
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text>
              {item.AccountName}
            </Text>

            <Text>
              {item.UpiId}
            </Text>

            <Text>
              {item.IsDefault === 1
                ? "✅ Default"
                : ""}
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={styles.defaultBtn}
                onPress={async () => {
                  await setDefaultUpi(
                    item.Id
                  );
                  loadData();
                }}
              >
                <Text>
                  Default
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={async () => {
                  await deleteUpiAccount(
                    item.Id
                  );
                  loadData();
                }}
              >
                <Text
                  style={{
                    color: "#FFF",
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:15
  },
  title:{
    fontSize:24,
    fontWeight:"bold"
  },
  input:{
    borderWidth:1,
    marginTop:10,
    padding:10,
    borderRadius:8
  },
  saveButton:{
    backgroundColor:"#2E7D32",
    padding:12,
    marginTop:10,
    borderRadius:8
  },
  btnText:{
    color:"#FFF",
    textAlign:"center"
  },
  card:{
    backgroundColor:"#FFF",
    padding:15,
    marginTop:10,
    borderRadius:10
  },
  defaultBtn:{
    backgroundColor:"#FFC107",
    padding:10,
    borderRadius:8,
    marginRight:10
  },
  deleteBtn:{
    backgroundColor:"#C62828",
    padding:10,
    borderRadius:8
  }
});