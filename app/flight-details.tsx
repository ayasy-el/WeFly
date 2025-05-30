import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingIndicator } from '@/components/ui/LoadingIndicator';
import { COLORS, SPACING } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { format, parseISO } from 'date-fns';
import { Plane, Calendar, Clock, CreditCard, Users, ChevronLeft } from 'lucide-react-native';
import { mockCreateBooking } from '@/api';
import { PassengerDetail } from '@/types';

export default function FlightDetailsScreen() {
  const router = useRouter();
  const { selectedFlight, user } = useApp();
  const [numPassengers, setNumPassengers] = useState(1);
  const [passengers, setPassengers] = useState<PassengerDetail[]>([{ name: user?.name || '', seat_preference: 'Window' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no flight is selected
  if (!selectedFlight) {
    router.replace('/');
    return null;
  }

  const {
    flight_code,
    airline_name,
    origin_city,
    destination_city,
    departure_datetime,
    arrival_datetime,
    price,
    available_seats,
  } = selectedFlight;

  const departureDate = parseISO(departure_datetime);
  const arrivalDate = parseISO(arrival_datetime);
  
  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0 
    }).format(amount);

  const updatePassengerCount = (count: number) => {
    if (count < 1 || count > available_seats) return;
    
    const updatedPassengers = [...passengers];
    
    // If increasing, add empty passengers
    if (count > passengers.length) {
      for (let i = passengers.length; i < count; i++) {
        updatedPassengers.push({ name: '', seat_preference: 'Window' });
      }
    } else if (count < passengers.length) {
      // If decreasing, remove excess passengers
      updatedPassengers.splice(count);
    }
    
    setNumPassengers(count);
    setPassengers(updatedPassengers);
  };

  const updatePassenger = (index: number, field: keyof PassengerDetail, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const handleBooking = async () => {
    if (!user) return;
    
    // Validate all passengers have names
    const isValid = passengers.every(p => p.name.trim().length > 0);
    if (!isValid) {
      setError('Please provide names for all passengers');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await mockCreateBooking({
        flight_code,
        user_id: user.id,
        num_tickets: numPassengers,
        passenger_details: passengers,
      });
      
      router.push('/booking-confirmation');
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
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
            title="Back to Flights"
            variant="ghost"
            icon={<ChevronLeft size={20} color={COLORS.primary.main} />}
            onPress={() => router.back()}
          />
        </View>

        <Typography variant="h2" style={styles.title}>Flight Details</Typography>
        
        <Card style={styles.flightCard}>
          <View style={styles.airlineHeader}>
            <View style={styles.airlineInfo}>
              <Plane size={24} color={COLORS.primary.main} />
              <Typography variant="h3" style={styles.airlineName}>
                {airline_name}
              </Typography>
            </View>
            <Typography variant="subtitle">{flight_code}</Typography>
          </View>
          
          <View style={styles.route}>
            <View style={styles.cityInfo}>
              <Typography variant="h2">{origin_city}</Typography>
              <Typography variant="body" color="secondary">
                {format(departureDate, 'HH:mm')}
              </Typography>
            </View>
            
            <View style={styles.flightPathContainer}>
              <View style={styles.flightPath} />
              <Plane size={20} color={COLORS.primary.main} style={styles.flightIcon} />
            </View>
            
            <View style={styles.cityInfo}>
              <Typography variant="h2">{destination_city}</Typography>
              <Typography variant="body" color="secondary">
                {format(arrivalDate, 'HH:mm')}
              </Typography>
            </View>
          </View>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Calendar size={18} color={COLORS.primary.main} />
              <Typography variant="caption" style={styles.detailLabel}>Date</Typography>
              <Typography variant="body">{format(departureDate, 'MMM d, yyyy')}</Typography>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={18} color={COLORS.primary.main} />
              <Typography variant="caption" style={styles.detailLabel}>Duration</Typography>
              <Typography variant="body">2h 50m</Typography>
            </View>
            
            <View style={styles.detailItem}>
              <Users size={18} color={COLORS.primary.main} />
              <Typography variant="caption" style={styles.detailLabel}>Available</Typography>
              <Typography variant="body">{available_seats} seats</Typography>
            </View>
            
            <View style={styles.detailItem}>
              <CreditCard size={18} color={COLORS.primary.main} />
              <Typography variant="caption" style={styles.detailLabel}>Price</Typography>
              <Typography variant="body" weight="semibold">{formatPrice(price)}</Typography>
            </View>
          </View>
        </Card>
        
        <Card style={styles.bookingCard}>
          <Typography variant="h3" style={styles.sectionTitle}>Booking Information</Typography>
          
          <View style={styles.passengerCountContainer}>
            <Typography variant="body">Number of Passengers</Typography>
            <View style={styles.counterContainer}>
              <Button
                title="-"
                variant="outline"
                size="small"
                onPress={() => updatePassengerCount(numPassengers - 1)}
                style={styles.counterButton}
                disabled={numPassengers <= 1}
              />
              <Typography variant="h3" style={styles.passengerCount}>
                {numPassengers}
              </Typography>
              <Button
                title="+"
                variant="outline"
                size="small"
                onPress={() => updatePassengerCount(numPassengers + 1)}
                style={styles.counterButton}
                disabled={numPassengers >= available_seats}
              />
            </View>
          </View>
          
          <Typography variant="subtitle" style={styles.passengerTitle}>
            Passenger Details
          </Typography>
          
          {passengers.map((passenger, index) => (
            <View key={index} style={styles.passengerForm}>
              <Typography variant="body" style={styles.passengerNumber}>
                Passenger {index + 1}
              </Typography>
              
              <Input
                label="Full Name"
                placeholder="Enter passenger name"
                value={passenger.name}
                onChangeText={(text) => updatePassenger(index, 'name', text)}
                containerStyle={styles.input}
              />
              
              <View style={styles.seatPreferenceContainer}>
                <Typography variant="body" style={styles.seatPreferenceLabel}>
                  Seat Preference
                </Typography>
                
                <View style={styles.seatOptions}>
                  {['Window', 'Middle', 'Aisle'].map((seat) => (
                    <Button
                      key={seat}
                      title={seat}
                      variant={passenger.seat_preference === seat ? 'primary' : 'outline'}
                      size="small"
                      onPress={() => updatePassenger(index, 'seat_preference', seat)}
                      style={styles.seatButton}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
          
          {error && (
            <Typography variant="body" color="error" style={styles.errorText}>
              {error}
            </Typography>
          )}
          
          <View style={styles.totalContainer}>
            <Typography variant="body">Total Price</Typography>
            <Typography variant="h3" color="primary" weight="bold">
              {formatPrice(price * numPassengers)}
            </Typography>
          </View>
          
          <Button
            title={loading ? 'Processing...' : 'Confirm Booking'}
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            onPress={handleBooking}
          />
        </Card>
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
    marginBottom: SPACING.m,
  },
  title: {
    marginBottom: SPACING.l,
  },
  flightCard: {
    marginBottom: SPACING.l,
  },
  airlineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineName: {
    marginLeft: SPACING.s,
  },
  route: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  cityInfo: {
    alignItems: 'center',
    flex: 1,
  },
  flightPathContainer: {
    flex: 2,
    position: 'relative',
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flightPath: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: COLORS.primary.light,
  },
  flightIcon: {
    transform: [{ rotate: '90deg' }],
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    paddingTop: SPACING.m,
  },
  detailItem: {
    width: '50%',
    marginBottom: SPACING.m,
  },
  detailLabel: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs / 2,
  },
  bookingCard: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    marginBottom: SPACING.m,
  },
  passengerCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerCount: {
    marginHorizontal: SPACING.m,
  },
  passengerTitle: {
    marginBottom: SPACING.m,
  },
  passengerForm: {
    marginBottom: SPACING.l,
    padding: SPACING.m,
    backgroundColor: COLORS.background.secondary,
    borderRadius: SPACING.s,
  },
  passengerNumber: {
    marginBottom: SPACING.m,
    fontFamily: 'Poppins-SemiBold',
  },
  input: {
    marginBottom: SPACING.m,
  },
  seatPreferenceContainer: {
    marginBottom: SPACING.s,
  },
  seatPreferenceLabel: {
    marginBottom: SPACING.s,
  },
  seatOptions: {
    flexDirection: 'row',
  },
  seatButton: {
    marginRight: SPACING.s,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  errorText: {
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
});