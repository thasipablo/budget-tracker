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
import type { ProjectStatus } from '../../src/types';

type Tab = ProjectStatus;

export default function ProjectsScreen() {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [activeStatus, setActiveStatus] = useState<Tab>('active');
  const { projects, load } = useProjects();

  const tabs: { label: string; value: Tab }[] = [
    { label: t('active'), value: 'active' },
    { label: t('completed'), value: 'completed' },
    { label: t('archived'), value: 'archived' },
  ];

  useFocusEffect(
    useCallback(() => {
      load(activeStatus);
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
});
