import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger", // danger, warning, info
}) => {
  if (!visible) return null;

  const getIconName = () => {
    switch (type) {
      case "danger":
        return "trash-outline";
      case "warning":
        return "warning-outline";
      case "info":
        return "information-circle-outline";
      default:
        return "help-circle-outline";
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "danger":
        return "#e74c3c";
      case "warning":
        return "#f39c12";
      case "info":
        return "#3498db";
      default:
        return "#666";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <Ionicons name={getIconName()} size={32} color={getIconColor()} />
          </View>

          <View style={styles.content}>
            {title && <Text style={styles.title}>{title}</Text>}
            {message && <Text style={styles.message}>{message}</Text>}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                styles[`${type}Button`],
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialog: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    paddingTop: 25,
    paddingBottom: 15,
  },
  content: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: "#f0f0f0",
  },
  confirmButton: {
    // Base confirm button styles
  },
  dangerButton: {
    backgroundColor: "#e74c3c",
  },
  warningButton: {
    backgroundColor: "#f39c12",
  },
  infoButton: {
    backgroundColor: "#3498db",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default ConfirmDialog;
