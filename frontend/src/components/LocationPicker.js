import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";
import Typography from "./common/Typography";

export default function LocationPicker({
  visible,
  onLocationSelect,
  onClose,
  initialLocation,
}) {
  const { t } = useTranslation();
  const [manualAddress, setManualAddress] = useState(
    initialLocation?.address || ""
  );
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] =
    useState(false);

  const getCurrentLocation = async () => {
    setIsGettingCurrentLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("locationPicker.permissionDenied"),
          t("locationPicker.permissionNeeded")
        );
        setIsGettingCurrentLocation(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Get address for current location
      const address = await getAddressFromCoordinates(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      onLocationSelect({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        address: address,
      });
      onClose();
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert(
        t("locationPicker.errorTitle"),
        t("locationPicker.getCurrentLocationError")
      );
    } finally {
      setIsGettingCurrentLocation(false);
    }
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResult) {
        const formattedAddress = [
          addressResult.streetNumber,
          addressResult.street,
          addressResult.district,
          addressResult.city,
          addressResult.region,
        ]
          .filter(Boolean)
          .join(", ");
        return formattedAddress || t("locationPicker.currentLocation");
      }
      return t("locationPicker.currentLocation");
    } catch (error) {
      console.error("Error getting address:", error);
      return t("locationPicker.currentLocation");
    }
  };

  const handleManualLocationSubmit = () => {
    if (!manualAddress.trim()) {
      Alert.alert(
        t("locationPicker.errorTitle"),
        t("locationPicker.enterAddressError")
      );
      return;
    }

    // For manual entry, we'll use default coordinates (can be enhanced with geocoding later)
    onLocationSelect({
      latitude: -6.2088, // Default Jakarta coordinates
      longitude: 106.8456,
      address: manualAddress.trim(),
    });
    onClose();
  };

  const handleClose = () => {
    setManualAddress(initialLocation?.address || "");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Typography variant="h4" style={styles.title}>
            {t("locationPicker.selectLocationTitle")}
          </Typography>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Current Location Option */}
          <View style={styles.section}>
            <Typography variant="subtitle1" style={styles.sectionTitle}>
              {t("locationPicker.useCurrentLocationTitle")}
            </Typography>
            <TouchableOpacity
              style={[
                styles.currentLocationButton,
                isGettingCurrentLocation &&
                  styles.currentLocationButtonDisabled,
              ]}
              onPress={getCurrentLocation}
              disabled={isGettingCurrentLocation}
            >
              <Ionicons
                name={isGettingCurrentLocation ? "hourglass-outline" : "locate"}
                size={20}
                color="#fff"
              />
              <Typography
                variant="button"
                style={styles.currentLocationButtonText}
              >
                {isGettingCurrentLocation
                  ? t("locationPicker.gettingLocation")
                  : t("locationPicker.useCurrentLocationButton")}
              </Typography>
            </TouchableOpacity>
            <Typography variant="caption" style={styles.sectionNote}>
              {t("locationPicker.gpsNote")}
            </Typography>
          </View>

          {/* Manual Address Entry */}
          <View style={styles.section}>
            <Typography variant="subtitle1" style={styles.sectionTitle}>
              {t("locationPicker.manualEntryTitle")}
            </Typography>
            <TextInput
              style={styles.addressInput}
              value={manualAddress}
              onChangeText={setManualAddress}
              placeholder={t("locationPicker.addressPlaceholder")}
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={[
                styles.manualButton,
                !manualAddress.trim() && styles.manualButtonDisabled,
              ]}
              onPress={handleManualLocationSubmit}
              disabled={!manualAddress.trim()}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Typography variant="button" style={styles.manualButtonText}>
                {t("locationPicker.useThisAddressButton")}
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#666"
            />
            <Typography variant="body2" style={styles.infoText}>
              {Platform.OS === "web"
                ? t("locationPicker.webInfo")
                : t("locationPicker.genericInfo")}
            </Typography>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    color: "#333",
  },
  closeButton: {
    padding: 5,
  },
  placeholder: {
    width: 34, // Same width as close button for centering
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  sectionNote: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
    lineHeight: 16,
  },
  currentLocationButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  currentLocationButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  currentLocationButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  addressInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 15,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    minHeight: 80,
    marginBottom: 15,
    fontFamily: "Inter-Regular",
  },
  manualButton: {
    backgroundColor: "#27ae60",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  manualButtonDisabled: {
    backgroundColor: "#bdc3c7",
  },
  manualButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    lineHeight: 20,
  },
});
