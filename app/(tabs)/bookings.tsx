import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BookingCard } from '@/components/bookings/BookingCard';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ErrorView } from '@/components/ui/ErrorView';
import { Typography } from '@/components/ui/Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { BookingSummary } from '@/types';
import { mockGetBookings } from '@/api';
import { useApp } from '@/context/AppContext';

export default function BookingsScreen() {
  const router = useRouter();
  const { user, setBookings, bookings: contextBookings } = useApp();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    setError(null);

    try {
      if (user) {
        const bookingsData = await mockGetBookings(user.id);
        setBookings(bookingsData);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings(true);
  };

  const handleViewBooking = (bookingId: string) => {
    router.push(`/booking-details/${bookingId}`);
  };

  if (loading) {
    return <LoadingIndicator fullScreen message="Loading your bookings..." />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={fetchBookings} fullScreen />;
  }

  const renderContent = () => (
    <View style={styles.container}>
      {contextBookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Typography variant="h3">No Bookings Found</Typography>
          <Typography variant="body" color="secondary" style={styles.emptyStateText}>
            You haven't made any flight bookings yet.
          </Typography>
        </View>
      ) : (
        <>
          <Typography variant="h3" style={styles.sectionTitle}>
            Your Bookings
          </Typography>
          
          {Platform.OS === 'web' ? (
            <View style={styles.bookingsList}>
              {contextBookings.map(booking => (
                <BookingCard
                  key={booking.booking_id}
                  booking={booking}
                  onPress={() => handleViewBooking(booking.booking_id)}
                />
              ))}
            </View>
          ) : (
            <FlatList
              data={contextBookings}
              renderItem={({ item }) => (
                <BookingCard
                  booking={item}
                  onPress={() => handleViewBooking(item.booking_id)}
                />
              )}
              keyExtractor={(item) => item.booking_id}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={[COLORS.primary.main]}
                  tintColor={COLORS.primary.main}
                />
              }
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLORS.primary.main]}
          tintColor={COLORS.primary.main}
        />
      }
    >
      {renderContent()}
    </ScrollView>
  ) : (
    renderContent()
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.m,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    alignSelf: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.m,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
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
  bookingsList: {
    marginTop: SPACING.m,
  },
});