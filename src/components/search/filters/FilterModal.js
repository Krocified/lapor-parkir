import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors, { semanticColors } from "../../../styles/colors";

const FilterModal = ({
  visible,
  onClose,
  title,
  items,
  selectedItems,
  onToggleItem,
  onClearAll,
  clearButtonText = "Clear All",
  renderItem, // Custom render function for items
}) => {
  const defaultRenderItem = (item, isSelected) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.modalItem, isSelected && styles.modalItemSelected]}
      onPress={() => onToggleItem(item.id)}
    >
      <View style={styles.modalItemContent}>
        {item.icon && (
          <Ionicons
            name={item.icon}
            size={20}
            color={isSelected ? colors.white : item.color || colors.textPrimary}
            style={styles.modalItemIcon}
          />
        )}
        <Text
          style={[
            styles.modalItemText,
            isSelected && styles.modalItemTextSelected,
          ]}
        >
          {item.label}
        </Text>
      </View>
      {isSelected && (
        <Ionicons name="checkmark" size={20} color={colors.white} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {items.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return renderItem
                ? renderItem(item, isSelected, onToggleItem)
                : defaultRenderItem(item, isSelected);
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.modalClearButton}
            onPress={() => {
              onClearAll();
              onClose();
            }}
          >
            <Text style={styles.modalClearButtonText}>{clearButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: semanticColors.modalOverlay,
    padding: 20,
  },
  modalContent: {
    backgroundColor: semanticColors.modalBackground,
    borderRadius: 15,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.modalBorder,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  modalBody: {
    padding: 20,
    maxHeight: 300,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  modalItemSelected: {
    backgroundColor: semanticColors.chipActiveBackground,
    borderColor: colors.primary,
  },
  modalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalItemIcon: {
    marginRight: 10,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  modalItemTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  modalClearButton: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
    marginTop: 0,
  },
  modalClearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
});

export default FilterModal;
