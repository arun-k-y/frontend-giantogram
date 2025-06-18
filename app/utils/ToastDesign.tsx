import { StyleSheet, Text, View } from "react-native";

export const toastConfig = {
  success: ({ text1, props }: { text1?: string; props?: any }) => (
    <View style={[styles.toastContainer, { borderLeftColor: "#4CAF50" }]}>
      <Text
        style={[styles.toastText, { color: "#4CAF50", fontWeight: "bold" }]}
      >
        {text1}
      </Text>
    </View>
  ),
  error: ({ text1, props }: { text1?: string; props?: any }) => (
    <View style={[styles.toastContainer, { borderLeftColor: "#F44336" }]}>
      <Text
        style={[styles.toastText, { color: "#F44336", fontWeight: "bold" }]}
      >
        {text1}
      </Text>
    </View>
  ),
};

export const styles = StyleSheet.create({
  toastContainer: {
    height: 60,
    width: "90%",
    backgroundColor: "#fff",
    borderLeftWidth: 5,
    paddingHorizontal: 15,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    borderRadius: 8,
  },
  toastText: {
    fontSize: 16,
  },
});
