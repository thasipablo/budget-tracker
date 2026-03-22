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
import { getProjectById, insertProject, updateProject, deleteProject } from '../../src/db/projects';
import { useI18n } from '../../src/i18n';
import type { ProjectStatus } from '../../src/types';

const PRESET_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#00C7BE',
  '#30B0C7', '#007AFF', '#5856D6', '#AF52DE', '#FF2D55',
  '#A2845E', '#8E8E93', '#636366', '#48484A', '#3A3A3C',
];

const PRESET_ICONS = [
  // Home & Real Estate
  '🏠', '🏡', '🏗️', '🏢', '🏰', '🏘️', '🏬', '🏭', '🏛️', '🌆',
  // Tech & Digital
  '📱', '💻', '🖥️', '🤖', '🚀', '📡', '🔮', '💡', '⚡', '🌐',
  // Business & Commerce
  '💼', '🎯', '🤝', '📊', '💰', '🏆', '🌟', '💎', '🛸', '🗺️',
  // Creative & Arts
  '🎨', '🎭', '📸', '🎬', '🎵', '🎮', '📚', '🖊️', '✏️', '🎓',
  // Health & Lifestyle
  '🌿', '🧘', '🏋️', '🌱', '🍃', '🌊', '🌄', '🏖️', '🏕️', '🌍',
  // Science & Research
  '🔬', '🧬', '🔭', '⚗️', '🧪', '🌌', '⚛️', '🦾', '🧠', '🩺',
];

export default function ProjectModal() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[6]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) loadProject();
  }, []);

  const loadProject = async () => {
    const project = await getProjectById(Number(id));
    if (project) {
      setName(project.name);
      setDescription(project.description ?? '');
      setBudget(project.budget != null ? project.budget.toString() : '');
      setColor(project.color);
      setIcon(project.icon);
      setStatus(project.status);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(t('missingProjectName'), t('missingProjectNameMsg'));
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
        await insertProject(name.trim(), color, icon, description.trim() || undefined, parsedBudget);
      } else {
        await updateProject(
          Number(id), name.trim(), color, icon, status,
          description.trim() || undefined, parsedBudget
        );
      }
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(t('deleteProject'), t('deleteProjectMsg', { name }), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteProject(Number(id));
          router.back();
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ title: isNew ? t('newProject') : t('editProject') }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <Text style={styles.sectionHeader}>{t('projectName')}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder={t('projectNamePlaceholder')}
            placeholderTextColor="#C7C7CC"
          />
        </View>

        {/* Description */}
        <Text style={styles.sectionHeader}>{t('projectDescription')}</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('projectDescriptionPlaceholder')}
            placeholderTextColor="#C7C7CC"
            multiline
          />
        </View>

        {/* Budget (optional) */}
        <Text style={styles.sectionHeader}>{t('projectBudget')}</Text>
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

        {/* Status (edit only) */}
        {!isNew && (
          <>
            <Text style={styles.sectionHeader}>{t('projectStatus')}</Text>
            <View style={styles.segment}>
              {(['active', 'completed', 'archived'] as ProjectStatus[]).map((s) => (
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
          </>
        )}

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
              style={[styles.colorBtn, { backgroundColor: c }, color === c && styles.colorBtnActive]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        {/* Preview */}
        <Text style={styles.sectionHeader}>{t('preview')}</Text>
        <View style={[styles.previewCard, { backgroundColor: color + '1A' }]}>
          <Text style={styles.previewIcon}>{icon}</Text>
          <Text style={[styles.previewName, { color }]}>{name || t('projectName')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveBtnText}>{saving ? t('saving') : t('saveProject')}</Text>
        </TouchableOpacity>

        {!isNew && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>{t('deleteProject')}</Text>
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
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
