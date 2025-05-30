import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FlightSearchForm } from '@/components/flights/FlightSearchForm';
import { Typography } from '@/components/ui/Typography';
import { COLORS, SPACING } from '@/constants/theme';
import { FlightSearchQuery } from '@/types';

export default function FlightsScreen() {
  const router = useRouter();

  const handleSearch = async (searchParams: FlightSearchQuery) => {
    // Navigate to search results with params
    router.push({
      pathname: '/search-results',
      params: searchParams
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h2" style={styles.title}>
          Find Your Perfect Flight
        </Typography>
        
        <Typography variant="body" color="secondary" style={styles.subtitle}>
          Search through thousands of flights to find the best deals
        </Typography>
        
        <FlightSearchForm onSearch={handleSearch} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
    padding: SPACING.m,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});