import React from 'react';
import { 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  View, 
  TouchableOpacityProps, 
  ViewStyle 
} from 'react-native';
import { Typography } from './Typography';
import { COLORS, BORDER_RADIUS, SPACING } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  ...props
}: ButtonProps) {
  const buttonStyle = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    style,
  ];

  const textColor = variant === 'outline' || variant === 'ghost'
    ? 'primary'
    : 'inverse';

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' || variant === 'ghost' 
            ? COLORS.primary.main 
            : COLORS.text.inverse} 
          size="small" 
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Typography 
            variant="button" 
            color={textColor}
            style={props.disabled ? styles.disabledText : undefined}
          >
            {title}
          </Typography>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: SPACING.s,
  },
  iconRight: {
    marginLeft: SPACING.s,
  },
  primary: {
    backgroundColor: COLORS.primary.main,
  },
  secondary: {
    backgroundColor: COLORS.secondary.main,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary.main,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.m,
  },
  medium: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
  },
  large: {
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
  },
  fullWidth: {
    width: '100%',
  },
  disabledText: {
    opacity: 0.6,
  },
});