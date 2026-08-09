import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function FormInput({ label, error, style, ...props }: FormInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.subhead,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputContainer: {
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: 4,
  },
});
