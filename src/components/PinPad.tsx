import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const;
const PIN_LENGTH = 4;

interface PinPadProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

export default function PinPad({ value, onChange, onSubmit }: PinPadProps) {
  function handleKey(key: string) {
    if (key === 'del') {
      onChange(value.slice(0, -1));
    } else if (value.length < PIN_LENGTH) {
      const next = value + key;
      onChange(next);
      if (next.length === PIN_LENGTH) {
        onSubmit?.();
      }
    }
  }

  return (
    <View style={styles.container}>
      {/* Dots */}
      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <View key={i} style={[styles.dot, i < value.length && styles.dotFilled]} />
        ))}
      </View>

      {/* Keypad */}
      <View style={styles.grid}>
        {KEYS.map((key, i) => {
          if (key === '') {
            return <View key={i} style={styles.keyPlaceholder} />;
          }
          return (
            <TouchableOpacity
              key={i}
              style={styles.key}
              onPress={() => handleKey(key)}
              activeOpacity={0.7}
            >
              {key === 'del' ? (
                <Ionicons name="backspace-outline" size={24} color="#007AFF" />
              ) : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 32 },
  dots: { flexDirection: 'row', gap: 20 },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  dotFilled: { backgroundColor: '#007AFF' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 288,
    gap: 12,
    justifyContent: 'center',
  },
  key: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  keyPlaceholder: { width: 84, height: 84 },
  keyText: { fontSize: 26, fontWeight: '400', color: '#1C1C1E' },
});
