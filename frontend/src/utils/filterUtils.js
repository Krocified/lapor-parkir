export const DATE_FILTERS = {
  ALL: "all",
  TODAY: "today",
  YESTERDAY: "yesterday",
  LAST_WEEK: "last_week",
  LAST_MONTH: "last_month",
};

export const SEARCH_TYPES = {
  ALL: "all",
  PLATES: "plates",
  LOCATION: "location",
  NOTES: "notes",
};

export const isDateInRange = (reportDate, dateFilter) => {
  if (dateFilter === DATE_FILTERS.ALL) return true;

  const today = new Date();
  const reportDateObj = new Date(reportDate);

  switch (dateFilter) {
    case DATE_FILTERS.TODAY:
      return reportDateObj.toDateString() === today.toDateString();

    case DATE_FILTERS.YESTERDAY:
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return reportDateObj.toDateString() === yesterday.toDateString();

    case DATE_FILTERS.LAST_WEEK:
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return reportDateObj >= weekAgo;

    case DATE_FILTERS.LAST_MONTH:
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return reportDateObj >= monthAgo;

    default:
      return true;
  }
};

export const filterReportsBySearch = (reports, searchQuery, searchType) => {
  if (!searchQuery.trim()) return reports;

  const searchTerm = searchQuery.toLowerCase();
  return reports.filter((report) => {
    switch (searchType) {
      case SEARCH_TYPES.PLATES:
        return report.plateNumber.toLowerCase().includes(searchTerm);
      case SEARCH_TYPES.LOCATION:
        return report.location.address.toLowerCase().includes(searchTerm);
      case SEARCH_TYPES.NOTES:
        return report.notes.toLowerCase().includes(searchTerm);
      case SEARCH_TYPES.ALL:
      default:
        return (
          report.plateNumber.toLowerCase().includes(searchTerm) ||
          report.location.address.toLowerCase().includes(searchTerm) ||
          report.notes.toLowerCase().includes(searchTerm) ||
          report.violations.some((violation) =>
            violation.toLowerCase().includes(searchTerm)
          )
        );
    }
  });
};

export const filterReportsByDate = (reports, dateFilter) => {
  if (dateFilter === DATE_FILTERS.ALL) return reports;

  return reports.filter((report) =>
    isDateInRange(new Date(report.timestamp), dateFilter)
  );
};

export const filterReportsByViolations = (reports, selectedViolations) => {
  if (selectedViolations.length === 0) return reports;

  return reports.filter((report) =>
    selectedViolations.some((violation) =>
      report.violations.includes(violation)
    )
  );
};

export const filterReportsByPlateTypes = (reports, selectedPlateTypes) => {
  if (selectedPlateTypes.length === 0) return reports;

  return reports.filter((report) =>
    selectedPlateTypes.includes(report.plateType || "regular")
  );
};

export const applyAllFilters = (
  reports,
  searchQuery,
  searchType,
  dateFilter,
  selectedViolations,
  selectedPlateTypes
) => {
  let filtered = [...reports];

  filtered = filterReportsBySearch(filtered, searchQuery, searchType);
  filtered = filterReportsByDate(filtered, dateFilter);
  filtered = filterReportsByViolations(filtered, selectedViolations);
  filtered = filterReportsByPlateTypes(filtered, selectedPlateTypes);

  return filtered;
};
