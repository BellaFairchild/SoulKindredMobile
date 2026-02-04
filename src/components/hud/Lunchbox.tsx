import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTasks, useToggleTask } from '@/state/selectors';

export default function Lunchbox() {
  const tasks = useTasks();
  const toggleTask = useToggleTask();

  const hasTasks = tasks.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lunchbox</Text>
      {hasTasks ? (
        tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={[styles.row, task.completed && styles.completed]}
            onPress={() => toggleTask(task.id)}
          >
            <View style={[styles.checkbox, task.completed && styles.checkboxOn]} />
            <Text style={[styles.label, task.completed && styles.labelOn]}>{task.label}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.empty}>No rituals yet — add one to get started.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 8,
  },
  title: {
    color: '#cbd5e1',
    fontWeight: '600',
    letterSpacing: 0.6,
  },
  empty: {
    color: '#94a3b8',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  completed: {
    opacity: 0.6,
  },
  checkbox: {
    height: 18,
    width: 18,
    borderRadius: 6,
    borderColor: '#334155',
    borderWidth: 2,
  },
  checkboxOn: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  label: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  labelOn: {
    textDecorationLine: 'line-through',
  },
});
