import React from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import ReportCard from "./ReportCard";
import EmptyState from "./EmptyState";
import LoadingState from "./LoadingState";

const SearchResults = ({
  reports,
  isLoading,
  refreshing,
  onRefresh,
  onDeleteReport,
  hasActiveFilters,
  onClearAllFilters,
  listKey,
}) => {
  const renderItem = React.useCallback(
    ({ item }) => <ReportCard item={item} onDeleteReport={onDeleteReport} />,
    [onDeleteReport]
  );

  const keyExtractor = React.useCallback((item) => item.id, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <FlatList
      key={listKey}
      data={reports}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.reportsList}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <EmptyState
          hasActiveFilters={hasActiveFilters}
          onClearAllFilters={onClearAllFilters}
        />
      }
      contentContainerStyle={
        reports.length === 0 ? styles.emptyContainer : styles.listContainer
      }
      extraData={reports}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  reportsList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 0,
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 0,
  },
});

export default SearchResults;
