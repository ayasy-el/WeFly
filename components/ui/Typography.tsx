import React from 'react';
import { Text as RNText, StyleSheet, TextProps, TextStyle } from 'react-native';
import { COLORS } from '@/constants/theme';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'subtitle' | 'body' | 'caption' | 'button' | 'label';
  color?: keyof typeof COLORS.text;
  weight?: 'regular' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
}

export function Typography({
  children,
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  align = 'left',
  style,
  ...props
}: TypographyProps) {
  const textStyles = [
    styles[variant],
    styles[`weight${weight.charAt(0).toUpperCase() + weight.slice(1)}`],
    { color: COLORS.text[color], textAlign: align },
    style,
  ];

  return (
    <RNText style={textStyles} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: 'Poppins-Bold',
  },
  h2: {
    fontSize: 24,
    lineHeight: 29,
    fontFamily: 'Poppins-Bold',
  },
  h3: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Poppins-SemiBold',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  weightRegular: {
    fontFamily: 'Poppins-Regular',
  },
  weightSemibold: {
    fontFamily: 'Poppins-SemiBold',
  },
  weightBold: {
    fontFamily: 'Poppins-Bold',
  },
});