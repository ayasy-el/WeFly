import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, BORDER_RADIUS, SHADOWS, SPACING } from '@/constants/theme';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export function Card({
  children,
  style,
  onPress,
  elevation = 'small',
  padding = 'medium',
}: CardProps) {
  const cardStyles = [
    styles.card,
    elevation !== 'none' && SHADOWS[elevation],
    padding !== 'none' && styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyles} onPress={onPress} activeOpacity={0.8}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.m,
    overflow: 'hidden',
  },
  paddingSmall: {
    padding: SPACING.s,
  },
  paddingMedium: {
    padding: SPACING.m,
  },
  paddingLarge: {
    padding: SPACING.l,
  },
});