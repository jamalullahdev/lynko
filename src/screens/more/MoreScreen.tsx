import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Header from '../../components/Header';
import { useAppStore } from '../../store/useAppStore';

export default function MoreScreen() {
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);

  const handleAction = (title: string) => {
    Alert.alert(title, `${title} settings and preferences.`);
  };

  return (
    <View style={styles.container}>
      <Header title="More" subtitle="Account Settings & Preferences" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'AS'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={typography.h3}>{user?.name || 'Ali Saleh'}</Text>
            <Text style={typography.caption}>{user?.email || 'ali@alphaenvironmental.com'}</Text>
            <Text style={[typography.caption, { color: colors.primary, marginTop: 2, fontWeight: '700' }]}>
              {user?.role || 'Inspector Admin'}
            </Text>
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuRow} onPress={() => handleAction('Saved CoC Templates')}>
            <Ionicons name="document-attach-outline" size={22} color={colors.primary} />
            <Text style={styles.menuText}>Saved CoC Templates</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => handleAction('Laboratory Settings')}>
            <Ionicons name="business-outline" size={22} color={colors.primary} />
            <Text style={styles.menuText}>Laboratory Contacts & Defaults</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => handleAction('Inspector Digital Signature')}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
            <Text style={styles.menuText}>Inspector Default Signature</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => handleAction('Terms & Compliance')}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
            <Text style={styles.menuText}>Terms of Service & Compliance</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuRow} onPress={() => handleAction('Help & Support')}>
            <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
  },
  menuSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    ...typography.bodyBold,
    flex: 1,
    marginLeft: 12,
    color: colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutBtnText: {
    ...typography.button,
    color: colors.danger,
    marginLeft: 8,
  },
});
