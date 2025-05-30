import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  TextInputProps, 
  ViewStyle 
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { Typography } from './Typography';
import { COLORS, BORDER_RADIUS, SPACING, FONTS } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  isPassword = false,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const renderPasswordIcon = () => {
    if (!isPassword) return null;
    
    return (
      <TouchableOpacity 
        onPress={() => setShowPassword(!showPassword)}
        style={styles.passwordIcon}
      >
        {showPassword ? (
          <Eye size={20} color={COLORS.text.secondary} />
        ) : (
          <EyeOff size={20} color={COLORS.text.secondary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography 
          variant="label" 
          color="secondary"
          style={styles.label}
        >
          {label}
        </Typography>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error && styles.error,
          props.editable === false && styles.disabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
          ]}
          placeholderTextColor={COLORS.text.tertiary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={!showPassword}
          {...props}
        />
        {renderPasswordIcon() || (rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>)}
      </View>
      {error && (
        <Typography 
          variant="caption" 
          color="error" 
          style={styles.errorText}
        >
          {error}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.medium,
    borderRadius: BORDER_RADIUS.m,
    backgroundColor: COLORS.background.primary,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: SPACING.m,
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.xs,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.xs,
  },
  leftIcon: {
    paddingLeft: SPACING.m,
  },
  rightIcon: {
    paddingRight: SPACING.m,
  },
  passwordIcon: {
    paddingRight: SPACING.m,
    padding: SPACING.xs,
  },
  focused: {
    borderColor: COLORS.primary.main,
  },
  error: {
    borderColor: COLORS.error.main,
  },
  errorText: {
    marginTop: SPACING.xs,
  },
  disabled: {
    backgroundColor: COLORS.background.tertiary,
    borderColor: COLORS.border.light,
  },
});