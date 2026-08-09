import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import FormInput from '../../components/FormInput';
import GradientButton from '../../components/GradientButton';
import Header from '../../components/Header';
import { useAppStore } from '../../store/useAppStore';

export default function TwoFactorAuthScreen({ navigation }: any) {
  const [otpCode, setOtpCode] = useState('123456');
  const verify2FA = useAppStore((state) => state.verify2FA);
  const pendingEmail = useAppStore((state) => state.pendingEmail);

  const handleVerify = () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter a valid 6-digit 2FA code.');
      return;
    }
    const success = verify2FA(otpCode);
    if (success) {
      Alert.alert('Success', '2FA verified successfully!');
    } else {
      Alert.alert('Verification Failed', 'Invalid OTP code.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="2-Factor Verification" onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="shield-checkmark-outline" size={48} color={colors.primary} />
        </View>

        <Text style={[typography.h2, { textAlign: 'center', marginBottom: 8 }]}>
          Enter 2FA Security Code
        </Text>
        <Text style={[typography.subhead, { textAlign: 'center', marginBottom: 24 }]}>
          A 6-digit authentication code was sent to {pendingEmail || 'your email'}.
        </Text>

        <FormInput
          label="Verification Code"
          placeholder="123456"
          value={otpCode}
          onChangeText={setOtpCode}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.otpInput}
        />

        <GradientButton title="Verify & Access Dashboard" onPress={handleVerify} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(3, 193, 182, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  otpInput: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 8,
    textAlign: 'center',
  },
});
