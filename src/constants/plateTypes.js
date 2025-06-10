import colors from "../styles/colors";

export const PLATE_TYPES = [
  {
    id: "regular",
    label: "Regular",
    icon: "car-outline",
    color: colors.textSecondary,
  },
  { id: "police", label: "Police", icon: "shield-outline", color: "#1e40af" },
  {
    id: "diplomatic",
    label: "Diplomatic",
    icon: "flag-outline",
    color: "#dc2626",
  },
  {
    id: "government",
    label: "Government",
    icon: "business-outline",
    color: "#059669",
  },
  {
    id: "emergency",
    label: "Emergency",
    icon: "medical-outline",
    color: "#ea580c",
  },
  {
    id: "other",
    label: "Other Special",
    icon: "star-outline",
    color: "#7c3aed",
  },
];

export const getPlateTypeInfo = (plateTypeId) => {
  return PLATE_TYPES.find((type) => type.id === plateTypeId) || PLATE_TYPES[0];
};
