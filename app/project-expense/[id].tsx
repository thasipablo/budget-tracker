import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack, useFocusEffect } from 'expo-router';
import { getExpenseById, insertProjectExpense, updateProjectExpense } from '../../src/db/projectExpenses';
import { getCategoriesForProject } from '../../src/db/categories';
import { useI18n } from '../../src/i18n';
import { DatePickerField } from '../../src/components/DatePickerField';
import type { Category } from '../../src/types';

export default function ProjectExpenseModal() {
  const { t } = useI18n();
  const { id, phaseId, projectId } = useLocalSearchParams<{
    id: string;
    phaseId?: string;
    projectId?: string;
  }>();
  const isNew = id === 'new';

  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  // Load expense data once on mount
  useEffect(() => {
    if (!isNew) loadExpense();
  }, []);

  // Reload categories on focus so newly created categories appear immediately
  useFocusEffect(
    useCallback(() => {
      if (projectId) getCategoriesForProject(Number(projectId)).then(setCategories);
    }, [projectId])
  );

  const loadExpense = async () => {
    const expense = await getExpenseById(Number(id));
    if (expense) {
      setAmount(expense.amount.toString());
      setDate(expense.date);
      setNote(expense.note ?? '');
      setSelectedCategoryId(expense.category_id ?? undefined);
    }
  };

  const handleSave = async () => {
    const parsed = Number(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert(t('invalidAmount'), t('invalidAmountMsg'));
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await insertProjectExpense(
          Number(phaseId),
          Number(projectId),
          parsed,
          date,
          selectedCategoryId,
          note.trim() || undefined
        );
      } else {
        await updateProjectExpense(
          Number(id),
          parsed,
          date,
          selectedCategoryId,
          note.trim() || undefined
        );
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: isNew ? t('newExpense') : t('editExpense') }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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
            />
          </View>
        </View>

        {/* Date */}
        <Text style={styles.sectionHeader}>{t('date')}</Text>
        <View style={styles.inputCard}>
          <DatePickerField value={date} onChange={setDate} />
        </View>

        {/* Category */}
        <Text style={styles.sectionHeader}>{t('category')}</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategoryId === cat.id && {
                  backgroundColor: cat.color + '30',
                  borderColor: cat.color,
                },
              ]}
              onPress={() =>
                setSelectedCategoryId(selectedCategoryId === cat.id ? undefined : cat.id)
              }
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategoryId === cat.id && { color: cat.color, fontWeight: '600' },
                ]}
                numberOfLines={1}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.categoryChip, styles.categoryChipAdd]}
            onPress={() => router.push(`/project-category/new?projectId=${projectId}`)}
          >
            <Ionicons name="add" size={16} color="#5856D6" />
            <Text style={[styles.categoryLabel, { color: '#5856D6', fontWeight: '600' }]}>
              {t('newCategory')}
            </Text>
          </TouchableOpacity>
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
          <Text style={styles.saveBtnText}>{saving ? t('saving') : t('saveExpense')}</Text>
        </TouchableOpacity>
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
  textInput: { paddingHorizontal: 12, height: 44, fontSize: 17, color: '#000000' },
  textArea: { height: 80, paddingTop: 10, textAlignVertical: 'top' },
  amountRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 44 },
  currencySymbol: { fontSize: 17, fontWeight: '600', color: '#8E8E93', marginRight: 4 },
  amountInput: { flex: 1, fontSize: 17, fontWeight: '600', color: '#000000' },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  categoryIcon: { fontSize: 16 },
  categoryLabel: { fontSize: 13, color: '#3C3C43' },
  categoryChipAdd: {
    borderStyle: 'dashed',
    borderColor: '#5856D6',
  },
  saveBtn: {
    marginTop: 32,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
});
