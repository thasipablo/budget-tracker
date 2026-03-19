import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../../src/components/EmptyState';
import { useCategories } from '../../src/hooks/useCategories';
import { useI18n } from '../../src/i18n';
import type { Category, TransactionType } from '../../src/types';

type Tab = TransactionType;

export default function CategoriesScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('expense');
  const { categories, load, remove } = useCategories();

  const tabs: { label: string; value: Tab }[] = [
    { label: t('expenses'), value: 'expense' },
    { label: t('income'), value: 'income' },
  ];

  useFocusEffect(
    useCallback(() => {
      load(activeTab);
    }, [load, activeTab])
  );

  const handleDelete = (cat: Category) => {
    Alert.alert(
      t('deleteCategory'),
      t('deleteCategoryMsg', { name: cat.name }),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => remove(cat.id) },
      ]
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>{t('categories')}</Text>
        <TouchableOpacity
          onPress={() => router.push(`/category/new?type=${activeTab}`)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {/* iOS segmented control */}
      <View style={styles.segmentContainer}>
        <View style={styles.segment}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[styles.segmentBtn, activeTab === tab.value && styles.segmentBtnActive]}
              onPress={() => setActiveTab(tab.value)}
            >
              <Text style={[styles.segmentText, activeTab === tab.value && styles.segmentTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(c) => c.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push(`/category/${item.id}`)}
            activeOpacity={0.6}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '1A' }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.actions}>
                <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState message={t('noCategories')} icon="🗂️" />
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.37,
    marginBottom: 8,
  },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 999,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: { fontSize: 13, fontWeight: '500', color: '#8E8E93' },
  segmentTextActive: { color: '#000000', fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 20, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 18 },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  name: { flex: 1, fontSize: 17, fontWeight: '400', color: '#000000' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
