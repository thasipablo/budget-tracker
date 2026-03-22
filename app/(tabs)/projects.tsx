import { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProjects } from '../../src/hooks/useProjects';
import { ProjectCard } from '../../src/components/ProjectCard';
import { EmptyState } from '../../src/components/EmptyState';
import { useI18n } from '../../src/i18n';
import { getCategories } from '../../src/db/categories';
import type { ProjectStatus, Category } from '../../src/types';

type Tab = ProjectStatus;

export default function ProjectsScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [activeStatus, setActiveStatus] = useState<Tab>('active');
  const { projects, load } = useProjects();
  const [globalCategories, setGlobalCategories] = useState<Category[]>([]);

  const tabs: { label: string; value: Tab }[] = [
    { label: t('active'), value: 'active' },
    { label: t('completed'), value: 'completed' },
    { label: t('archived'), value: 'archived' },
  ];

  useFocusEffect(
    useCallback(() => {
      load(activeStatus);
      getCategories().then((cats) =>
        setGlobalCategories(cats.filter((c) => c.type === 'expense'))
      );
    }, [load, activeStatus])
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>{t('projects')}</Text>
          <TouchableOpacity
            style={styles.newProjectBtn}
            onPress={() => router.push('/project/new')}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={18} color="#007AFF" />
            <Text style={styles.newProjectText}>{t('newProject')}</Text>
          </TouchableOpacity>
        </View>

        {/* Status filter */}
        <View style={styles.segment}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.value}
              style={[styles.segmentBtn, activeStatus === tab.value && styles.segmentBtnActive]}
              onPress={() => setActiveStatus(tab.value)}
            >
              <Text
                style={[styles.segmentText, activeStatus === tab.value && styles.segmentTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Projects list */}
        {projects.length === 0 ? (
          <EmptyState
            message={t('noProjects')}
            submessage={t('addFirstProject')}
            icon="💼"
          />
        ) : (
          projects.map((item) => (
            <ProjectCard
              key={item.id}
              project={item}
              onPress={() => router.push(`/project-detail/${item.id}`)}
            />
          ))
        )}

        {/* Transaction expense categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('expenseCategories')}</Text>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => router.push('/(tabs)/categories')}
          >
            <Text style={styles.seeAll}>{t('seeAll')}</Text>
            <Ionicons name="chevron-forward" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {globalCategories.length === 0 ? (
          <View style={styles.emptyCats}>
            <Text style={styles.emptyCatsText}>{t('noCategories')}</Text>
          </View>
        ) : (
          <View style={styles.catGrid}>
            {globalCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, { backgroundColor: cat.color + '18', borderColor: cat.color + '40' }]}
                onPress={() => router.push(`/category/${cat.id}`)}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catName, { color: cat.color }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.catChip, styles.catChipAdd]}
              onPress={() => router.push('/category/new?type=expense')}
            >
              <Ionicons name="add" size={14} color="#007AFF" />
              <Text style={styles.catNameAdd}>{t('newCategory')}</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 120 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.37,
  },
  newProjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#007AFF1A',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  newProjectText: { fontSize: 14, fontWeight: '600', color: '#007AFF' },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    padding: 2,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
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

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#000000' },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll: { fontSize: 15, color: '#007AFF', fontWeight: '400' },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  catChipAdd: {
    borderStyle: 'dashed',
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
  },
  catIcon: { fontSize: 14 },
  catName: { fontSize: 13, fontWeight: '600' },
  catNameAdd: { fontSize: 13, fontWeight: '600', color: '#007AFF' },
  emptyCats: { paddingVertical: 12 },
  emptyCatsText: { fontSize: 14, color: '#8E8E93' },
});
