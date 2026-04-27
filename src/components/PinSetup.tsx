import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import PinPad from './PinPad';
import { savePin } from '../auth/authStore';
import { useI18n } from '../i18n';

interface PinSetupProps {
  onComplete: () => void;
}

type Step = 'create' | 'confirm';

export default function PinSetup({ onComplete }: PinSetupProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>('create');
  const [firstPin, setFirstPin] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (step === 'create') {
      setFirstPin(pin);
      setPin('');
      setError('');
      setStep('confirm');
    } else {
      if (pin === firstPin) {
        await savePin(pin);
        onComplete();
      } else {
        setError(t('pinMismatch'));
        setPin('');
        setFirstPin('');
        setStep('create');
      }
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {step === 'create' ? t('setPinTitle') : t('confirmPinTitle')}
        </Text>
        <Text style={styles.hint}>{t('pinHint')}</Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <PinPad value={pin} onChange={setPin} onSubmit={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F7' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  title: { fontSize: 24, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },
  hint: { fontSize: 15, color: '#8E8E93', textAlign: 'center', marginBottom: 8 },
  error: { fontSize: 14, color: '#FF3B30', textAlign: 'center' },
});
