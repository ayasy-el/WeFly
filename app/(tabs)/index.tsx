import React, { useState } from 'react';
import { View, StyleSheet, FlatList, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FlightSearchForm } from '@/components/flights/FlightSearchForm';
import { FlightCard } from '@/components/flights/FlightCard';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ErrorView } from '@/components/ui/ErrorView';
import { Typography } from '@/components/ui/Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { Flight, FlightSearchQuery } from '@/types';
import { mockSearchFlights } from '@/api';
import { useApp } from '@/context/AppContext';

export default function FlightsScreen() {
  const router = useRouter();
  const { setSelectedFlight } = useApp();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (searchParams: FlightSearchQuery) => {
    setLoading(true);
    setError(null);

    try {
      const results = await mockSearchFlights(searchParams);
      setFlights(results);
      setSearchPerformed(true);
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search flights. Please try again.');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    router.push('/flight-details');
  };

  const renderFlightItem = ({ item }: { item: Flight }) => (
    <FlightCard
      flight={item}
      onSelect={() => handleSelectFlight(item)}
    />
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.contentContainer}>
            <FlightSearchForm onSearch={handleSearch} loading={loading} />

            {loading ? (
              <LoadingIndicator message="Searching for flights..." />
            ) : error ? (
              <ErrorView 
                message={error} 
                onRetry={() => setError(null)}
              />
            ) : searchPerformed && flights.length === 0 ? (
              <View style={styles.emptyState}>
                <Typography variant="h3">No Flights Found</Typography>
                <Typography variant="body" color="secondary" style={styles.emptyStateText}>
                  Try changing your search criteria or date.
                </Typography>
              </View>
            ) : flights.length > 0 ? (
              <View style={styles.resultsContainer}>
                <Typography variant="h3" style={styles.resultsTitle}>
                  Available Flights ({flights.length})
                </Typography>
                
                {flights.map((flight) => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight}
                    onSelect={() => handleSelectFlight(flight)}
                  />
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>
      ) : (
        <>
          <FlightSearchForm onSearch={handleSearch} loading={loading} />

          {loading ? (
            <LoadingIndicator message="Searching for flights..." />
          ) : error ? (
            <ErrorView 
              message={error} 
              onRetry={() => setError(null)}
            />
          ) : searchPerformed && flights.length === 0 ? (
            <View style={styles.emptyState}>
              <Typography variant="h3">No Flights Found</Typography>
              <Typography variant="body" color="secondary" style={styles.emptyStateText}>
                Try changing your search criteria or date.
              </Typography>
            </View>
          ) : (
            <FlatList
              data={flights}
              renderItem={renderFlightItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              ListHeaderComponent={
                flights.length > 0 ? (
                  <Typography variant="h3\" style={styles.resultsTitle}>
                    Available Flights ({flights.length})
                  </Typography>
                ) : null
              }
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.m,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    alignSelf: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
  resultsContainer: {
    marginTop: SPACING.m,
  },
  resultsTitle: {
    marginBottom: SPACING.m,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl,
  },
  emptyStateText: {
    marginTop: SPACING.s,
    textAlign: 'center',
  },
});