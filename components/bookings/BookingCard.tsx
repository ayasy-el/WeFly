import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING, BORDER_RADIUS } from '@/constants/theme';
import { BookingSummary } from '@/types';
import { format, parseISO } from 'date-fns';
import { Plane, Calendar, CreditCard } from 'lucide-react-native';

interface BookingCardProps {
  booking: BookingSummary;
  onPress: () => void;
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const {
    flight_code,
    booking_date,
    total_price,
    status
  } = booking;

  const formattedDate = format(parseISO(booking_date), 'MMM d, yyyy');
  
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
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.flightInfo}>
          <Plane size={20} color={COLORS.primary.main} />
          <Typography variant="subtitle" style={styles.flightCode}>
            {flight_code}
          </Typography>
        </View>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(status) }
        ]}>
          <Typography variant="caption" color="inverse" style={styles.statusText}>
            {status.replace('_', ' ')}
          </Typography>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Calendar size={18} color={COLORS.text.secondary} style={styles.icon} />
          <Typography variant="body" color="secondary">
            {formattedDate}
          </Typography>
        </View>
        
        <View style={styles.infoRow}>
          <CreditCard size={18} color={COLORS.text.secondary} style={styles.icon} />
          <Typography variant="body" weight="semibold">
            {formatPrice(total_price)}
          </Typography>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="View Details" 
          variant="outline" 
          size="medium"
          onPress={onPress}
        />
      </View>
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
  flightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flightCode: {
    marginLeft: SPACING.s,
  },
  statusBadge: {
    borderRadius: BORDER_RADIUS.s,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
  },
  statusText: {
    fontSize: 12,
  },
  content: {
    marginBottom: SPACING.m,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  icon: {
    marginRight: SPACING.s,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
});