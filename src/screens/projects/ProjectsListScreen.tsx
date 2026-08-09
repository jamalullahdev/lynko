import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import Header from '../../components/Header';
import { useAppStore, ChainOfCustodyReport } from '../../store/useAppStore';

export default function ProjectsListScreen({ navigation }: any) {
  const reports = useAppStore((state) => state.reports);
  const deleteReport = useAppStore((state) => state.deleteReport);
  const [query, setQuery] = useState('');

  const filtered = reports.filter(
    (r) =>
      r.description.toLowerCase().includes(query.toLowerCase()) ||
      r.poNumber.toLowerCase().includes(query.toLowerCase()) ||
      r.address.toLowerCase().includes(query.toLowerCase())
  );

  const renderProject = ({ item }: { item: ChainOfCustodyReport }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.poText}>{item.poNumber || item.id}</Text>
        <TouchableOpacity onPress={() => deleteReport(item.id)}>
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>

      <Text style={typography.h3}>{item.description}</Text>
      <Text style={styles.subText}>📍 {item.address}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.samplesCount}>🧪 {item.samples.length} Samples</Text>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Projects" subtitle="Manage and search past projects" />

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search PO #, description, address..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderProject}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    ...typography.body,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  poText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  subText: {
    ...typography.subhead,
    color: colors.textSecondary,
    marginVertical: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  samplesCount: {
    ...typography.caption,
    fontWeight: '600',
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.success,
  },
});
