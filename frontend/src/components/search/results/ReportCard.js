import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import colors, { semanticColors } from "../../../styles/colors";
import { getPlateTypeInfo } from "../../../constants/plateTypes";
import {
  getViolationLabel,
  getPlateTypeLabel,
} from "../../../i18n/translations";
import Typography from "../../common/Typography";

const ReportCard = React.memo(({ item, onDeleteReport }) => {
  const { t } = useTranslation();

  const formatViolations = (violations) => {
    return violations.map((id) => getViolationLabel(id, t)).join(", ");
  };

  const renderPlateTypeBadge = (plateType) => {
    if (!plateType || plateType === "regular") return null;

    const typeInfo = getPlateTypeInfo(plateType);
    return (
      <View
        style={[styles.plateTypeBadge, { backgroundColor: typeInfo.color }]}
      >
        <Ionicons name={typeInfo.icon} size={12} color={colors.white} />
        <Typography variant="overline" style={styles.plateTypeBadgeText}>
          {getPlateTypeLabel(plateType, t)}
        </Typography>
      </View>
    );
  };

  const renderVehicleTypeBadge = (vehicleType) => {
    if (!vehicleType) return null;

    const icon = vehicleType === "car" ? "car" : "motorbike";
    const label = t(
      `report.vehicleType${vehicleType === "car" ? "Car" : "Motorcycle"}`
    );

    return (
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={colors.textSecondary}
        accessibilityLabel={label}
        accessibilityRole="image"
        accessibilityHint={t("report.vehicleTypeHint")}
      />
    );
  };

  return (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <View style={styles.plateSection}>
          <View style={styles.plateContainer}>
            <Typography variant="h4" style={styles.plateNumber}>
              {item.plateNumber}
            </Typography>
          </View>
          <View style={styles.badgesContainer}>
            {renderVehicleTypeBadge(item.vehicleType)}
            {renderPlateTypeBadge(item.plateType)}
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDeleteReport(item._id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.reportContent}>
        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Typography variant="body2" style={styles.infoText}>
            {item.date} at {item.time}
          </Typography>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="location-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Typography variant="body2" style={styles.infoText} numberOfLines={2}>
            {item.location.address}
          </Typography>
        </View>

        <View style={styles.violationsContainer}>
          <Typography variant="subtitle2" style={styles.violationsLabel}>
            {t("search.violationsLabel")}
          </Typography>
          <Typography variant="body2" style={styles.violationsText}>
            {formatViolations(item.violations)}
          </Typography>
        </View>

        {item.notes ? (
          <View style={styles.notesContainer}>
            <Typography variant="subtitle2" style={styles.notesLabel}>
              {t("search.notesLabel")}
            </Typography>
            <Typography variant="body2" style={styles.notesText}>
              {item.notes}
            </Typography>
          </View>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: semanticColors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: semanticColors.cardBorder,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 15,
    paddingBottom: 10,
  },
  plateSection: {
    flex: 1,
  },
  plateContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  plateNumber: {
    color: colors.white,
    fontSize: 16,
    letterSpacing: 1,
  },
  plateTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 4,
  },
  plateTypeBadgeText: {
    color: colors.white,
    fontSize: 10,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: semanticColors.iconBackground,
  },
  reportContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  infoText: {
    color: colors.textSecondary,
    flex: 1,
  },
  violationsContainer: {
    marginTop: 10,
    marginBottom: 8,
  },
  violationsLabel: {
    color: colors.textPrimary,
    marginBottom: 4,
  },
  violationsText: {
    color: colors.textSecondary,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesText: {
    color: colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
});

export default ReportCard;
