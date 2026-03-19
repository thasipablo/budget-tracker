import { View, Text, StyleSheet } from 'react-native';
import type { Summary } from '../types';
import { useI18n } from '../i18n';

interface Props {
  summary: Summary;
}

export function SummaryCard({ summary }: Props) {
  const { t } = useI18n();
  return (
    <View style={styles.card}>
      <Text style={styles.balanceLabel}>{t('balance')}</Text>
      <Text style={styles.balanceAmount}>
        ${summary.balance.toFixed(2)}
      </Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <View style={styles.indicator}>
            <View style={[styles.dot, { backgroundColor: '#34C759' }]} />
            <Text style={styles.label}>{t('income')}</Text>
          </View>
          <Text style={[styles.amount, { color: '#34C759' }]}>
            +${summary.totalIncome.toFixed(2)}
          </Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.half}>
          <View style={styles.indicator}>
            <View style={[styles.dot, { backgroundColor: '#FF3B30' }]} />
            <Text style={styles.label}>{t('expenses')}</Text>
          </View>
          <Text style={[styles.amount, { color: '#FF3B30' }]}>
            -${summary.totalExpenses.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000000',
    marginTop: 4,
    marginBottom: 20,
    letterSpacing: -1,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  half: { flex: 1 },
  separator: {
    width: StyleSheet.hairlineWidth,
    height: 36,
    backgroundColor: '#C6C6C8',
    marginHorizontal: 16,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },
  amount: { fontSize: 22, fontWeight: '600', letterSpacing: -0.5 },
});
