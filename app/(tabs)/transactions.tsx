import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TransactionItem } from '../../src/components/TransactionItem';
import { EmptyState } from '../../src/components/EmptyState';
import { useTransactions } from '../../src/hooks/useTransactions';
import { useI18n } from '../../src/i18n';
import type { TransactionType } from '../../src/types';

type Filter = 'all' | TransactionType;

export default function TransactionsScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const { transactions, load, remove } = useTransactions();

  const filters: { label: string; value: Filter }[] = [
    { label: t('all'), value: 'all' },
    { label: t('income'), value: 'income' },
    { label: t('expenses'), value: 'expense' },
  ];

  useFocusEffect(
    useCallback(() => {
      load(filter === 'all' ? {} : { type: filter });
    }, [load, filter])
  );

  const handleLongPress = (id: number) => {
    Alert.alert(t('deleteTransaction'), t('deleteTransactionMsg'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>{t('transactions')}</Text>
      </View>
      {/* iOS-style segmented control */}
      <View style={styles.segmentContainer}>
        <View style={styles.segment}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.segmentBtn, filter === f.value && styles.segmentBtnActive]}
              onPress={() => setFilter(f.value)}
            >
              <Text style={[styles.segmentText, filter === f.value && styles.segmentTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(tx) => tx.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <TransactionItem
            item={item}
            onLongPress={() => handleLongPress(item.id)}
            isLast={index === transactions.length - 1}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            message={filter === 'all' ? t('noTransactions') : t('noTransactionsFilter')}
            icon="💸"
          />
        }
        CellRendererComponent={undefined}
        ItemSeparatorComponent={null}
        ListHeaderComponent={transactions.length > 0 ? <View style={styles.listCardTop} /> : null}
        ListFooterComponent={transactions.length > 0 ? <View style={styles.listCardBottom} /> : null}
        style={styles.flatList}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  titleRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.37,
    marginBottom: 8,
  },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 999,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: { fontSize: 13, fontWeight: '500', color: '#8E8E93' },
  segmentTextActive: { color: '#000000', fontWeight: '600' },
  flatList: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  listCardTop: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 4,
  },
  listCardBottom: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: 4,
  },
});
