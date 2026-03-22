import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useI18n } from '../i18n';
import { ProgressBar } from './ProgressBar';
import type { Project } from '../types';

interface Props {
  project: Project;
  onPress: () => void;
}

const STATUS_COLOR: Record<string, string> = {
  active: '#34C759',
  completed: '#007AFF',
  archived: '#8E8E93',
};

export function ProjectCard({ project, onPress }: Props) {
  const { t } = useI18n();
  const spent = project.total_spent ?? 0;
  const funded = project.total_funded ?? 0;
  const budget = project.budget;
  const progress = budget && budget > 0 ? spent / budget : 0;
  const isOverBudget = budget != null && spent > budget;
  const statusColor = STATUS_COLOR[project.status] ?? '#8E8E93';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconWrap, { backgroundColor: project.color + '1A' }]}>
        <Text style={styles.icon}>{project.icon}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{project.name}</Text>
          <View style={[styles.badge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{t(project.status as any)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.stat}>
            <Text style={styles.statValue}>${spent.toFixed(0)}</Text>
            {' '}{t('spent' as any)}
          </Text>
          {funded > 0 && (
            <Text style={styles.stat}>
              {'· '}
              <Text style={styles.statValue}>${funded.toFixed(0)}</Text>
              {' '}{t('funded' as any)}
            </Text>
          )}
          {isOverBudget && (
            <Text style={styles.over}>{t('overBudget' as any)}</Text>
          )}
        </View>

        {budget != null && (
          <View style={styles.progressWrap}>
            <ProgressBar progress={progress} color={project.color} height={4} />
          </View>
        )}

        <Text style={styles.phaseCount}>
          {project.phase_count ?? 0} {t('phases' as any)}
          {budget != null && (
            <Text style={styles.budgetHint}>{' · '}${budget.toFixed(0)} {t('budget' as any)}</Text>
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 22 },
  content: { flex: 1, gap: 4 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: { flex: 1, fontSize: 15, fontWeight: '600', color: '#000000' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  stat: { fontSize: 12, color: '#8E8E93' },
  statValue: { fontWeight: '600', color: '#3A3A3C' },
  over: { fontSize: 11, fontWeight: '600', color: '#FF3B30' },
  progressWrap: { marginTop: 2, marginBottom: 2 },
  phaseCount: { fontSize: 11, color: '#8E8E93', marginTop: 2 },
  budgetHint: { color: '#C7C7CC' },
});
