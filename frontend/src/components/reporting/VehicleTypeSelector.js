import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import colors from "../../styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const VehicleTypeSelector = ({
  vehicleType,
  onVehicleTypeChange,
  isExpanded,
  onToggleExpanded,
}) => {
  const { t } = useTranslation();

  const handleVehicleTypeChange = (type) => {
    onVehicleTypeChange(type);
    onToggleExpanded(); // Auto close after selection
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggleExpanded}>
        <View style={styles.headerContent}>
          <Text style={styles.label}>{t("report.vehicleType")}</Text>
          <View style={styles.selectedPreview}>
            <MaterialCommunityIcons
              name={vehicleType === "car" ? "car" : "motorbike"}
              size={16}
              color={colors.text}
            />
            <Text style={styles.selectedText}>
              {t(
                `report.vehicleType${
                  vehicleType === "car" ? "Car" : "Motorcycle"
                }`
              )}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleOption,
              vehicleType === "car" && styles.activeOption,
            ]}
            onPress={() => handleVehicleTypeChange("car")}
          >
            <MaterialCommunityIcons
              name="car"
              size={20}
              color={vehicleType === "car" ? colors.white : colors.text}
            />
            <Text
              style={[
                styles.toggleLabel,
                vehicleType === "car" && styles.activeLabel,
              ]}
            >
              {t("report.vehicleTypeCar")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleOption,
              vehicleType === "motorcycle" && styles.activeOption,
            ]}
            onPress={() => handleVehicleTypeChange("motorcycle")}
          >
            <MaterialCommunityIcons
              name="motorbike"
              size={20}
              color={vehicleType === "motorcycle" ? colors.white : colors.text}
            />
            <Text
              style={[
                styles.toggleLabel,
                vehicleType === "motorcycle" && styles.activeLabel,
              ]}
            >
              {t("report.vehicleTypeMotorcycle")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  selectedPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectedText: {
    fontSize: 14,
    color: colors.text,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  toggleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 6,
    gap: 6,
  },
  activeOption: {
    backgroundColor: colors.primary,
  },
  toggleLabel: {
    fontSize: 14,
    color: colors.text,
  },
  activeLabel: {
    color: colors.white,
    fontWeight: "600",
  },
});

export default VehicleTypeSelector;
