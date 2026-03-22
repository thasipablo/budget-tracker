import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string; // 'YYYY-MM-DD' or ''
  onChange: (value: string) => void;
  placeholder?: string;
}

function toDate(value: string): Date {
  if (value) {
    const d = new Date(value + 'T12:00:00');
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

function fmt(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function DatePickerField({ value, onChange, placeholder = 'Select date' }: Props) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(toDate(value));

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selected) {
        onChange(fmt(selected));
      }
    } else {
      if (selected) setTempDate(selected);
    }
  };

  const handleDone = () => {
    onChange(fmt(tempDate));
    setShow(false);
  };

  const handleClear = () => {
    onChange('');
    setShow(false);
  };

  const openPicker = () => {
    setTempDate(toDate(value));
    setShow(true);
  };

  return (
    <>
      <TouchableOpacity style={styles.row} onPress={openPicker} activeOpacity={0.7}>
        <Ionicons name="calendar-outline" size={18} color="#8E8E93" style={styles.icon} />
        <Text style={[styles.label, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        {value ? (
          <TouchableOpacity
            onPress={() => onChange('')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color="#C7C7CC" />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        )}
      </TouchableOpacity>

      {/* Android: render directly, auto-dismisses */}
      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}

      {/* iOS: bottom sheet modal with Done/Clear */}
      {Platform.OS === 'ios' && (
        <Modal
          transparent
          visible={show}
          animationType="slide"
          onRequestClose={() => setShow(false)}
        >
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShow(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.clearBtn}>Clear</Text>
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Select Date</Text>
              <TouchableOpacity onPress={handleDone}>
                <Text style={styles.doneBtn}>Done</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={handleChange}
              style={styles.picker}
            />
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  icon: { marginRight: 2 },
  label: { flex: 1, fontSize: 17, color: '#000000' },
  placeholder: { color: '#C7C7CC' },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  sheetTitle: { fontSize: 16, fontWeight: '600', color: '#000000' },
  doneBtn: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
  clearBtn: { fontSize: 16, color: '#FF3B30' },
  picker: { width: '100%' },
});
