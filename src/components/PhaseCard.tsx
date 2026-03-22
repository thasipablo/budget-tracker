import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../i18n';
import { ProgressBar } from './ProgressBar';
import type { Phase, PhaseStatus } from '../types';

const STATUS_COLOR: Record<PhaseStatus, string> = {
  awaiting: '#8E8E93',
  active: '#007AFF',
  done: '#34C759',
};

interface Props {
  phase: Phase;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function PhaseCard({ phase, isFirst, isLast, onPress, onMoveUp, onMoveDown }: Props) {
  const { t } = useI18n();
  const spent = phase.total_spent ?? 0;
  const budget = phase.budget;
  const progress = budget && budget > 0 ? spent / budget : 0;
  const isOverBudget = budget != null && spent > budget;
  const phaseStatus = phase.status ?? 'awaiting';
  const statusColor = STATUS_COLOR[phaseStatus];

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.body} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.top}>
          <Text style={styles.name} numberOfLines={1}>{phase.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {t(phaseStatus as any)}
            </Text>
          </View>
          {isOverBudget && (
            <Text style={styles.over}>{t('overBudget' as any)}</Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.stat}>
            <Text style={styles.statValue}>${spent.toFixed(2)}</Text>
            {' '}{t('spent' as any)}
          </Text>
          {budget != null && (
            <Text style={styles.stat}>
              {'/ $'}{budget.toFixed(2)} {t('budget' as any)}
            </Text>
          )}
          <Text style={styles.stat}>
            {'· '}{phase.expense_count ?? 0} {t('items')}
          </Text>
        </View>

        {budget != null && (
          <View style={styles.progressWrap}>
            <ProgressBar progress={progress} color='#007AFF' height={4} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={onMoveUp}
          disabled={isFirst}
          style={[styles.arrowBtn, isFirst && styles.arrowDisabled]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="chevron-up" size={16} color={isFirst ? '#C7C7CC' : '#007AFF'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onMoveDown}
          disabled={isLast}
          style={[styles.arrowBtn, isLast && styles.arrowDisabled]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons name="chevron-down" size={16} color={isLast ? '#C7C7CC' : '#007AFF'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  body: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: { flex: 1, fontSize: 15, fontWeight: '600', color: '#000000' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, marginLeft: 6 },
  statusText: { fontSize: 11, fontWeight: '600' },
  over: { fontSize: 11, fontWeight: '600', color: '#FF3B30', marginLeft: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  stat: { fontSize: 12, color: '#8E8E93' },
  statValue: { fontWeight: '600', color: '#3A3A3C' },
  progressWrap: { marginTop: 2 },
  actions: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#F2F2F7',
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowDisabled: { backgroundColor: '#FAFAFA' },
});
