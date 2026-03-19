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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SummaryCard } from '../../src/components/SummaryCard';
import { TransactionItem } from '../../src/components/TransactionItem';
import { EmptyState } from '../../src/components/EmptyState';
import { useSummary } from '../../src/hooks/useSummary';
import { useTransactions } from '../../src/hooks/useTransactions';
import { useI18n } from '../../src/i18n';

export default function DashboardScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { summary, load: loadSummary } = useSummary();
  const { transactions, load: loadTransactions } = useTransactions();

  useFocusEffect(
    useCallback(() => {
      loadSummary();
      loadTransactions({ limit: 5 });
    }, [loadSummary, loadTransactions])
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
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

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 20 },
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
});
