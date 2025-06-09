import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

export default function LocationPicker({
  visible,
  onLocationSelect,
  onClose,
  initialLocation,
}) {
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
          "Permission Denied",
          "Location access is needed to get your current location"
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
        "Error",
        "Could not get current location. Please enter the address manually."
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
        return formattedAddress || "Current location";
      }
      return "Current location";
    } catch (error) {
      console.error("Error getting address:", error);
      return "Current location";
    }
  };

  const handleManualLocationSubmit = () => {
    if (!manualAddress.trim()) {
      Alert.alert("Error", "Please enter an address");
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
          <Text style={styles.title}>Select Location</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Current Location Option */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Use Current Location</Text>
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
              <Text style={styles.currentLocationButtonText}>
                {isGettingCurrentLocation
                  ? "Getting Location..."
                  : "Use Current Location"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.sectionNote}>
              This will use your device's GPS to automatically detect your
              current location
            </Text>
          </View>

          {/* Manual Address Entry */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Or Enter Address Manually</Text>
            <TextInput
              style={styles.addressInput}
              value={manualAddress}
              onChangeText={setManualAddress}
              placeholder="Enter the address where the violation occurred..."
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
              <Text style={styles.manualButtonText}>Use This Address</Text>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#666"
            />
            <Text style={styles.infoText}>
              {Platform.OS === "web"
                ? "On web, manual address entry is recommended for better accuracy."
                : "You can either use your current GPS location or manually enter the address where the parking violation occurred."}
            </Text>
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
    fontWeight: "bold",
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
    fontWeight: "bold",
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
    fontWeight: "bold",
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
    fontWeight: "bold",
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
