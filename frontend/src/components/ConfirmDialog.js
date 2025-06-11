import React from "react";
import { View, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../styles/colors";
import Typography from "./common/Typography";

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
            {title && (
              <Typography variant="h3" style={styles.title}>
                {title}
              </Typography>
            )}
            {message && (
              <Typography variant="body1" style={styles.message}>
                {message}
              </Typography>
            )}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Typography variant="button" style={styles.cancelButtonText}>
                {finalCancelText}
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.confirmButton,
                styles[`${type}Button`],
              ]}
              onPress={onConfirm}
            >
              <Typography variant="button" style={styles.confirmButtonText}>
                {finalConfirmText}
              </Typography>
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
    backgroundColor: colors.background,
    borderRadius: 15,
    maxWidth: 350,
    width: "100%",
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  title: {
    textAlign: "center",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  message: {
    textAlign: "center",
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: semanticColors.cardBorder,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: semanticColors.cardBorder,
  },
  confirmButton: {
    // Default confirm button styles
  },
  dangerButton: {
    backgroundColor: "rgba(220, 53, 69, 0.1)",
  },
  warningButton: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
  },
  infoButton: {
    backgroundColor: "rgba(13, 202, 240, 0.1)",
  },
  cancelButtonText: {
    color: colors.textSecondary,
  },
  confirmButtonText: {
    color: colors.primary,
  },
});

export default ConfirmDialog;
