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
import {
  getCategoryById,
  insertCategory,
  updateCategory,
  deleteCategory,
} from '../../src/db/categories';
import { useI18n } from '../../src/i18n';
import type { TransactionType } from '../../src/types';

const PRESET_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7BE',
  '#30B0C7', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55',
  '#A2845E', '#8E8E93', '#636366', '#48484A', '#3A3A3C',
];

const PRESET_ICONS = [
  // Food & Drink
  '🍕', '🍔', '☕', '🍜', '🥗', '🍣', '🛒', '🍷', '🧃', '🍺',
  // Transport
  '🚗', '🚇', '✈️', '⛽', '🛵', '🚲', '🚅', '🛳️', '🚕', '🏎️',
  // Home & Living
  '🏠', '🛋️', '🔧', '🧹', '💡', '🔑', '🪴', '🏡', '🛁', '🪟',
  // Finance
  '💳', '🏦', '📊', '🪙', '💸', '📈', '💰', '💵', '🤑', '📉',
  // Health & Wellness
  '💊', '🏥', '🧘', '🦷', '🩺', '💉', '💪', '🧴', '🩹', '🧬',
  // Entertainment
  '🎬', '🎵', '📚', '🎮', '🎨', '🎫', '📺', '🎧', '📷', '🎤',
  // Education & Kids
  '🎓', '📖', '🔬', '👶', '🧸', '🎒', '📝', '🏫', '✏️', '🖊️',
  // Pets & Sports
  '🐕', '🐈', '🐾', '⚽', '🎾', '🏊', '🚴', '🧗', '🏋️', '⛷️',
  // Shopping & Beauty
  '🛍️', '👗', '👟', '💍', '🎁', '📦', '💅', '💇', '🧖', '💄',
  // Travel & Outdoors
  '🗺️', '🏨', '🏖️', '🌍', '🧳', '🎡', '🏰', '🌅', '🏕️', '🌿',
];

export default function CategoryModal() {
  const { t } = useI18n();
  const { id, type: typeParam } = useLocalSearchParams<{ id: string; type?: string }>();
  const isNew = id === 'new';

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(
    isNew && typeParam === 'income' ? 'income' : 'expense'
  );
  const [color, setColor] = useState(PRESET_COLORS[6]); // systemBlue
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) loadCategory();
  }, []);

  const loadCategory = async () => {
    const cat = await getCategoryById(Number(id));
    if (cat) {
      setName(cat.name);
      setType(cat.type);
      setColor(cat.color);
      setIcon(cat.icon);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('missingName'), t('missingNameMsg'));
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await insertCategory(name.trim(), type, color, icon);
      } else {
        await updateCategory(Number(id), name.trim(), color, icon);
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(t('deleteCategory'), t('deleteCategoryConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteCategory(Number(id));
          router.back();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: isNew ? t('newCategory') : t('editCategory') }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Type (only for new) */}
        {isNew && (
          <>
            <Text style={styles.sectionHeader}>{t('type')}</Text>
            <View style={styles.segment}>
              {(['expense', 'income'] as TransactionType[]).map((tp) => (
                <TouchableOpacity
                  key={tp}
                  style={[styles.segmentBtn, type === tp && styles.segmentBtnActive]}
                  onPress={() => setType(tp)}
                >
                  <Text style={[styles.segmentText, type === tp && styles.segmentTextActive]}>
                    {tp === 'income' ? t('incomeType') : t('expenseType')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Name */}
        <Text style={styles.sectionHeader}>{t('name')}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder={t('namePlaceholder')}
            placeholderTextColor="#C7C7CC"
          />
        </View>

        {/* Icon */}
        <Text style={styles.sectionHeader}>{t('icon')}</Text>
        <View style={styles.grid}>
          {PRESET_ICONS.map((ic) => (
            <TouchableOpacity
              key={ic}
              style={[styles.iconBtn, icon === ic && { backgroundColor: '#007AFF1A' }]}
              onPress={() => setIcon(ic)}
            >
              <Text style={styles.iconText}>{ic}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color */}
        <Text style={styles.sectionHeader}>{t('color')}</Text>
        <View style={styles.colorGrid}>
          {PRESET_COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorBtn,
                { backgroundColor: c },
                color === c && styles.colorBtnActive,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        {/* Preview */}
        <Text style={styles.sectionHeader}>{t('preview')}</Text>
        <View style={[styles.previewCard, { backgroundColor: color + '1A' }]}>
          <Text style={styles.previewIcon}>{icon}</Text>
          <Text style={[styles.previewName, { color }]}>{name || t('categoryName')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? t('saving') : t('saveCategory')}</Text>
        </TouchableOpacity>

        {!isNew && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>{t('deleteCategory')}</Text>
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
  textInput: {
    paddingHorizontal: 12,
    height: 44,
    fontSize: 17,
    color: '#000000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { fontSize: 20 },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
  },
  colorBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  colorBtnActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 10,
  },
  previewIcon: { fontSize: 28 },
  previewName: { fontSize: 17, fontWeight: '600' },
  saveBtn: {
    marginTop: 32,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' },
  deleteBtn: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteBtnText: { color: '#FF3B30', fontSize: 17, fontWeight: '400' },
});
