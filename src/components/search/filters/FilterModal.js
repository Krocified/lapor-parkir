import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors, { semanticColors } from "../../../styles/colors";
import Typography from "../../common/Typography";

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
        <Typography
          variant="body1"
          style={[
            styles.modalItemText,
            isSelected && styles.modalItemTextSelected,
          ]}
        >
          {item.label}
        </Typography>
      </View>
      {isSelected && (
        <Ionicons name="checkmark" size={20} color={colors.white} />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Typography variant="h3" style={styles.modalTitle}>
            {title}
          </Typography>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {items.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return renderItem
              ? renderItem(item, isSelected)
              : defaultRenderItem(item, isSelected);
          })}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.clearAllButton} onPress={onClearAll}>
            <Typography variant="button" style={styles.clearAllButtonText}>
              {clearButtonText}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.cardBorder,
  },
  modalTitle: {
    fontSize: 20,
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: semanticColors.cardBackground,
    borderWidth: 1,
    borderColor: semanticColors.cardBorder,
  },
  modalItemSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryDark,
  },
  modalItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  modalItemIcon: {
    marginRight: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  modalItemTextSelected: {
    color: colors.white,
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: semanticColors.cardBorder,
  },
  clearAllButton: {
    backgroundColor: colors.textSecondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  clearAllButtonText: {
    color: colors.white,
    fontSize: 14,
  },
});

export default FilterModal;
