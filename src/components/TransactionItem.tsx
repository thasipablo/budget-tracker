import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { format } from 'date-fns';
import type { Transaction } from '../types';

interface Props {
  item: Transaction;
  onLongPress?: () => void;
  isLast?: boolean;
}

export function TransactionItem({ item, onLongPress, isLast }: Props) {
  const isIncome = item.type === 'income';
  const sign = isIncome ? '+' : '-';
  const amountColor = isIncome ? '#34C759' : '#FF3B30';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/transaction/${item.id}`)}
      onLongPress={onLongPress}
      activeOpacity={0.6}
    >
      <View style={[styles.iconBox, { backgroundColor: (item.category_color ?? '#8E8E93') + '1A' }]}>
        <Text style={styles.icon}>{item.category_icon ?? '📦'}</Text>
      </View>
      <View style={[styles.info, !isLast && styles.infoBorder]}>
        <View style={styles.textBlock}>
          <Text style={styles.category}>{item.category_name ?? 'Uncategorized'}</Text>
          {item.note ? <Text style={styles.note} numberOfLines={1}>{item.note}</Text> : null}
          <Text style={styles.date}>{format(new Date(item.date), 'MMM d, yyyy')}</Text>
        </View>
        <Text style={[styles.amount, { color: amountColor }]}>
          {sign}${item.amount.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingLeft: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 20 },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 16,
    marginLeft: 12,
  },
  infoBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  textBlock: { flex: 1 },
  category: { fontSize: 17, fontWeight: '400', color: '#000000' },
  note: { fontSize: 13, color: '#8E8E93', marginTop: 1 },
  date: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  amount: { fontSize: 17, fontWeight: '500' },
});
