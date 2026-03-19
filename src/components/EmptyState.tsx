import { View, Text, StyleSheet } from 'react-native';

interface Props {
  message?: string;
  submessage?: string;
  icon?: string;
}

export function EmptyState({ message = 'No items yet', submessage, icon = '📭' }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
      {submessage ? <Text style={styles.sub}>{submessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  icon: { fontSize: 48, marginBottom: 12 },
  message: { fontSize: 17, fontWeight: '600', color: '#000000', textAlign: 'center' },
  sub: { fontSize: 13, color: '#8E8E93', textAlign: 'center', marginTop: 4 },
});
