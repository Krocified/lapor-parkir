import { useState } from "react";
import { Animated } from "react-native";

export const useNotification = () => {
  const [notification, setNotification] = useState(null);
  const [notificationAnim] = useState(new Animated.Value(0));

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    Animated.sequence([
      Animated.timing(notificationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(notificationAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotification(null);
    });
  };

  const hideNotification = () => {
    Animated.timing(notificationAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setNotification(null);
    });
  };

  return {
    notification,
    notificationAnim,
    showNotification,
    hideNotification,
  };
};
