import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Typography } from './Typography';
import { Button } from './Button';
import { COLORS, SPACING } from '@/constants/theme';

interface ErrorViewProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorView({ 
  title = 'Something went wrong',
  message = 'An error occurred while fetching data. Please try again.',
  onRetry,
  fullScreen = false,
}: ErrorViewProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <AlertTriangle size={48} color={COLORS.error.main} />
      <Typography
        variant="h3"
        style={styles.title}
      >
        {title}
      </Typography>
      <Typography
        variant="body"
        color="secondary"
        style={styles.message}
      >
        {message}
      </Typography>
      {onRetry && (
        <Button
          title="Try Again"
          variant="primary"
          onPress={onRetry}
          style={styles.button}
        />
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
  title: {
    marginTop: SPACING.l,
    textAlign: 'center',
  },
  message: {
    marginTop: SPACING.m,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  button: {
    minWidth: 150,
  },
});