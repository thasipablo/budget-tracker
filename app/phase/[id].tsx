import { useState, useEffect } from 'react';
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
import { getPhaseById, insertPhase, updatePhase, deletePhase } from '../../src/db/phases';
import { useI18n } from '../../src/i18n';
import type { PhaseStatus } from '../../src/types';

export default function PhaseModal() {
  const { t } = useI18n();
  const { id, projectId } = useLocalSearchParams<{ id: string; projectId?: string }>();
  const isNew = id === 'new';

  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<PhaseStatus>('awaiting');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) loadPhase();
  }, []);

  const loadPhase = async () => {
    const phase = await getPhaseById(Number(id));
    if (phase) {
      setName(phase.name);
      setBudget(phase.budget != null ? phase.budget.toString() : '');
      setStartDate(phase.start_date ?? '');
      setEndDate(phase.end_date ?? '');
      setStatus(phase.status ?? 'awaiting');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('missingPhaseName'), t('missingPhaseNameMsg'));
      return;
    }
    const parsedBudget = budget ? Number(budget) : undefined;
    if (budget && (isNaN(parsedBudget!) || parsedBudget! <= 0)) {
      Alert.alert(t('invalidAmount'), t('invalidAmountMsg'));
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await insertPhase(
          Number(projectId),
          name.trim(),
          parsedBudget,
          startDate.trim() || undefined,
          endDate.trim() || undefined,
          status
        );
      } else {
        await updatePhase(
          Number(id),
          name.trim(),
          parsedBudget,
          startDate.trim() || undefined,
          endDate.trim() || undefined,
          status
        );
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(t('deletePhase'), t('deletePhaseMsg', { name }), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deletePhase(Number(id));
          router.back();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: isNew ? t('newPhase') : t('editPhase') }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <Text style={styles.sectionHeader}>{t('phaseName')}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder={t('phaseNamePlaceholder')}
            placeholderTextColor="#C7C7CC"
          />
        </View>

        {/* Budget */}
        <Text style={styles.sectionHeader}>{t('phaseBudget')}</Text>
        <View style={styles.inputCard}>
          <View style={styles.amountRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={budget}
              onChangeText={(text) => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) return;
                if (parts[1]?.length > 2) return;
                setBudget(cleaned);
              }}
              placeholder="0.00"
              placeholderTextColor="#C7C7CC"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Start Date */}
        <Text style={styles.sectionHeader}>{t('startDate')}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={startDate}
            onChangeText={setStartDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#C7C7CC"
          />
        </View>

        {/* End Date */}
        <Text style={styles.sectionHeader}>{t('endDate')}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={endDate}
            onChangeText={setEndDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#C7C7CC"
          />
        </View>

        {/* Status */}
        <Text style={styles.sectionHeader}>{t('projectStatus')}</Text>
        <View style={styles.segment}>
          {(['awaiting', 'active', 'done'] as PhaseStatus[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.segmentBtn, status === s && styles.segmentBtnActive]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.segmentText, status === s && styles.segmentTextActive]}>
                {t(s as any)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? t('saving') : t('savePhase')}</Text>
        </TouchableOpacity>

        {!isNew && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>{t('deletePhase')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16, paddingBottom: 40 },
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
  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    padding: 2,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentBtnActive: { backgroundColor: '#FFFFFF' },
  segmentText: { fontSize: 13, fontWeight: '500', color: '#8E8E93' },
  segmentTextActive: { color: '#000000', fontWeight: '600' },
  textInput: { paddingHorizontal: 12, height: 44, fontSize: 17, color: '#000000' },
  amountRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 44 },
  currencySymbol: { fontSize: 17, fontWeight: '600', color: '#8E8E93', marginRight: 4 },
  amountInput: { flex: 1, fontSize: 17, fontWeight: '600', color: '#000000' },
  saveBtn: {
    marginTop: 32,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  deleteBtn: { marginTop: 12, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  deleteBtnText: { color: '#FF3B30', fontSize: 17, fontWeight: '400' },
});
