import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Header from '../../components/Header';
import { SAMPLE_MEDIA_TYPES, SampleMediaOption } from '../../store/useAppStore';

export default function SuppliesScreen() {
  const renderMediaItem = ({ item }: { item: SampleMediaOption }) => (
    <View style={styles.itemCard}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon as any} size={28} color={colors.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={typography.caption}>{item.category}</Text>
      </View>

      <TouchableOpacity style={styles.selectBadge}>
        <Text style={styles.selectBadgeText}>Sample Media</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Sample Media Catalog" subtitle="Cassettes, Slides & Sampling Supplies" />

      <FlatList
        data={SAMPLE_MEDIA_TYPES}
        keyExtractor={(item) => item.id}
        renderItem={renderMediaItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(3, 193, 182, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  selectBadge: {
    backgroundColor: 'rgba(3, 193, 182, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  selectBadgeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
});
