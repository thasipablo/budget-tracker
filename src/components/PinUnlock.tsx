import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PinPad from './PinPad';
import { verifyPin, isBiometricAvailable, authenticateWithBiometrics } from '../auth/authStore';
import { useI18n } from '../i18n';

interface PinUnlockProps {
  onUnlocked: () => void;
}

export default function PinUnlock({ onUnlocked }: PinUnlockProps) {
  const { t } = useI18n();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const available = await isBiometricAvailable();
      if (cancelled) return;
      setBiometricAvailable(available);
      if (available) {
        tryBiometrics();
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  async function tryBiometrics() {
    const success = await authenticateWithBiometrics();
    if (success) onUnlocked();
  }

  async function handleSubmit() {
    const ok = await verifyPin(pin);
    if (ok) {
      onUnlocked();
    } else {
      setError(t('wrongPin'));
      setPin('');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('unlockTitle')}</Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <PinPad value={pin} onChange={setPin} onSubmit={handleSubmit} />
        {biometricAvailable && (
          <TouchableOpacity style={styles.biometricBtn} onPress={tryBiometrics} activeOpacity={0.7}>
            <Ionicons name="finger-print-outline" size={32} color="#007AFF" />
            <Text style={styles.biometricText}>{t('useBiometrics')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  title: { fontSize: 24, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },
  error: { fontSize: 14, color: '#FF3B30', textAlign: 'center' },
  biometricBtn: { alignItems: 'center', gap: 6, marginTop: 12 },
  biometricText: { fontSize: 15, color: '#007AFF' },
});
