import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const InAppNotification = ({ notification, animationValue }) => {
  if (!notification) return null;

  return (
    <Animated.View
      style={[
        styles.notification,
        styles[
          `notification${notification.type
            .charAt(0)
            .toUpperCase()}${notification.type.slice(1)}`
        ],
        {
          opacity: animationValue,
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Ionicons
        name={
          notification.type === "success" ? "checkmark-circle" : "alert-circle"
        }
        size={20}
        color="#fff"
      />
      <Text style={styles.notificationText}>{notification.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  notification: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 1000,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notificationSuccess: {
    backgroundColor: "#27ae60",
  },
  notificationError: {
    backgroundColor: "#e74c3c",
  },
  notificationText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
});

export default InAppNotification;
