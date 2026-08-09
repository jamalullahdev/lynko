import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import FormInput from '../../components/FormInput';
import GradientButton from '../../components/GradientButton';
import { useAppStore } from '../../store/useAppStore';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('inspector@lynko.com');
  const [password, setPassword] = useState('password123');
  const login = useAppStore((state) => state.login);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter email and password.');
      return;
    }
    login(email);
    navigation.navigate('TwoFactorAuth');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
        <LinearGradient
          colors={[colors.secondary, colors.primaryDark, colors.primaryGradientStart]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.logoText}>lynko</Text>
            <Text style={styles.welcomeText}>Chain of Custody</Text>
            <Text style={styles.subtitle}>Field Inspection & Lab Reporting</Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={typography.h2}>Sign In</Text>
          <Text style={[typography.subhead, { marginBottom: 20 }]}>
            Enter your employee credentials to proceed
          </Text>

          <FormInput
            label="Email Address"
            placeholder="e.g. inspector@lynko.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <GradientButton title="Continue to 2FA Verification" onPress={handleLogin} style={styles.button} />

          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>Demo Logins:</Text>
            <Text style={styles.demoText}>• Admin Role: admin@lynko.com</Text>
            <Text style={styles.demoText}>• Inspector Role: inspector@lynko.com</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryGradientStart,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    padding: 24,
    marginTop: -20,
    backgroundColor: colors.card,
    borderRadius: 24,
    marginHorizontal: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  button: {
    marginTop: 10,
  },
  demoBox: {
    marginTop: 24,
    padding: 14,
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  demoText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
});
