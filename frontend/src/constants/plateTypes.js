import colors from "../styles/colors";

export const PLATE_TYPES = [
  {
    id: "regular",
    icon: "car-outline",
    color: colors.textSecondary,
  },
  { id: "police", icon: "shield-outline", color: "#1e40af" },
  {
    id: "diplomatic",
    icon: "flag-outline",
    color: "#dc2626",
  },
  {
    id: "government",
    icon: "business-outline",
    color: "#059669",
  },
  {
    id: "emergency",
    icon: "medical-outline",
    color: "#ea580c",
  },
  {
    id: "other",
    icon: "star-outline",
    color: "#7c3aed",
  },
];

export const getPlateTypeInfo = (plateTypeId) => {
  return PLATE_TYPES.find((type) => type.id === plateTypeId) || PLATE_TYPES[0];
};
