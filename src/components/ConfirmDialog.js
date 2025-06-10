import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../styles/colors";

const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = "danger", // danger, warning, info
}) => {
  const { t } = useTranslation();

  // Use translations for default values if not provided
  const finalConfirmText = confirmText || t("dialogs.confirm");
  const finalCancelText = cancelText || t("dialogs.cancel");

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
        return colors.primary;
      case "warning":
        return colors.warning;
      case "info":
        return colors.info;
      default:
        return colors.textSecondary;
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
              <Text style={styles.cancelButtonText}>{finalCancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                styles[`${type}Button`],
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{finalConfirmText}</Text>
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
    backgroundColor: semanticColors.modalOverlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialog: {
    backgroundColor: semanticColors.modalBackground,
    borderRadius: 15,
    width: "100%",
    maxWidth: 400,
    shadowColor: colors.shadow,
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
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: semanticColors.modalBorder,
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
    borderRightColor: semanticColors.modalBorder,
  },
  confirmButton: {
    // Base confirm button styles
  },
  dangerButton: {
    backgroundColor: colors.primary,
  },
  warningButton: {
    backgroundColor: colors.warning,
  },
  infoButton: {
    backgroundColor: colors.info,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  confirmButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "600",
  },
});

export default ConfirmDialog;
