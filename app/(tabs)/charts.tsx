import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { startOfMonth, subMonths, endOfMonth, format, startOfYear } from 'date-fns';
import { getExpensesByCategory, getMonthlyTotals } from '../../src/db/transactions';
import { useI18n } from '../../src/i18n';

type Period = 'month' | '3months' | 'year';

function getPeriodDates(period: Period): { start: string; end: string } {
  const now = new Date();
  if (period === 'month') {
    return {
      start: format(startOfMonth(now), 'yyyy-MM-dd'),
      end: format(endOfMonth(now), 'yyyy-MM-dd'),
    };
  }
  if (period === '3months') {
    return {
      start: format(startOfMonth(subMonths(now, 2)), 'yyyy-MM-dd'),
      end: format(endOfMonth(now), 'yyyy-MM-dd'),
    };
  }
  return {
    start: format(startOfYear(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
}

export default function ChartsScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('month');
  const [pieData, setPieData] = useState<
    { value: number; color: string; text: string; label: string }[]
  >([]);
  const [barData, setBarData] = useState<{ value: number; label: string; frontColor: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const periods: { label: string; value: Period }[] = [
    { label: t('thisMonth'), value: 'month' },
    { label: t('threeMonths'), value: '3months' },
    { label: t('thisYear'), value: 'year' },
  ];

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [period])
  );

  const loadData = async () => {
    setLoading(true);
    const { start, end } = getPeriodDates(period);
    const months = period === 'month' ? 1 : period === '3months' ? 3 : 12;

    const [expenses, monthly] = await Promise.all([
      getExpensesByCategory(start, end),
      getMonthlyTotals(months),
    ]);

    setPieData(
      expenses.map((e) => ({
        value: e.total,
        color: e.category_color,
        text: `$${e.total.toFixed(0)}`,
        label: e.category_name,
      }))
    );

    const bars: { value: number; label: string; frontColor: string }[] = [];
    monthly.forEach((m) => {
      bars.push({ value: m.income, label: m.month.slice(5), frontColor: '#34C759' });
      bars.push({ value: m.expense, label: '', frontColor: '#FF3B30' });
    });
    setBarData(bars);
    setLoading(false);
  };

  return (
    <View style={styles.screen}>
      {/* Fixed header: title + segmented control */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.pageTitle}>{t('charts')}</Text>
        <View style={styles.segmentContainer}>
          <View style={styles.segment}>
            {periods.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[styles.segmentBtn, period === p.value && styles.segmentBtnActive]}
                onPress={() => setPeriod(p.value)}
              >
                <Text style={[styles.segmentText, period === p.value && styles.segmentTextActive]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Scrollable charts */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('expensesByCategory')}</Text>
            {pieData.length === 0 ? (
              <Text style={styles.empty}>{t('noExpenseData')}</Text>
            ) : (
              <>
                <PieChart
                  data={pieData}
                  donut
                  radius={100}
                  innerRadius={60}
                  centerLabelComponent={() => (
                    <Text style={styles.pieCenter}>{t('expenses')}</Text>
                  )}
                />
                <View style={styles.legend}>
                  {pieData.map((d, i) => (
                    <View key={i} style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: d.color }]} />
                      <Text style={styles.legendLabel}>{d.label}</Text>
                      <Text style={styles.legendValue}>{d.text}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{t('incomeVsExpenses')}</Text>
            <View style={styles.barLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.legendLabel}>{t('income')}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                <Text style={styles.legendLabel}>{t('expenses')}</Text>
              </View>
            </View>
            {barData.length === 0 ? (
              <Text style={styles.empty}>{t('noData')}</Text>
            ) : (
              <BarChart
                data={barData}
                barWidth={18}
                spacing={4}
                roundedTop
                hideRules
                xAxisThickness={StyleSheet.hairlineWidth}
                xAxisColor="#C6C6C8"
                yAxisThickness={0}
                yAxisTextStyle={styles.axisText}
                xAxisLabelTextStyle={styles.axisText}
                noOfSections={4}
                maxValue={
                  Math.ceil(
                    Math.max(...barData.map((b) => b.value), 1) / 100
                  ) * 100
                }
              />
            )}
          </View>
        </>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  scroll: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16, paddingBottom: 20 },
  pageTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.37,
    marginBottom: 16,
  },
  segmentContainer: { marginBottom: 16 },
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  pieCenter: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
  legend: { width: '100%', marginTop: 16 },
  barLegend: { flexDirection: 'row', gap: 16, alignSelf: 'flex-start', marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { flex: 1, fontSize: 15, color: '#8E8E93' },
  legendValue: { fontSize: 15, fontWeight: '500', color: '#000000' },
  loader: { marginTop: 80 },
  empty: { fontSize: 15, color: '#8E8E93', paddingVertical: 20 },
  axisText: { fontSize: 10, color: '#8E8E93' },
});
