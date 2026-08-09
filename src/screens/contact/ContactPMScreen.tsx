import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Header from '../../components/Header';
import { useAppStore } from '../../store/useAppStore';

export default function ContactPMScreen() {
  const currentReport = useAppStore((state) => state.currentReport);

  const pmName = 'Ali Saleh';
  const pmPhone = '214-994-9874';
  const pmEmail = 'ali@alphaenvironmental.com';

  const handleCall = () => {
    Linking.openURL(`tel:${pmPhone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${pmEmail}?subject=Question regarding Project ${currentReport.poNumber || currentReport.id}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Contact PM" subtitle="Direct line to Project Manager" />

      <View style={styles.content}>
        <View style={styles.pmCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>AS</Text>
          </View>

          <Text style={typography.h2}>{pmName}</Text>
          <Text style={typography.subhead}>Project Manager • Alpha Environmental</Text>
          <Text style={styles.phoneText}>📞 {pmPhone}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCall}>
              <Ionicons name="call" size={20} color={colors.white} />
              <Text style={styles.actionBtnText}>Call PM</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, styles.emailBtn]} onPress={handleEmail}>
              <Ionicons name="mail" size={20} color={colors.white} />
              <Text style={styles.actionBtnText}>Email PM</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 20,
    justifyContent: 'center',
  },
  pmCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  phoneText: {
    ...typography.bodyBold,
    color: colors.primary,
    marginTop: 8,
    marginBottom: 24,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.48,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emailBtn: {
    backgroundColor: colors.secondary,
  },
  actionBtnText: {
    ...typography.button,
    marginLeft: 6,
  },
});
