import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors, { semanticColors } from "../../../styles/colors";
import Typography from "../../common/Typography";

const FilterChip = ({
  label,
  isActive = false,
  onPress,
  icon,
  count,
  isSpecial = false, // For clear filters or other special chips
}) => {
  const getChipStyle = () => {
    if (isSpecial) return [styles.filterChip, styles.specialChip];
    if (isActive) return [styles.filterChip, styles.filterChipActive];
    return styles.filterChip;
  };

  const getTextStyle = () => {
    if (isSpecial) return [styles.filterChipText, styles.specialChipText];
    if (isActive) return [styles.filterChipText, styles.filterChipTextActive];
    return styles.filterChipText;
  };

  const getIconColor = () => {
    if (isSpecial) return colors.primary;
    if (isActive) return colors.white;
    return colors.textSecondary;
  };

  const displayLabel = count > 0 ? `${label} (${count})` : label;

  return (
    <TouchableOpacity style={getChipStyle()} onPress={onPress}>
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={getIconColor()}
          style={styles.filterChipIcon}
        />
      )}
      <Typography variant="caption" style={getTextStyle()}>
        {displayLabel}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: semanticColors.chipBorder,
    borderRadius: 12,
    backgroundColor: semanticColors.chipBackground,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    height: 28,
    flexShrink: 0,
  },
  filterChipActive: {
    backgroundColor: semanticColors.chipActiveBackground,
    borderColor: colors.primary,
  },
  specialChip: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  filterChipText: {
    fontSize: 12,
    color: semanticColors.chipText,
    lineHeight: 16,
  },
  filterChipTextActive: {
    color: semanticColors.chipActiveText,
  },
  specialChipText: {
    color: colors.primary,
  },
  filterChipIcon: {
    marginRight: 3,
  },
});

export default FilterChip;
