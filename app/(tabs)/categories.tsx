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
import { EmptyState } from '../../src/components/EmptyState';
import { useCategories } from '../../src/hooks/useCategories';
import { useI18n } from '../../src/i18n';
import type { Category, TransactionType } from '../../src/types';

type Tab = TransactionType;

export default function CategoriesScreen() {
  const { t } = useI18n();
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
    <View style={styles.screen}>
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
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push(`/category/${item.id}`)}
            activeOpacity={0.6}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '1A' }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={[styles.info, index < categories.length - 1 && styles.infoBorder]}>
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
        ListHeaderComponent={categories.length > 0 ? <View style={styles.cardTop} /> : null}
        ListFooterComponent={categories.length > 0 ? <View style={styles.cardBottom} /> : null}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/category/new')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  segmentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
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
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  cardTop: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 4,
  },
  cardBottom: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingLeft: 16,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 18 },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingRight: 16,
    marginLeft: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  infoBorder: {},
  name: { flex: 1, fontSize: 17, fontWeight: '400', color: '#000000' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});
