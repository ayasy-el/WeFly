import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { COLORS, SPACING } from '@/constants/theme';
import { CircleCheck as CheckCircle2, Ticket } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function BookingConfirmationScreen() {
  const router = useRouter();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    opacity.value = withSpring(1, { damping: 20, stiffness: 90 });
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handleViewBookings = () => {
    router.push('/bookings');
  };

  const handleBookAnother = () => {
    router.push('/');
  };

  return (
    <ScrollView 
      style={styles.scrollContainer} 
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.successIcon, animatedStyles]}>
          <CheckCircle2 size={80} color={COLORS.success.main} />
        </Animated.View>
        
        <Typography variant="h2" style={styles.title}>
          Booking Confirmed!
        </Typography>
        
        <Typography variant="body" color="secondary" style={styles.subtitle}>
          Your flight has been successfully booked. You will receive a confirmation email shortly.
        </Typography>
        
        <Card style={styles.confirmationCard}>
          <View style={styles.cardHeader}>
            <Ticket size={24} color={COLORS.primary.main} />
            <Typography variant="h3" style={styles.cardTitle}>
              Booking Details
            </Typography>
          </View>
          
          <View style={styles.infoRow}>
            <Typography variant="body" color="secondary">
              Booking Reference:
            </Typography>
            <Typography variant="body" weight="semibold">
              AB12CD34
            </Typography>
          </View>
          
          <View style={styles.infoRow}>
            <Typography variant="body" color="secondary">
              Flight:
            </Typography>
            <Typography variant="body" weight="semibold">
              GA204
            </Typography>
          </View>
          
          <View style={styles.infoRow}>
            <Typography variant="body" color="secondary">
              Route:
            </Typography>
            <Typography variant="body" weight="semibold">
              CGK → DPS
            </Typography>
          </View>
          
          <View style={styles.infoRow}>
            <Typography variant="body" color="secondary">
              Date:
            </Typography>
            <Typography variant="body" weight="semibold">
              Dec 20, 2025
            </Typography>
          </View>
          
          <View style={styles.infoRow}>
            <Typography variant="body" color="secondary">
              Passengers:
            </Typography>
            <Typography variant="body" weight="semibold">
              1
            </Typography>
          </View>
          
          <View style={styles.infoRow}>
            <Typography variant="body" color="secondary">
              Status:
            </Typography>
            <View style={styles.statusBadge}>
              <Typography variant="caption" color="inverse" style={styles.statusText}>
                CONFIRMED
              </Typography>
            </View>
          </View>
        </Card>
        
        <View style={styles.nextStepsCard}>
          <Typography variant="h3" style={styles.nextStepsTitle}>
            Next Steps
          </Typography>
          
          <Typography variant="body" style={styles.stepItem}>
            • Check your email for a detailed itinerary
          </Typography>
          
          <Typography variant="body" style={styles.stepItem}>
            • Online check-in opens 24 hours before departure
          </Typography>
          
          <Typography variant="body" style={styles.stepItem}>
            • Arrive at the airport at least 2 hours before departure
          </Typography>
          
          <Typography variant="body" style={styles.stepItem}>
            • Have your ID and booking reference ready
          </Typography>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="View My Bookings"
            variant="primary"
            size="large"
            fullWidth
            style={styles.viewButton}
            onPress={handleViewBookings}
          />
          
          <Button
            title="Book Another Flight"
            variant="outline"
            size="large"
            fullWidth
            style={styles.bookButton}
            onPress={handleBookAnother}
          />
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
    padding: SPACING.m,
    paddingBottom: SPACING.xxl,
  },
  container: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    alignSelf: 'center',
    alignItems: 'center',
  },
  successIcon: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.l,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.m,
  },
  confirmationCard: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  cardTitle: {
    marginLeft: SPACING.s,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  statusBadge: {
    backgroundColor: COLORS.success.main,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
  },
  nextStepsCard: {
    width: '100%',
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.l,
  },
  nextStepsTitle: {
    marginBottom: SPACING.m,
  },
  stepItem: {
    marginBottom: SPACING.s,
  },
  buttonContainer: {
    width: '100%',
  },
  viewButton: {
    marginBottom: SPACING.m,
  },
  bookButton: {},
});