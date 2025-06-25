// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import BackButton from "./components/BackButton";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useLocalSearchParams, useRouter } from "expo-router";

// export default function ChooseRecoveryMethod() {
//   // const phoneOptions = [
//   //   "+91********90",
//   //   "+372*******68",
//   //   "+32********78",
//   //   "+87********87",
//   // ];

//   // const emailOptions = [
//   //   "ja********iu@gamil.com",
//   //   "Ui********op@gmail.com",
//   //   "yu********lo@gmail.com",
//   //   "YT********ju@gmail.com",
//   // ];

//   const [emailOptions, setEmailOptions] = useState<string[]>([]);
//   const [phoneOptions, setPhoneOptions] = useState<string[]>([]);
//   const { identifier } = useLocalSearchParams();

//   const baseUrl = "http://localhost:2001";
//   const router = useRouter();

//   const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
//   const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     (async () => {
//       // const token = await AsyncStorage.getItem("userToken");
//       const res = await fetch(`${baseUrl}/api/auth/recovery`, {
//         method: "POST", // Change to POST or another method if needed
//         headers: {
//           "Content-Type": "application/json",
//           // Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ username: identifier }),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         setEmailOptions(data?.emails || []);
//         setPhoneOptions(data?.phones || []);
//       }
//     })();
//   }, []);

//   const handleConfirm = async () => {
//     if (!selectedPhone && !selectedEmail) {
//       setError("Choose one Number or Gmail");
//       return;
//     }

//     const res = await fetch(`${baseUrl}/api/auth/forgot-password-username`, {
//       method: "POST", // Change to POST or another method if needed
//       headers: {
//         "Content-Type": "application/json",
//         // Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         username: identifier,
//         identifier: selectedPhone || selectedEmail,
//       }),
//     });

//     const data = await res.json();
//     if (res.ok) {
//       router.push({
//         pathname: "/reset-password",
//         params: {
//           identifier,
//         },
//       });
//     }

//     setError("");
//     // Proceed with selectedPhone or selectedEmail
//     console.log("Phone:", selectedPhone);
//     console.log("Email:", selectedEmail);
//   };

//   return (
//     <>
//       <BackButton showTitle={false} />
//       <ScrollView style={styles.container}>
//         <View style={styles.box}>
//           <Text style={styles.label}>choose one number</Text>
//           {phoneOptions.map((phone, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.row}
//               onPress={() => {
//                 setSelectedPhone(phone);
//                 setSelectedEmail(null); // Deselect email
//               }}
//             >
//               <Text style={styles.optionText}>{phone}</Text>
//               <Text style={styles.radio}>
//                 {selectedPhone === phone ? "●" : "○"}
//               </Text>
//             </TouchableOpacity>
//           ))}

//           <Text style={[styles.label, { marginTop: 20 }]}>
//             choose one Gmail
//           </Text>
//           {emailOptions.map((email, index) => (
//             <TouchableOpacity
//               key={index}
//               style={styles.row}
//               onPress={() => {
//                 setSelectedEmail(email);
//                 setSelectedPhone(null); // Deselect phone
//               }}
//             >
//               <Text style={styles.optionText}>{email}</Text>
//               <Text style={styles.radio}>
//                 {selectedEmail === email ? "●" : "○"}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
//           <Text style={styles.confirmText}>Confirm</Text>
//         </TouchableOpacity>

//         {error !== "" && <Text style={styles.errorText}>{error}</Text>}
//       </ScrollView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//     padding: 20,
//   },

//   box: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 20,
//   },
//   label: {
//     color: "#000",
//     fontWeight: "600",
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//   },
//   optionText: {
//     color: "#000",
//     fontSize: 15,
//   },
//   radio: {
//     fontSize: 18,
//     color: "#000",
//   },
//   confirmButton: {
//     backgroundColor: "#fff",
//     paddingVertical: 14,
//     borderRadius: 15,
//     marginTop: 40,
//     alignItems: "center",
//     width: 315,
//     marginLeft: "auto",
//     marginRight: "auto",
//   },
//   confirmText: {
//     color: "#000",
//     fontWeight: "400",
//     fontSize: 24,
//   },
//   errorText: {
//     color: "red",
//     textAlign: "center",
//     marginTop: 15,
//     fontSize: 14,
//   },
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import BackButton from "./components/BackButton";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ChooseRecoveryMethod() {
  const [emailOptions, setEmailOptions] = useState<string[]>([]);
  const [phoneOptions, setPhoneOptions] = useState<string[]>([]);
  const { identifier } = useLocalSearchParams();
  const baseUrl = "http://localhost:2001";
  const router = useRouter();

  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ loader state

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/recovery`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: identifier }),
        });

        const data = await res.json();
        if (res.ok) {
          setEmailOptions(data?.emails || []);
          setPhoneOptions(data?.phones || []);
        }
      } catch (err) {
        setError("Failed to load recovery methods");
      }
    })();
  }, []);

  const handleConfirm = async () => {
    if (!selectedPhone && !selectedEmail) {
      setError("Choose one Number or Gmail");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/auth/forgot-password-username`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: identifier,
          identifier: selectedPhone || selectedEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push({
          pathname: "/reset-password",
          params: {
            identifier,
          },
        });
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton showTitle={false} />
      <ScrollView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.label}>choose one number</Text>
          {phoneOptions.map((phone, index) => (
            <TouchableOpacity
              key={index}
              style={styles.row}
              onPress={() => {
                setSelectedPhone(phone);
                setSelectedEmail(null);
              }}
            >
              <Text style={styles.optionText}>{phone}</Text>
              <Text style={styles.radio}>
                {selectedPhone === phone ? "●" : "○"}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={[styles.label, { marginTop: 20 }]}>
            choose one Gmail
          </Text>
          {emailOptions.map((email, index) => (
            <TouchableOpacity
              key={index}
              style={styles.row}
              onPress={() => {
                setSelectedEmail(email);
                setSelectedPhone(null);
              }}
            >
              <Text style={styles.optionText}>{email}</Text>
              <Text style={styles.radio}>
                {selectedEmail === email ? "●" : "○"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, loading && { opacity: 0.6 }]}
          onPress={handleConfirm}
          disabled={loading}
        >
          <Text style={styles.confirmText}>
            {loading ? "Loading..." : "Confirm"}
          </Text>
        </TouchableOpacity>

        {error !== "" && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  box: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
  },
  label: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  optionText: {
    color: "#000",
    fontSize: 15,
  },
  radio: {
    fontSize: 18,
    color: "#000",
  },
  confirmButton: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 15,
    marginTop: 40,
    alignItems: "center",
    width: 315,
    marginLeft: "auto",
    marginRight: "auto",
  },
  confirmText: {
    color: "#000",
    fontWeight: "400",
    fontSize: 24,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
  },
});

