import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useLocalSearchParams, router, Stack, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPhaseById } from '../../src/db/phases';
import { getExpensesByPhase, deleteProjectExpense } from '../../src/db/projectExpenses';
import { ProgressBar } from '../../src/components/ProgressBar';
import { EmptyState } from '../../src/components/EmptyState';
import { useI18n } from '../../src/i18n';
import type { Phase, PhaseStatus, ProjectExpense } from '../../src/types';

const STATUS_COLOR: Record<PhaseStatus, string> = {
  awaiting: '#8E8E93',
  active: '#007AFF',
  done: '#34C759',
};

const ACCENT = '#007AFF';

export default function PhaseDetailScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const phaseId = Number(id);

  const [phase, setPhase] = useState<Phase | null>(null);
  const [expenses, setExpenses] = useState<ProjectExpense[]>([]);

  const loadAll = useCallback(async () => {
    const [ph, exps] = await Promise.all([
      getPhaseById(phaseId),
      getExpensesByPhase(phaseId),
    ]);
    setPhase(ph);
    setExpenses(exps);
  }, [phaseId]);

  useFocusEffect(useCallback(() => { loadAll(); }, [loadAll]));

  const handleDeleteExpense = (expense: ProjectExpense) => {
    Alert.alert(t('deleteExpense'), t('deleteExpenseMsg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteProjectExpense(expense.id);
          await loadAll();
        },
      },
    ]);
  };

  const spent = phase?.total_spent ?? 0;
  const budget = phase?.budget;
  const progress = budget ? spent / budget : 0;
  const overBudget = budget != null && spent > budget;

  const formatCurrency = (v: number) =>
    v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      <View style={styles.screen}>
        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
          <View style={styles.headerNav}>
            <TouchableOpacity
              style={styles.headerBackBtn}
              onPress={() => router.back()}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={17} color="#3C3C43" />
              <Text style={styles.headerBackLabel}>Project</Text>
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle} numberOfLines={1}>{phase?.name ?? '…'}</Text>
              {phase && (() => {
                const s: PhaseStatus = phase.status ?? 'awaiting';
                const color = STATUS_COLOR[s];
                return (
                  <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.statusText, { color }]}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
                  </View>
                );
              })()}
            </View>
            <TouchableOpacity
              style={styles.headerEditBtn}
              onPress={() => router.push(`/phase/${phaseId}`)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil" size={16} color="#3C3C43" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Stats card */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{t('spent')}</Text>
              <Text style={styles.statValue}>{formatCurrency(spent)}</Text>
            </View>
            {budget != null ? (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>{t('budget')}</Text>
                <Text style={styles.statValue}>{formatCurrency(budget)}</Text>
              </View>
            ) : null}
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{t('expenses')}</Text>
              <Text style={styles.statValue}>{phase?.expense_count ?? 0}</Text>
            </View>
          </View>
          {budget != null && (
            <View style={styles.progressWrapper}>
              <ProgressBar progress={progress} color={ACCENT} height={8} />
              {overBudget && (
                <Text style={styles.overBudgetText}>{t('overBudget')}</Text>
              )}
            </View>
          )}
        </View>

        {/* Expenses section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('expenses')}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              router.push(
                `/project-expense/new?phaseId=${phaseId}&projectId=${phase?.project_id}`
              )
            }
          >
            <Ionicons name="add" size={18} color={ACCENT} />
            <Text style={styles.addBtnText}>{t('newExpense')}</Text>
          </TouchableOpacity>
        </View>

        {expenses.length === 0 ? (
          <EmptyState
            message={t('noExpenses')}
            submessage={t('addFirstExpense')}
            icon="🧾"
          />
        ) : (
          <View style={styles.expensesList}>
            {expenses.map((expense) => (
              <TouchableOpacity
                key={expense.id}
                style={styles.expenseRow}
                onPress={() =>
                  router.push(
                    `/project-expense/${expense.id}?phaseId=${phaseId}&projectId=${expense.project_id}`
                  )
                }
              >
                <View
                  style={[
                    styles.catBadge,
                    { backgroundColor: (expense.category_color ?? '#8E8E93') + '20' },
                  ]}
                >
                  <Text style={styles.catIcon}>{expense.category_icon ?? '💰'}</Text>
                </View>
                <View style={styles.expenseInfo}>
                  <Text style={styles.catName}>
                    {expense.category_name ?? t('noCategory')}
                  </Text>
                  {expense.note ? (
                    <Text style={styles.expenseNote} numberOfLines={1}>
                      {expense.note}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.expenseRight}>
                  <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteRowBtn}
                  onPress={() => handleDeleteExpense(expense)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 36,
    paddingHorizontal: 12,
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  headerBackLabel: { fontSize: 15, color: '#3C3C43', fontWeight: '500' },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
    gap: 3,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  statusBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  statusText: { fontSize: 11, fontWeight: '600' },
  headerEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  statItem: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: '#8E8E93', marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '700', color: '#000000' },
  progressWrapper: { marginTop: 4 },
  overBudgetText: { marginTop: 6, fontSize: 12, fontWeight: '600', color: '#FF3B30', textAlign: 'right' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#000000' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF1A',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 4,
  },
  addBtnText: { fontSize: 14, color: '#007AFF', fontWeight: '600' },

  expensesList: { backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden' },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    gap: 10,
  },
  catBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIcon: { fontSize: 20 },
  expenseInfo: { flex: 1 },
  catName: { fontSize: 15, fontWeight: '500', color: '#000000' },
  expenseNote: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  expenseRight: { alignItems: 'flex-end', marginRight: 4 },
  expenseAmount: { fontSize: 16, fontWeight: '700', color: '#FF3B30' },
  expenseDate: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  deleteRowBtn: {
    padding: 4,
  },
});
