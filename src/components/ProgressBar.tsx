import { View, StyleSheet } from 'react-native';

interface Props {
  progress: number; // 0–1, clamped; > 1 = over budget (turns red)
  color: string;
  height?: number;
}

export function ProgressBar({ progress, color, height = 6 }: Props) {
  const isOverBudget = progress > 1;
  const fill = Math.min(progress, 1) * 100;
  const barColor = isOverBudget ? '#FF3B30' : color;

  return (
    <View style={[styles.track, { height }]}>
      <View
        style={{
          width: `${fill}%` as `${number}%`,
          height,
          backgroundColor: barColor,
          borderRadius: 999,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#E5E5EA',
    borderRadius: 999,
    overflow: 'hidden',
    width: '100%',
  },
});
