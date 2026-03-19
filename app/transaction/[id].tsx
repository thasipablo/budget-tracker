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
import { format } from 'date-fns';
import { getCategories } from '../../src/db/categories';
import { getTransactionById, insertTransaction, updateTransaction } from '../../src/db/transactions';
import { useI18n } from '../../src/i18n';
import type { Category, TransactionType } from '../../src/types';

export default function TransactionModal() {
  const { t } = useI18n();
  const { id, type: typeParam } = useLocalSearchParams<{ id: string; type?: string }>();
  const isNew = id === 'new';

  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(
    isNew && typeParam === 'income' ? 'income' : 'expense'
  );
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cats = await getCategories();
    setCategories(cats);

    if (!isNew) {
      const tx = await getTransactionById(Number(id));
      if (tx) {
        setAmount(tx.amount.toString());
        setType(tx.type);
        setCategoryId(tx.category_id);
        setDate(tx.date.slice(0, 10));
        setNote(tx.note ?? '');
      }
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert(t('invalidAmount'), t('invalidAmountMsg'));
      return;
    }
    if (!categoryId) {
      Alert.alert(t('selectCategory'), t('selectCategoryMsg'));
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await insertTransaction(Number(amount), type, categoryId, date, note || undefined);
      } else {
        await updateTransaction(Number(id), Number(amount), type, categoryId, date, note || undefined);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: isNew ? t('newTransaction') : t('editTransaction') }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Type segmented control */}
        <Text style={styles.sectionHeader}>{t('type')}</Text>
        <View style={styles.segment}>
          {(['expense', 'income'] as TransactionType[]).map((tp) => (
            <TouchableOpacity
              key={tp}
              style={[styles.segmentBtn, type === tp && styles.segmentBtnActive]}
              onPress={() => { setType(tp); setCategoryId(null); }}
            >
              <Text style={[styles.segmentText, type === tp && styles.segmentTextActive]}>
                {tp === 'income' ? t('incomeType') : t('expenseType')}
              </Text>
            </TouchableOpacity>
          ))}
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
            />
          </View>
        </View>

        {/* Category */}
        <Text style={styles.sectionHeader}>{t('category')}</Text>
        <View style={styles.categoryGrid}>
          {filteredCategories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.catChip,
                categoryId === c.id
                  ? { backgroundColor: c.color }
                  : { backgroundColor: c.color + '1A' },
              ]}
              onPress={() => setCategoryId(c.id)}
            >
              <Text style={styles.catIcon}>{c.icon}</Text>
              <Text style={[styles.catName, { color: categoryId === c.id ? '#FFFFFF' : c.color }]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
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
            style={[styles.textInput, styles.noteInput]}
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
          <Text style={styles.saveBtnText}>{saving ? t('saving') : t('saveTransaction')}</Text>
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
  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    padding: 2,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 7,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: { fontSize: 13, fontWeight: '500', color: '#8E8E93' },
  segmentTextActive: { color: '#000000', fontWeight: '600' },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
  },
  currencySymbol: {
    fontSize: 17,
    fontWeight: '600',
    color: '#8E8E93',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
  },
  textInput: {
    paddingHorizontal: 12,
    height: 44,
    fontSize: 17,
    color: '#000000',
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  catIcon: { fontSize: 14 },
  catName: { fontSize: 14, fontWeight: '500' },
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
