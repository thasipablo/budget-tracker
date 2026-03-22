import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
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
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>{t('projects')}</Text>
        <TouchableOpacity
          onPress={() => router.push('/project/new')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="add" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.segmentContainer}>
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
      </View>

      <FlatList
        data={projects}
        keyExtractor={(p) => p.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            message={t('noProjects')}
            submessage={t('addFirstProject')}
            icon="💼"
          />
        }
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={() => router.push(`/project-detail/${item.id}`)}
          />
        )}
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
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  pageTitle: { fontSize: 28, fontWeight: '700', color: '#000000' },
  segmentContainer: { paddingHorizontal: 16, marginBottom: 12 },
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
  list: { padding: 16, paddingBottom: 120 },
});
