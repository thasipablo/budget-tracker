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
        <Text style={styles.pageTitle}>{t('dashboard')}</Text>
        <SummaryCard summary={summary} />

        <TouchableOpacity
          style={styles.chartsCard}
          onPress={() => router.push('/(tabs)/charts')}
          activeOpacity={0.75}
        >
          <View style={styles.chartsIcon}>
            <Ionicons name="pie-chart" size={24} color="#007AFF" />
          </View>
          <View style={styles.chartsText}>
            <Text style={styles.chartsTitle}>{t('charts')}</Text>
            <Text style={styles.chartsSub}>{t('expensesByCategory')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
        </TouchableOpacity>

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
  pageTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
    letterSpacing: 0.37,
  },
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
  chartsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  chartsIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#007AFF1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartsText: { flex: 1 },
  chartsTitle: { fontSize: 17, fontWeight: '600', color: '#000000' },
  chartsSub: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
});
