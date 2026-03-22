import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { insertProjectTransfer } from '../../src/db/projectTransfers';
import { useI18n } from '../../src/i18n';

export default function ProjectTransferModal() {
  const { t } = useI18n();
  const { projectId } = useLocalSearchParams<{ projectId: string }>();

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const parsed = Number(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert(t('invalidAmount'), t('invalidAmountMsg'));
      return;
    }
    setSaving(true);
    try {
      await insertProjectTransfer(Number(projectId), parsed, date, note.trim() || undefined);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t('newTransfer') }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Disclaimer */}
        <View style={styles.disclaimerCard}>
          <Ionicons name="information-circle-outline" size={20} color="#5856D6" />
          <Text style={styles.disclaimerText}>{t('transferDisclaimer')}</Text>
        </View>

        {/* Amount */}
        <Text style={styles.sectionHeader}>{t('amount')}</Text>
        <View style={styles.inputCard}>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) return;
                if (parts[1]?.length > 2) return;
                setAmount(cleaned);
              }}
              placeholder="0.00"
              placeholderTextColor="#C7C7CC"
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>
        </View>

        {/* Date */}
        <Text style={styles.sectionHeader}>{t('date')}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#C7C7CC"
          />
        </View>

        {/* Note */}
        <Text style={styles.sectionHeader}>{t('noteOptional')}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={note}
            onChangeText={setNote}
            placeholder={t('addNote')}
            placeholderTextColor="#C7C7CC"
            multiline
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? t('saving') : t('saveTransfer')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16, paddingBottom: 40 },

  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0EEFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  disclaimerText: { flex: 1, fontSize: 14, color: '#3C3C43', lineHeight: 20 },

  sectionHeader: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6D6D72',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 8,
    paddingLeft: 16,
  },
  inputCard: { backgroundColor: '#FFFFFF', borderRadius: 10, overflow: 'hidden' },
  textInput: { paddingHorizontal: 12, height: 44, fontSize: 17, color: '#000000' },
  textArea: { height: 80, paddingTop: 10, textAlignVertical: 'top' },
  amountRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 44 },
  currencySymbol: { fontSize: 17, fontWeight: '600', color: '#8E8E93', marginRight: 4 },
  amountInput: { flex: 1, fontSize: 17, fontWeight: '600', color: '#000000' },

  saveBtn: {
    marginTop: 32,
    backgroundColor: '#5856D6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
});
