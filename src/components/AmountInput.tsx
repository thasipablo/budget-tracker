import { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AmountInput({ value, onChange, placeholder = '0.00' }: Props) {
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    onChange(cleaned);
  };

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Text style={styles.currency}>$</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        keyboardType="decimal-pad"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor="#C7C7CC"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  focused: {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  currency: {
    fontSize: 17,
    fontWeight: '600',
    color: '#8E8E93',
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
});
