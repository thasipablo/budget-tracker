import { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { SummaryCard } from '../../src/components/SummaryCard';
import { TransactionItem } from '../../src/components/TransactionItem';
import { EmptyState } from '../../src/components/EmptyState';
import { useSummary } from '../../src/hooks/useSummary';
import { useTransactions } from '../../src/hooks/useTransactions';
import { useI18n } from '../../src/i18n';

export default function DashboardScreen() {
  const { t } = useI18n();
  const { summary, load: loadSummary } = useSummary();
  const { transactions, load: loadTransactions } = useTransactions();

  useFocusEffect(
    useCallback(() => {
      loadSummary();
      loadTransactions({ limit: 5 });
    }, [loadSummary, loadTransactions])
  );

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <SummaryCard summary={summary} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('recentTransactions')}</Text>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.push('/transactions')}
          >
            <Text style={styles.seeAll}>{t('seeAll')}</Text>
            <Ionicons name="chevron-forward" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {transactions.length === 0 ? (
          <EmptyState
            message={t('noTransactionsYet')}
            submessage={t('addFirst')}
            icon="💸"
          />
        ) : (
          <View style={styles.listCard}>
            {transactions.map((tx, i) => (
              <TransactionItem
                key={tx.id}
                item={tx}
                isLast={i === transactions.length - 1}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/transaction/new')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { fontSize: 15, color: '#007AFF', fontWeight: '400' },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
