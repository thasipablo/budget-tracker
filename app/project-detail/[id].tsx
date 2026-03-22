import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, router, Stack, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProjectById } from '../../src/db/projects';
import { getPhasesByProject, swapPhaseOrder, deletePhase } from '../../src/db/phases';
import { getTransfersByProject, deleteProjectTransfer } from '../../src/db/projectTransfers';
import { getCategoriesByProjectId, deleteCategory } from '../../src/db/categories';
import { ProgressBar } from '../../src/components/ProgressBar';
import { PhaseCard } from '../../src/components/PhaseCard';
import { useI18n } from '../../src/i18n';
import type { Project, Phase, ProjectTransfer, Category } from '../../src/types';

export default function ProjectDetailScreen() {
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const projectId = Number(id);
  const insets = useSafeAreaInsets();

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

  const STATUS_COLORS: Record<string, string> = {
    active: '#34C759',
    completed: '#007AFF',
    archived: '#8E8E93',
  };
  const statusColor = STATUS_COLORS[project.status] ?? '#8E8E93';

  const fmt = (v: number) => v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
        {/* Nav row */}
        <View style={styles.headerNav}>
          <TouchableOpacity
            style={styles.headerBackBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={17} color="#3C3C43" />
            <Text style={styles.headerBackLabel}>{t('projects')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerEditBtn}
            onPress={() => router.push(`/project/${project.id}`)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil" size={16} color="#3C3C43" />
          </TouchableOpacity>
        </View>

        {/* Identity row */}
        <View style={styles.headerIdentity}>
          <View style={[styles.headerIconWrap, { backgroundColor: project.color + '18' }]}>
            <Text style={styles.headerIconEmoji}>{project.icon}</Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerName}>{project.name}</Text>
            {project.description ? (
              <Text style={styles.headerDesc} numberOfLines={2}>{project.description}</Text>
            ) : null}
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{t(project.status as any)}</Text>
            </View>
          </View>
        </View>

        {/* Stats strip */}
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>{t('totalBudget')}</Text>
            <Text style={styles.heroStatValue}>{fmt(budget ?? 0)}</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>{t('totalFunded')}</Text>
            <Text style={[styles.heroStatValue, { color: '#34C759' }]}>{fmt(funded)}</Text>
          </View>
          <View style={styles.heroStatDivider} />
          <View style={styles.heroStat}>
            <Text style={styles.heroStatLabel}>{t('totalSpent')}</Text>
            <Text style={[styles.heroStatValue, isOverBudget && styles.overValue]}>
              {fmt(spent)}
            </Text>
          </View>
        </View>

        {/* Fund Project action */}
        <TouchableOpacity
          style={styles.fundBtn}
          onPress={() => router.push(`/project-transfer/new?projectId=${projectId}`)}
        >
          <Ionicons name="arrow-down-circle" size={17} color="#34C759" />
          <Text style={styles.fundBtnText}>{t('newTransfer')}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Progress bar ── */}
      {budget != null && budget > 0 && (
        <View style={styles.progressStrip}>
          <ProgressBar progress={progress} color={project.color} height={6} />
          {isOverBudget ? (
            <View style={styles.overRowStrip}>
              <Ionicons name="warning" size={12} color="#FF3B30" />
              <Text style={[styles.overBudgetLabel, { color: '#FF3B30' }]}>
                {t('overBy' as any)} {fmt(spent - budget)}
              </Text>
            </View>
          ) : (
            <View style={styles.overRowStrip}>
              <Ionicons name="checkmark-circle" size={12} color="#34C759" />
              <Text style={[styles.overBudgetLabel, { color: '#34C759' }]}>
                {t('remaining' as any)} {fmt(budget - spent)}
              </Text>
            </View>
          )}
        </View>
      )}

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Phases ── */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>{t('phases')}</Text>
            {phases.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{phases.length}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.addPill, { backgroundColor: project.color + '18' }]}
            onPress={() => router.push(`/phase/new?projectId=${projectId}`)}
          >
            <Ionicons name="add" size={16} color={project.color} />
            <Text style={[styles.addPillText, { color: project.color }]}>{t('newPhase')}</Text>
          </TouchableOpacity>
        </View>

        {phases.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="layers-outline" size={28} color="#C7C7CC" />
            <Text style={styles.emptyCardText}>{t('noPhases')}</Text>
            <Text style={styles.emptyCardSub}>{t('addFirstPhase')}</Text>
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

        {/* ── Funding Transfers ── */}
        <View style={[styles.sectionRow, { marginTop: 28 }]}>
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>{t('projectTransfers')}</Text>
            {transfers.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{transfers.length}</Text>
              </View>
            )}
          </View>
        </View>

        {transfers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="arrow-down-circle-outline" size={28} color="#C7C7CC" />
            <Text style={styles.emptyCardText}>{t('noTransfers')}</Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {transfers.map((tr, i) => (
              <View
                key={tr.id}
                style={[styles.transferRow, i < transfers.length - 1 && styles.transferBorder]}
              >
                <View style={styles.transferIconWrap}>
                  <Text style={styles.transferEmoji}>💸</Text>
                </View>
                <View style={styles.transferInfo}>
                  <Text style={styles.transferAmount}>{fmt(tr.amount)}</Text>
                  <Text style={styles.transferDate}>{tr.date}</Text>
                  {tr.note ? <Text style={styles.transferNote}>{tr.note}</Text> : null}
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteTransfer(tr)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={17} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* ── Project Categories ── */}
        <View style={[styles.sectionRow, { marginTop: 28 }]}>
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>{t('projectCategories')}</Text>
            {projectCategories.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{projectCategories.length}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.addPill, { backgroundColor: project.color + '18' }]}
            onPress={() => router.push(`/project-category/new?projectId=${projectId}`)}
          >
            <Ionicons name="add" size={16} color={project.color} />
            <Text style={[styles.addPillText, { color: project.color }]}>{t('newProjectCategory')}</Text>
          </TouchableOpacity>
        </View>

        {projectCategories.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="pricetag-outline" size={28} color="#C7C7CC" />
            <Text style={styles.emptyCardText}>{t('noCategories')}</Text>
          </View>
        ) : (
          <View style={styles.catGrid}>
            {projectCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catChip, { backgroundColor: cat.color + '18', borderColor: cat.color + '40' }]}
                onPress={() => router.push(`/project-category/${cat.id}?projectId=${projectId}`)}
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

  /* Header */
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 36,
    paddingHorizontal: 12,
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  headerBackLabel: { fontSize: 15, color: '#3C3C43', fontWeight: '500' },
  headerEditBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  headerIdentity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  headerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconEmoji: { fontSize: 30 },
  headerMeta: { flex: 1, paddingTop: 2 },
  headerName: { fontSize: 22, fontWeight: '800', color: '#000000', letterSpacing: -0.3 },
  headerDesc: { fontSize: 14, color: '#6D6D72', marginTop: 3, lineHeight: 19 },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: '600' },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 14,
  },
  heroStat: { flex: 1, alignItems: 'center', gap: 3 },
  heroStatLabel: { fontSize: 10, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.4 },
  heroStatValue: { fontSize: 15, fontWeight: '700', color: '#000000' },
  heroStatDivider: { width: 1, backgroundColor: '#E5E5EA' },
  overValue: { color: '#FF3B30' },

  /* Progress strip */
  progressStrip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF', gap: 4 },
  overRowStrip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  overBudgetLabel: { fontSize: 12, fontWeight: '600' },

  /* Fund button in header */
  fundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#34C75914',
    borderWidth: 1,
    borderColor: '#34C75930',
  },
  fundBtnText: { fontSize: 14, fontWeight: '600', color: '#34C759' },

  /* Section headers */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000000' },
  countBadge: {
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  countText: { fontSize: 12, fontWeight: '600', color: '#3C3C43' },
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  addPillText: { fontSize: 13, fontWeight: '600' },
  addPillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#34C75918',
  },
  addPillGreenText: { fontSize: 13, fontWeight: '600', color: '#34C759' },

  /* Empty card */
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  emptyCardText: { fontSize: 15, fontWeight: '600', color: '#3C3C43' },
  emptyCardSub: { fontSize: 13, color: '#8E8E93' },

  /* Transfers */
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' },
  transferRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  transferBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5E5EA' },
  transferIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#34C75912',
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferEmoji: { fontSize: 20 },
  transferInfo: { flex: 1 },
  transferAmount: { fontSize: 17, fontWeight: '700', color: '#34C759' },
  transferDate: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  transferNote: { fontSize: 12, color: '#636366', marginTop: 1 },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FF3B3010',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Categories */
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
  catIcon: { fontSize: 15 },
  catName: { fontSize: 13, fontWeight: '600' },
});
