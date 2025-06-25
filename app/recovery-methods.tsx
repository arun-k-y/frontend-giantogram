import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const baseUrl = "http://localhost:2001";

export default function RecoveryMethods() {
  const [emails, setEmails] = useState<string[]>([]);
  const [phones, setPhones] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${baseUrl}/api/auth/recovery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEmails(data?.emails || []);
        setPhones(data?.phones || []);
      }
    })();
  }, []);

  const handleAdd = async (type: "email" | "phone") => {
    const token = await AsyncStorage.getItem("userToken");
    setLoading(true);

    const payload =
      type === "email"
        ? { emails: [...emails, newEmail], phones }
        : { emails, phones: [...phones, newPhone] };

    const res = await fetch(`${baseUrl}/api/auth/add-recovery`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      if (type === "email") {
        setEmails((prev) => [...prev, newEmail]);
        setNewEmail("");
      } else {
        setPhones((prev) => [...prev, newPhone]);
        setNewPhone("");
      }
    } else {
      Alert.alert("Error", data.message || "Failed to update");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Recovery Methods</Text>

      {/* Email Section */}
      <Text style={styles.sectionTitle}>Emails ({emails.length}/4)</Text>
      {emails.map((email, i) => (
        <Text key={i} style={styles.entryText}>
          • {email}
        </Text>
      ))}

      {emails.length < 4 && (
        <View style={styles.inputRow}>
          <TextInput
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Enter email"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAdd("email")}
            disabled={!newEmail.trim() || loading}
            className="disabled:opacity-50"
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Phone Section */}
      <Text style={styles.sectionTitle}>Phone Numbers ({phones.length}/4)</Text>
      {phones.map((phone, i) => (
        <Text key={i} style={styles.entryText}>
          • {phone}
        </Text>
      ))}

      {phones.length < 4 && (
        <View style={styles.inputRow}>
          <TextInput
            value={newPhone}
            onChangeText={setNewPhone}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAdd("phone")}
            disabled={!newPhone.trim() || loading}
            className="disabled:opacity-50"
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#000",
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  entryText: {
    color: "#ddd",
    fontSize: 15,
    marginBottom: 5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    color: "#fff",
  },
  addButton: {
    marginLeft: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#4ADE80",
    borderRadius: 10,
  },
  buttonText: {
    color: "#000",
    fontWeight: "600",
  },
});
