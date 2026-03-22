import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, Stack, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProjectById } from '../../src/db/projects';
import { getPhasesByProject, swapPhaseOrder, deletePhase } from '../../src/db/phases';
import { getTransfersByProject, deleteProjectTransfer } from '../../src/db/projectTransfers';
import { getCategoriesByProjectId } from '../../src/db/categories';
import { ProgressBar } from '../../src/components/ProgressBar';
import { PhaseCard } from '../../src/components/PhaseCard';
import { EmptyState } from '../../src/components/EmptyState';
import { useI18n } from '../../src/i18n';
import type { Project, Phase, ProjectTransfer, Category } from '../../src/types';

export default function ProjectDetailScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [transfers, setTransfers] = useState<ProjectTransfer[]>([]);
  const [projectCategories, setProjectCategories] = useState<Category[]>([]);

  const loadAll = useCallback(async () => {
    const [proj, phs, trs, cats] = await Promise.all([
      getProjectById(projectId),
      getPhasesByProject(projectId),
      getTransfersByProject(projectId),
      getCategoriesByProjectId(projectId),
    ]);
    setProject(proj);
    setPhases(phs);
    setTransfers(trs);
    setProjectCategories(cats);
  }, [projectId]);

  useFocusEffect(useCallback(() => { loadAll(); }, [loadAll]));

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    await swapPhaseOrder(phases[index].id, phases[index - 1].id);
    await loadAll();
  };

  const handleMoveDown = async (index: number) => {
    if (index === phases.length - 1) return;
    await swapPhaseOrder(phases[index].id, phases[index + 1].id);
    await loadAll();
  };

  const handleDeletePhase = (phase: Phase) => {
    Alert.alert(t('deletePhase'), t('deletePhaseMsg', { name: phase.name }), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deletePhase(phase.id);
          await loadAll();
        },
      },
    ]);
  };

  const handleDeleteTransfer = (transfer: ProjectTransfer) => {
    Alert.alert(t('deleteTransfer'), t('deleteTransferMsg'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteProjectTransfer(transfer.id);
          await loadAll();
        },
      },
    ]);
  };

  if (!project) return null;

  const spent = project.total_spent ?? 0;
  const funded = project.total_funded ?? 0;
  const budget = project.budget;
  const progress = budget && budget > 0 ? spent / budget : 0;
  const isOverBudget = budget != null && spent > budget;

  return (
    <>
      <Stack.Screen
        options={{
          title: project.name,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push(`/project/${project.id}`)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="pencil" size={20} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>

        {/* Financial Summary */}
        <View style={[styles.summaryCard, { backgroundColor: project.color + '0F' }]}>
          <View style={styles.summaryHeader}>
            <Text style={styles.projectIcon}>{project.icon}</Text>
            <View style={styles.summaryInfo}>
              <Text style={[styles.projectTitle, { color: project.color }]}>{project.name}</Text>
              {project.description ? (
                <Text style={styles.projectDesc} numberOfLines={2}>{project.description}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('totalBudget')}</Text>
              <Text style={styles.statValue}>{budget != null ? `$${budget.toFixed(2)}` : t('noBudget')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('totalFunded')}</Text>
              <Text style={[styles.statValue, { color: '#34C759' }]}>${funded.toFixed(2)}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{t('totalSpent')}</Text>
              <Text style={[styles.statValue, { color: isOverBudget ? '#FF3B30' : '#000000' }]}>
                ${spent.toFixed(2)}
              </Text>
            </View>
          </View>

          {budget != null && (
            <View style={styles.progressSection}>
              <ProgressBar progress={progress} color={project.color} height={8} />
              {isOverBudget && (
                <Text style={styles.overBudgetLabel}>{t('overBudget')}</Text>
              )}
            </View>
          )}
        </View>

        {/* Phases Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('phases')}</Text>
          <TouchableOpacity
            onPress={() => router.push(`/phase/new?projectId=${projectId}`)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {phases.length === 0 ? (
          <View style={styles.emptySection}>
            <EmptyState message={t('noPhases')} submessage={t('addFirstPhase')} icon="layers-outline" />
          </View>
        ) : (
          phases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              isFirst={index === 0}
              isLast={index === phases.length - 1}
              onPress={() => router.push(`/phase-detail/${phase.id}`)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onDelete={() => handleDeletePhase(phase)}
            />
          ))
        )}

        {/* Transfers Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>{t('projectTransfers')}</Text>
          <TouchableOpacity
            onPress={() => router.push(`/project-transfer/new?projectId=${projectId}`)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add-circle" size={24} color="#34C759" />
          </TouchableOpacity>
        </View>

        {transfers.length === 0 ? (
          <Text style={styles.emptyText}>{t('noTransfers')}</Text>
        ) : (
          transfers.map((tr) => (
            <View key={tr.id} style={styles.transferRow}>
              <View style={styles.transferLeft}>
                <Text style={styles.transferIcon}>💸</Text>
                <View>
                  <Text style={styles.transferAmount}>${tr.amount.toFixed(2)}</Text>
                  <Text style={styles.transferDate}>{tr.date}</Text>
                  {tr.note ? <Text style={styles.transferNote}>{tr.note}</Text> : null}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteTransfer(tr)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Project Categories Section */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>{t('projectCategories')}</Text>
          <TouchableOpacity
            onPress={() => router.push(`/project-category/new?projectId=${projectId}`)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {projectCategories.length === 0 ? (
          <Text style={styles.emptyText}>{t('noCategories')}</Text>
        ) : (
          <View style={styles.catGrid}>
            {projectCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, { backgroundColor: cat.color + '1A' }]}
                onPress={() => router.push(`/category/${cat.id}`)}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catName, { color: cat.color }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 16, paddingBottom: 80 },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  projectIcon: { fontSize: 32 },
  summaryInfo: { flex: 1 },
  projectTitle: { fontSize: 18, fontWeight: '700' },
  projectDesc: { fontSize: 13, color: '#6D6D72', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statLabel: { fontSize: 11, color: '#8E8E93', fontWeight: '500' },
  statValue: { fontSize: 14, fontWeight: '700', color: '#000000' },
  statDivider: { width: 1, height: 30, backgroundColor: '#E5E5EA' },
  progressSection: { gap: 6 },
  overBudgetLabel: { fontSize: 12, fontWeight: '600', color: '#FF3B30', textAlign: 'right' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#000000' },
  emptySection: { marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#8E8E93', textAlign: 'center', paddingVertical: 16 },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  transferLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  transferIcon: { fontSize: 20 },
  transferAmount: { fontSize: 16, fontWeight: '600', color: '#34C759' },
  transferDate: { fontSize: 12, color: '#8E8E93' },
  transferNote: { fontSize: 12, color: '#636366', marginTop: 1 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  catIcon: { fontSize: 14 },
  catName: { fontSize: 13, fontWeight: '500' },
});
