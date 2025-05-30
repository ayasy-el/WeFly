import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { Flight } from '@/types';
import { Plane, Clock } from 'lucide-react-native';
import { format, parseISO, differenceInMinutes } from 'date-fns';

interface FlightCardProps {
  flight: Flight;
  onSelect: () => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const {
    airline_name,
    flight_code,
    origin_city,
    destination_city,
    departure_datetime,
    arrival_datetime,
    price,
    available_seats,
  } = flight;

  const departureDate = parseISO(departure_datetime);
  const arrivalDate = parseISO(arrival_datetime);
  const flightDuration = differenceInMinutes(arrivalDate, departureDate);
  
  const hours = Math.floor(flightDuration / 60);
  const minutes = flightDuration % 60;
  
  const formatTime = (date: Date) => format(date, 'HH:mm');
  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <Card style={styles.card} onPress={onSelect}>
      <View style={styles.header}>
        <View style={styles.airlineContainer}>
          <Plane size={20} color={COLORS.primary.main} />
          <Typography variant="subtitle" style={styles.airlineName}>
            {airline_name}
          </Typography>
        </View>
        <Typography variant="caption" color="secondary">
          {flight_code}
        </Typography>
      </View>
      
      <View style={styles.flightInfo}>
        <View style={styles.timeColumn}>
          <Typography variant="h2" weight="bold">
            {formatTime(departureDate)}
          </Typography>
          <Typography variant="caption" color="secondary">
            {origin_city}
          </Typography>
        </View>
        
        <View style={styles.durationColumn}>
          <View style={styles.durationLine}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>
          <View style={styles.durationInfo}>
            <Clock size={16} color={COLORS.text.secondary} style={styles.clockIcon} />
            <Typography variant="caption" color="secondary">
              {hours}h {minutes > 0 ? `${minutes}m` : ''}
            </Typography>
          </View>
        </View>
        
        <View style={styles.timeColumn}>
          <Typography variant="h2" weight="bold">
            {formatTime(arrivalDate)}
          </Typography>
          <Typography variant="caption" color="secondary">
            {destination_city}
          </Typography>
        </View>
      </View>
      
      <View style={styles.footer}>
        <View>
          <Typography variant="h3" color="primary" weight="bold">
            {formatPrice(price)}
          </Typography>
          <Typography variant="caption" color="secondary">
            {available_seats} seats left
          </Typography>
        </View>
        
        <Button 
          title="Select" 
          variant="primary" 
          size="medium"
          onPress={onSelect}
        />
      </View>
      
      {available_seats <= 5 && (
        <View style={styles.lowSeatsBadge}>
          <Typography variant="caption" color="inverse" style={styles.lowSeatsText}>
            Almost Full
          </Typography>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  airlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  airlineName: {
    marginLeft: SPACING.s,
  },
  flightInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  timeColumn: {
    alignItems: 'center',
  },
  durationColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
  },
  durationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary.main,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary.light,
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: SPACING.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
  lowSeatsBadge: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    backgroundColor: COLORS.error.main,
    borderRadius: BORDER_RADIUS.s,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
  },
  lowSeatsText: {
    fontSize: 12,
  },
});