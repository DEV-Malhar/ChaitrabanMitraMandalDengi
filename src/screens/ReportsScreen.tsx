import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getFilteredDonations } from "../database/donationRepository";
import { LANES } from "../constants/lanes";
import { exportDonationsToExcel } from "../utils/exportToExcel";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function ReportsScreen() {
  const today = new Date().toISOString().split("T")[0];

  const [collectionDate, setCollectionDate] = useState<Date | null>(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [status, setStatus] = useState("All");

  const [lane, setLane] = useState("All");

  const [data, setData] = useState<any[]>([]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setCollectionDate(selectedDate);
    }
  };

  const loadReport = async () => {
    const result = await getFilteredDonations(
      // repository expects a date string (YYYY-MM-DD)
      collectionDate ? collectionDate.toISOString().split("T")[0] : "",
      status,
      lane,
    );

    setData(result as any[]);
  };

  const totalAmount = data.reduce((sum, item) => sum + Number(item.Amount), 0);

  return (
  <View style={styles.container}>

    <Text style={styles.label}>
      दिनांक / Date
    </Text>

    <View style={styles.dateRow}>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() =>
          setShowDatePicker(true)
        }
      >
        <Text>
          {collectionDate
            ? collectionDate
                .toISOString()
                .split("T")[0]
            : "सर्व दिनांक / All Dates"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() =>
          setCollectionDate(null)
        }
      >
        <Text
          style={
            styles.clearButtonText
          }
        >
          All
        </Text>
      </TouchableOpacity>
    </View>

    {showDatePicker && (
      <DateTimePicker
        value={
          collectionDate ??
          new Date()
        }
        mode="date"
        display={
          Platform.OS ===
          "android"
            ? "default"
            : "spinner"
        }
        onValueChange={
          onDateChange
        }
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
      <Text
        style={styles.buttonText}
      >
        अहवाल पहा
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.exportButton}
      onPress={() =>
        exportDonationsToExcel(data)
      }
    >
      <Text
        style={
          styles.exportButtonText
        }
      >
        Excel Export
      </Text>
    </TouchableOpacity>

    <View style={styles.summary}>
      <Text>
        एकूण नोंदी : {data.length}
      </Text>

      <Text>
        एकूण रक्कम :
        ₹ {totalAmount}
      </Text>
    </View>

    <FlatList
      data={data}
      keyExtractor={(
        item,
        index
      ) =>
        String(
          item.Id ?? index
        )
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

  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F6F1",
  },

  dateRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 5,
},

dateInput: {
  flex: 1,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 14,
  marginRight: 8,
},

clearButton: {
  backgroundColor: "#DC2626",
  paddingHorizontal: 18,
  paddingVertical: 14,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
},

  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 24,
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

  exportButton: {
    backgroundColor: "#16A34A",

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: "center",

    marginTop: 15,
    marginBottom: 15,

    elevation: 6,

    shadowColor: "#16A34A",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  exportButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
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

  picker: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 14,

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

    marginTop: 20,

    borderRadius: 16,

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

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  summary: {
    backgroundColor: "#FFFFFF",

    padding: 18,

    marginTop: 20,

    borderRadius: 16,

    marginBottom: 15,

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  // clearButton: {
  //   backgroundColor: "#DC2626",

  //   paddingHorizontal: 18,

  //   justifyContent: "center",

  //   borderRadius: 12,

  //   elevation: 4,
  // },

  card: {
    backgroundColor: "#FFFFFF",

    padding: 18,

    borderRadius: 16,

    marginBottom: 12,

    elevation: 3,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
});
