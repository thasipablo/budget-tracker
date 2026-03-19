import { View, Text, StyleSheet } from 'react-native';
import type { Category } from '../types';

interface Props {
  category: Category;
}

export function CategoryBadge({ category }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: category.color + '1A' }]}>
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[styles.name, { color: category.color }]}>{category.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  icon: { fontSize: 14 },
  name: { fontSize: 13, fontWeight: '500' },
});
