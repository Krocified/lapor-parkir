import { useTranslation } from "react-i18next";

// Violation types mapping for translations
export const useViolationTranslations = () => {
  const { t } = useTranslation();

  return {
    double_parking: t("violations.doubleParking"),
    no_parking_zone: t("violations.noParkingZone"),
    handicap_spot: t("violations.handicapSpot"),
    fire_hydrant: t("violations.fireHydrant"),
    crosswalk: t("violations.crosswalk"),
    expired_meter: t("violations.expiredMeter"),
    blocking_driveway: t("violations.blockingDriveway"),
    no_stopping: t("violations.noStopping"),
  };
};

// Plate types mapping for translations
export const usePlateTypeTranslations = () => {
  const { t } = useTranslation();

  return {
    regular: t("plateTypes.regular"),
    police: t("plateTypes.police"),
    diplomatic: t("plateTypes.diplomatic"),
    government: t("plateTypes.government"),
    emergency: t("plateTypes.emergency"),
    other: t("plateTypes.other"),
  };
};

// Helper function to get translated violation label
export const getViolationLabel = (violationId, t) => {
  const translations = {
    double_parking: t("violations.doubleParking"),
    no_parking_zone: t("violations.noParkingZone"),
    handicap_spot: t("violations.handicapSpot"),
    fire_hydrant: t("violations.fireHydrant"),
    crosswalk: t("violations.crosswalk"),
    expired_meter: t("violations.expiredMeter"),
    blocking_driveway: t("violations.blockingDriveway"),
    no_stopping: t("violations.noStopping"),
  };

  return translations[violationId] || violationId;
};

// Helper function to get translated plate type label
export const getPlateTypeLabel = (plateTypeId, t) => {
  const translations = {
    regular: t("plateTypes.regular"),
    police: t("plateTypes.police"),
    diplomatic: t("plateTypes.diplomatic"),
    government: t("plateTypes.government"),
    emergency: t("plateTypes.emergency"),
    other: t("plateTypes.other"),
  };

  return translations[plateTypeId] || plateTypeId;
};
