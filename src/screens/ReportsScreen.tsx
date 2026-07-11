import React, { useState } from "react";
import { View,Text,StyleSheet,FlatList,TouchableOpacity,Platform, TextInput,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getFilteredDonations } from "../database/donationRepository";
import { LANES } from "../constants/lanes";
import { exportDonationsToExcel }from "../utils/exportToExcel";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ReportsScreen() {
  const today =
    new Date().toISOString().split("T")[0];

    
const [collectionDate, setCollectionDate] = useState<Date | null>(
  new Date()
);

const [showDatePicker, setShowDatePicker] =
  useState(false);

  const [status, setStatus] =
    useState("All");

  const [lane, setLane] =
    useState("All");

  const [data, setData] =
    useState<any[]>([]);
  
  const onDateChange = (
      event: any,
      selectedDate?: Date
    ) => {
      setShowDatePicker(false);

      if (selectedDate) {
        setCollectionDate(selectedDate);
      }
    };

  const loadReport = async () => {
    const result =
      await getFilteredDonations(
        // repository expects a date string (YYYY-MM-DD)
        collectionDate
          ? collectionDate.toISOString().split("T")[0]
          : "",
        status,
        lane
      );

    setData(result as any[]);
  };

  const totalAmount = data.reduce(
    (sum, item) =>
      sum + Number(item.Amount),
    0
  );

  return (
    <View style={styles.container}>

      <Text style={styles.label}>
  दिनांक / Date
</Text>

<TouchableOpacity
  style={styles.input}
  onPress={() => setShowDatePicker(true)}
>
  <Text>
    {collectionDate
      ? collectionDate.toISOString().split("T")[0]
      : "सर्व दिनांक / All Dates"}
  </Text>
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={collectionDate ?? new Date()}
    mode="date"
    display={
      Platform.OS === "android"
        ? "default"
        : "spinner"
    }
    onValueChange={onDateChange}
  />
)}

      <Text style={styles.label}>
        स्थिती / Status
      </Text>

      <View style={styles.picker}>
        <Picker
          selectedValue={status}
          onValueChange={(v) =>
            setStatus(String(v))
          }
        >
          <Picker.Item
            label="सर्व / All"
            value="All"
          />

          <Picker.Item
            label="Paid"
            value="Paid"
          />

          <Picker.Item
            label="Unpaid"
            value="Unpaid"
          />
        </Picker>
      </View>

      <Text style={styles.label}>
        गल्ली / Lane
      </Text>

      <View style={styles.picker}>
        <Picker
          selectedValue={lane}
          onValueChange={(v) =>
            setLane(String(v))
          }
        >
          <Picker.Item
            label="सर्व / All"
            value="All"
          />

          {LANES.map((item) => (
            <Picker.Item
              key={item}
              label={item}
              value={item}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={loadReport}
      >
        <Text style={styles.buttonText}>
          अहवाल पहा
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
          style={styles.exportButton}
          onPress={() =>
            exportDonationsToExcel(data)          }
        >
          <Text style={styles.exportButtonText}>
            Excel Export
          </Text>
      </TouchableOpacity>

      <View style={styles.summary}>
        <Text>
          एकूण नोंदी :
          {" "}
          {data.length}
        </Text>

        <Text>
          एकूण रक्कम :
          ₹ {totalAmount}
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item, index) =>
          String(item.Id ?? index)
        }
        renderItem={({ item }) => (
          <View style={styles.card}>

            <Text>
              पावती :
              {" "}
              {item.ReceiptNo}
            </Text>

            <Text>
              नाव :
              {" "}
              {item.DonorName}
            </Text>

            <Text>
              गल्ली :
              {" "}
              {item.Lane}
            </Text>

            <Text>
              स्थिती :
              {" "}
              {item.Status}
            </Text>

            <Text>
              रक्कम :
              ₹ {item.Amount}
            </Text>

          </View>
          
        )}
      />
      <View style={{ flexDirection: "row", gap: 10 }}>
  <TouchableOpacity
    style={styles.input}
    onPress={() => setShowDatePicker(true)}
  >
    <Text>
      {collectionDate
        ? collectionDate.toISOString().split("T")[0]
        : "सर्व दिनांक / All Dates"}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.clearButton}
    onPress={() => setCollectionDate(null)}
  >
    <Text style={{ color: "#fff" }}>
      Clear
    </Text>
  </TouchableOpacity>
</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#FFF8E1",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  label: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },

  exportButton: {
  backgroundColor: "#2E7D32",
  padding: 15,
  borderRadius: 8,
  alignItems: "center",
  marginBottom: 15,
  marginTop: 15,
},

exportButtonText: {
  color: "#FFFFFF",
  fontWeight: "bold",
  fontSize: 16,

},

  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 10,
  },

  picker: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
  },

  button: {
    backgroundColor: "#FF6F00",
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  summary: {
    backgroundColor: "#FFF",
    padding: 15,
    marginTop: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  clearButton: {
  backgroundColor: "#C62828",
  paddingHorizontal: 15,
  justifyContent: "center",
  borderRadius: 8,
},

  card: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
});