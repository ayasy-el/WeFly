import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { ErrorView } from '@/components/ui/ErrorView';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, Plane, Calendar, Clock, User, Ticket } from 'lucide-react-native';
import { BookingDetail } from '@/types';
import { mockGetBookingById, mockCreateBooking } from '@/api';

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    if (!id) {
      router.replace('/bookings');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingData = await mockGetBookingById(id);
      setBooking(bookingData);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to cancel this booking?')) {
        // Perform cancel operation
        router.replace('/bookings');
      }
    } else {
      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this booking? This action cannot be undone.',
        [
          { text: 'No', style: 'cancel' },
          { 
            text: 'Yes, Cancel', 
            style: 'destructive',
            onPress: () => {
              // Perform cancel operation
              router.replace('/bookings');
            }
          }
        ]
      );
    }
  };

  if (loading) {
    return <LoadingIndicator fullScreen message="Loading booking details..." />;
  }

  if (error || !booking) {
    return (
      <ErrorView 
        message={error || 'Booking not found'} 
        onRetry={fetchBooking}
        fullScreen 
      />
    );
  }

  const {
    booking_id,
    flight_details,
    status,
    total_price,
    num_tickets,
    passenger_details,
    booking_date,
    created_at,
  } = booking;

  const {
    flight_code,
    airline_name,
    origin_city,
    destination_city,
    departure_datetime,
    arrival_datetime,
  } = flight_details;

  const departureDate = parseISO(departure_datetime);
  const arrivalDate = parseISO(arrival_datetime);
  const bookingCreatedDate = parseISO(created_at);

  const formatTime = (date: Date) => format(date, 'HH:mm');
  const formatDate = (date: Date) => format(date, 'MMM d, yyyy');
  const formatDateTime = (date: Date) => format(date, 'MMM d, yyyy - HH:mm');

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'CONFIRMED':
        return COLORS.success.main;
      case 'PENDING_PAYMENT':
        return COLORS.warning.main;
      case 'CANCELLED':
        return COLORS.error.main;
      default:
        return COLORS.secondary.main;
    }
  };

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Button
            title="Back to Bookings"
            variant="ghost"
            icon={<ChevronLeft size={20} color={COLORS.primary.main} />}
            onPress={() => router.back()}
          />
        </View>

        <View style={styles.headerContent}>
          <Typography variant="h2" style={styles.title}>Booking Details</Typography>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: getStatusColor(status) }
          ]}>
            <Typography variant="caption" color="inverse" style={styles.statusText}>
              {status.replace('_', ' ')}
            </Typography>
          </View>
        </View>

        <Card style={styles.bookingInfoCard}>
          <View style={styles.bookingHeader}>
            <Typography variant="subtitle">Booking Reference</Typography>
            <Typography variant="h3">{booking_id.substring(0, 8).toUpperCase()}</Typography>
          </View>
          
          <View style={styles.infoRow}>
            <Ticket size={18} color={COLORS.text.secondary} />
            <Typography variant="body" color="secondary" style={styles.infoLabel}>
              Booked on:
            </Typography>
            <Typography variant="body">
              {formatDateTime(bookingCreatedDate)}
            </Typography>
          </View>
        </Card>

        <Card style={styles.flightCard}>
          <View style={styles.flightHeader}>
            <View style={styles.airlineInfo}>
              <Plane size={20} color={COLORS.primary.main} />
              <Typography variant="subtitle" style={styles.airlineName}>
                {airline_name}
              </Typography>
            </View>
            <Typography variant="body">{flight_code}</Typography>
          </View>
          
          <View style={styles.flightDetails}>
            <View style={styles.cityColumn}>
              <Typography variant="h3">{origin_city}</Typography>
              <Typography variant="body">{formatTime(departureDate)}</Typography>
            </View>
            
            <View style={styles.durationColumn}>
              <View style={styles.durationLine} />
              <Typography variant="caption" color="secondary">
                2h 50m
              </Typography>
            </View>
            
            <View style={styles.cityColumn}>
              <Typography variant="h3">{destination_city}</Typography>
              <Typography variant="body">{formatTime(arrivalDate)}</Typography>
            </View>
          </View>
          
          <View style={styles.flightInfo}>
            <View style={styles.infoItem}>
              <Calendar size={18} color={COLORS.primary.main} />
              <Typography variant="caption" style={styles.infoLabel}>Date</Typography>
              <Typography variant="body">{formatDate(departureDate)}</Typography>
            </View>
            
            <View style={styles.infoItem}>
              <Clock size={18} color={COLORS.primary.main} />
              <Typography variant="caption" style={styles.infoLabel}>Duration</Typography>
              <Typography variant="body">2h 50m</Typography>
            </View>
          </View>
        </Card>

        <Card style={styles.passengersCard}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Passenger Information
          </Typography>
          
          {passenger_details?.map((passenger, index) => (
            <View key={index} style={styles.passengerItem}>
              <User size={18} color={COLORS.primary.main} />
              <View style={styles.passengerInfo}>
                <Typography variant="body" weight="semibold">
                  {passenger.name}
                </Typography>
                <Typography variant="caption" color="secondary">
                  {passenger.seat_preference} seat
                </Typography>
              </View>
            </View>
          ))}
          
          <View style={styles.pricingInfo}>
            <View style={styles.priceRow}>
              <Typography variant="body" color="secondary">
                Flight price
              </Typography>
              <Typography variant="body">
                {formatPrice(flight_details.price)} × {num_tickets}
              </Typography>
            </View>
            
            <View style={styles.totalRow}>
              <Typography variant="subtitle">Total Amount</Typography>
              <Typography variant="h3" color="primary" weight="bold">
                {formatPrice(total_price)}
              </Typography>
            </View>
          </View>
        </Card>

        <View style={styles.actionButtons}>
          <Button
            title="Download E-ticket"
            variant="primary"
            size="large"
            fullWidth
            style={styles.downloadButton}
          />
          
          {status !== 'CANCELLED' && (
            <Button
              title="Cancel Booking"
              variant="outline"
              size="large"
              fullWidth
              onPress={handleCancel}
              style={styles.cancelButton}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  container: {
    padding: SPACING.m,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    marginBottom: SPACING.s,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  title: {
    flex: 1,
  },
  statusBadge: {
    borderRadius: BORDER_RADIUS.s,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
  },
  statusText: {
    fontSize: 12,
  },
  bookingInfoCard: {
    marginBottom: SPACING.m,
  },
  bookingHeader: {
    marginBottom: SPACING.m,
  },
  flightCard: {
    marginBottom: SPACING.m,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineName: {
    marginLeft: SPACING.s,
  },
  flightDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  cityColumn: {
    alignItems: 'center',
    flex: 1,
  },
  durationColumn: {
    flex: 2,
    alignItems: 'center',
    position: 'relative',
  },
  durationLine: {
    height: 1,
    width: '80%',
    backgroundColor: COLORS.primary.light,
    marginBottom: SPACING.s,
  },
  flightInfo: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    paddingTop: SPACING.m,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs / 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
  },
  passengersCard: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    marginBottom: SPACING.m,
  },
  passengerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  passengerInfo: {
    marginLeft: SPACING.m,
  },
  pricingInfo: {
    marginTop: SPACING.m,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    paddingTop: SPACING.m,
    marginTop: SPACING.s,
  },
  actionButtons: {
    marginTop: SPACING.m,
  },
  downloadButton: {
    marginBottom: SPACING.m,
  },
  cancelButton: {
    borderColor: COLORS.error.main,
  },
});