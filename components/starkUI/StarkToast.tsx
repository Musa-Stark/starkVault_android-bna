import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Check, Info, TriangleAlert, X } from "lucide-react-native";
import Toast, { BaseToastProps, ToastConfig } from "react-native-toast-message";

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View style={styles.container}>
      <View style={[styles.icon, styles.successIcon]}>
        <Check size={15} color="#fff" strokeWidth={3} />
      </View>

      <View style={styles.content}>
        {!!text1 && <Text style={styles.title}>{text1}</Text>}
        {!!text2 && <Text style={styles.description}>{text2}</Text>}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: BaseToastProps) => (
    <View style={styles.container}>
      <View style={[styles.icon, styles.errorIcon]}>
        <X size={15} color="#fff" strokeWidth={3} />
      </View>

      <View style={styles.content}>
        {!!text1 && <Text style={styles.title}>{text1}</Text>}
        {!!text2 && <Text style={styles.description}>{text2}</Text>}
      </View>
    </View>
  ),

  info: ({ text1, text2 }: BaseToastProps) => (
    <View style={styles.container}>
      <View style={[styles.icon, styles.infoIcon]}>
        <Info size={15} color="#fff" strokeWidth={3} />
      </View>

      <View style={styles.content}>
        {!!text1 && <Text style={styles.title}>{text1}</Text>}
        {!!text2 && <Text style={styles.description}>{text2}</Text>}
      </View>
    </View>
  ),

  warning: ({ text1, text2 }: BaseToastProps) => (
    <View style={styles.container}>
      <View style={[styles.icon, styles.warningIcon]}>
        <TriangleAlert size={15} color="#fff" strokeWidth={3} />
      </View>

      <View style={styles.content}>
        {!!text1 && <Text style={styles.title}>{text1}</Text>}
        {!!text2 && <Text style={styles.description}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: "#18181b",
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },

  icon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  successIcon: {
    backgroundColor: "#16a34a",
  },

  errorIcon: {
    backgroundColor: "#dc2626",
  },

  infoIcon: {
    backgroundColor: "#2563eb",
  },

  warningIcon: {
    backgroundColor: "#d97706",
  },

  content: {
    flex: 1,
  },

  title: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  description: {
    color: "#a1a1aa",
    fontSize: 12,
    marginTop: 2,
  },
});

export default toastConfig;
