import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Typography } from './Typography';
import { COLORS, SPACING } from '@/constants/theme';

interface LoadingIndicatorProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingIndicator({ message = 'Loading...', fullScreen = false }: LoadingIndicatorProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={COLORS.primary.main} />
      {message && (
        <Typography
          variant="body"
          color="secondary"
          style={styles.message}
        >
          {message}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  message: {
    marginTop: SPACING.m,
    textAlign: 'center',
  },
});