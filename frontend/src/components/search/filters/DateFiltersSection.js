import React from "react";
import { View, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { Select, MenuItem, FormControl } from "@mui/material";
import { DATE_FILTERS } from "../../../utils/filterUtils";
import colors from "../../../styles/colors";
import Typography from "../../common/Typography";

const DateFiltersSection = ({ dateFilter, onDateFilterChange }) => {
  const { t } = useTranslation();

  const getDateFilterLabel = (filter) => {
    switch (filter) {
      case DATE_FILTERS.ALL:
        return t("search.dateFilterAny");
      case DATE_FILTERS.TODAY:
        return t("search.dateFilterToday");
      case DATE_FILTERS.YESTERDAY:
        return t("search.dateFilterYesterday");
      case DATE_FILTERS.LAST_WEEK:
        return t("search.dateFilterLastWeek");
      case DATE_FILTERS.LAST_MONTH:
        return t("search.dateFilterLastMonth");
      default:
        return filter.charAt(0).toUpperCase() + filter.slice(1);
    }
  };

  const dateFilterOptions = Object.entries(DATE_FILTERS)
    .filter(([key]) => key !== "CUSTOM")
    .map(([key, value]) => ({
      value,
      label: getDateFilterLabel(value),
    }));

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
        <Typography variant="subtitle2" style={styles.label}>
          {t("search.dateFilters")}
        </Typography>
      </View>
      <FormControl fullWidth>
        <Select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          displayEmpty
          sx={{
            height: 48,
            backgroundColor: colors.surface,
            borderRadius: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        >
          {dateFilterOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontSize: 16,
                color:
                  option.value === dateFilter
                    ? colors.primary
                    : colors.textPrimary,
                fontWeight: option.value === dateFilter ? 600 : 400,
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  label: {
    color: colors.primary,
  },
});

export default DateFiltersSection;
