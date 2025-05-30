import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlightCard } from '@/components/flights/FlightCard';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ErrorView } from '@/components/ui/ErrorView';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/constants/theme';
import { Flight } from '@/types';
import { mockSearchFlights } from '@/api';
import { ChevronLeft } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

export default function SearchResultsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { setSelectedFlight } = useApp();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    searchFlights();
  }, []);

  const searchFlights = async () => {
    try {
      const results = await mockSearchFlights({
        origin_city: params.origin_city as string,
        destination_city: params.destination_city as string,
        departure_date: params.departure_date as string,
        num_passengers: Number(params.num_passengers),
      });
      setFlights(results);
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('Failed to search flights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    router.push('/flight-details');
  };

  if (loading) {
    return <LoadingIndicator fullScreen message="Searching for flights..." />;
  }

  if (error) {
    return (
      <ErrorView 
        message={error} 
        onRetry={searchFlights}
        fullScreen
      />
    );
  }

  const renderContent = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Back"
          variant="ghost"
          icon={<ChevronLeft size={20} color={COLORS.primary.main} />}
          onPress={() => router.back()}
        />
      </View>

      {flights.length === 0 ? (
        <View style={styles.emptyState}>
          <Typography variant="h3">No Flights Found</Typography>
          <Typography variant="body" color="secondary" style={styles.emptyStateText}>
            Try changing your search criteria or date.
          </Typography>
        </View>
      ) : (
        <>
          <Typography variant="h3" style={styles.resultsTitle}>
            Available Flights ({flights.length})
          </Typography>
          
          {Platform.OS === 'web' ? (
            <View style={styles.flightsList}>
              {flights.map((flight) => (
                <FlightCard 
                  key={flight.id} 
                  flight={flight}
                  onSelect={() => handleSelectFlight(flight)}
                />
              ))}
            </View>
          ) : (
            <FlatList
              data={flights}
              renderItem={({ item }) => (
                <FlightCard
                  flight={item}
                  onSelect={() => handleSelectFlight(item)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      )}
    </View>
  );

  return Platform.OS === 'web' ? (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContent}
    >
      {renderContent()}
    </ScrollView>
  ) : (
    renderContent()
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: SPACING.m,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  resultsTitle: {
    marginBottom: SPACING.m,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
  flightsList: {
    marginTop: SPACING.m,
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