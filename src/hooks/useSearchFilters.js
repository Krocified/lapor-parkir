import { useState, useEffect, useMemo } from "react";
import {
  SEARCH_TYPES,
  DATE_FILTERS,
  applyAllFilters,
} from "../utils/filterUtils";

export const useSearchFilters = (reports) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterType, setActiveFilterType] = useState(SEARCH_TYPES.ALL);
  const [activeDateFilter, setActiveDateFilter] = useState(DATE_FILTERS.ALL);
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [selectedPlateTypes, setSelectedPlateTypes] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  // Apply all filters whenever any filter state or reports change
  useEffect(() => {
    const filtered = applyAllFilters(
      reports,
      searchQuery,
      activeFilterType,
      activeDateFilter,
      selectedViolations,
      selectedPlateTypes
    );
    setFilteredReports(filtered);
  }, [
    reports,
    searchQuery,
    activeFilterType,
    activeDateFilter,
    selectedViolations,
    selectedPlateTypes,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveFilterType(SEARCH_TYPES.ALL);
    setActiveDateFilter(DATE_FILTERS.ALL);
    setSelectedViolations([]);
    setSelectedPlateTypes([]);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery ||
      activeFilterType !== SEARCH_TYPES.ALL ||
      activeDateFilter !== DATE_FILTERS.ALL ||
      selectedViolations.length > 0 ||
      selectedPlateTypes.length > 0
    );
  }, [
    searchQuery,
    activeFilterType,
    activeDateFilter,
    selectedViolations,
    selectedPlateTypes,
  ]);

  return {
    // Filter states
    searchQuery,
    activeFilterType,
    activeDateFilter,
    selectedViolations,
    selectedPlateTypes,
    filteredReports,

    // Setters
    setSearchQuery,
    setActiveFilterType,
    setActiveDateFilter,
    setSelectedViolations,
    setSelectedPlateTypes,

    // Actions
    clearAllFilters,
    hasActiveFilters,
  };
};
