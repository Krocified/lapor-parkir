import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import colors from "../../../styles/colors";
import Typography from "../../common/Typography";

const LoadingState = ({ message, size = "large", color = colors.primary }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={size} color={color} />
      <Typography variant="body1" style={styles.loadingText}>
        {message || t("search.loadingReports")}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
});

export default LoadingState;
