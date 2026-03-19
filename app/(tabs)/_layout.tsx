import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useI18n } from '../../src/i18n';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  transactions: 'list',
  categories: 'grid',
  charts: 'pie-chart',
};

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  const renderTab = (route: typeof state.routes[number], index: number) => {
    const { options } = descriptors[route.key];
    const label =
      typeof options.tabBarLabel === 'string'
        ? options.tabBarLabel
        : (options.title ?? route.name);
    const isFocused = state.index === state.routes.indexOf(route);
    const iconName = ICON_MAP[route.name] ?? 'ellipse';

    const onPress = () => {
      setMenuOpen(false);
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        style={[styles.tab, isFocused && styles.tabActive]}
      >
        <Ionicons
          name={isFocused ? iconName : (iconName + '-outline') as keyof typeof Ionicons.glyphMap}
          size={24}
          color={isFocused ? '#007AFF' : '#8E8E93'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {menuOpen && (
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)} />
      )}
      <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom - 16, 4) }]}>
        {menuOpen && (
          <View style={styles.popup}>
            <Text style={styles.popupSection}>{t('transactions')}</Text>
            <View style={styles.popupRow}>
              <TouchableOpacity
                style={[styles.popupBtn, styles.expenseBtn]}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/transaction/new?type=expense');
                }}
              >
                <Ionicons name="arrow-down-circle" size={18} color="#FF3B30" />
                <Text style={[styles.popupLabel, { color: '#FF3B30' }]}>{t('expenses')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupBtn, styles.incomeBtn]}
                onPress={() => {
                  setMenuOpen(false);
                  router.push('/transaction/new?type=income');
                }}
              >
                <Ionicons name="arrow-up-circle" size={18} color="#34C759" />
                <Text style={[styles.popupLabel, { color: '#34C759' }]}>{t('income')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <View style={styles.container}>
          {leftRoutes.map((r) => renderTab(r, state.routes.indexOf(r)))}

          {/* Center add button */}
          <View style={styles.centerSlot}>
            <TouchableOpacity
              style={[styles.centerBtn, menuOpen && styles.centerBtnOpen]}
              onPress={() => setMenuOpen((o) => !o)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={menuOpen ? 'close' : 'add'}
                size={26}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {rightRoutes.map((r) => renderTab(r, state.routes.indexOf(r)))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9,
  },
  wrapper: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 20,
    paddingTop: 8,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 999,
  },
  tabActive: {},
  centerSlot: {
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  centerBtnOpen: {
    backgroundColor: '#3A3A3C',
    shadowColor: '#000000',
    shadowOpacity: 0.2,
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 8,
  },
  popupSection: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },
  popupRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  popupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  expenseBtn: {
    backgroundColor: '#FFF0F0',
  },
  incomeBtn: {
    backgroundColor: '#F0FFF4',
  },
  popupLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function TabLayout() {
  const { t } = useI18n();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#F2F2F7' },
        headerTitleStyle: { fontWeight: '700', fontSize: 17, color: '#000000' },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('dashboard'), headerShown: false }} />
      <Tabs.Screen name="transactions" options={{ title: t('transactions') }} />
      <Tabs.Screen name="categories" options={{ title: t('categories') }} />
      <Tabs.Screen name="charts" options={{ title: t('charts'), headerShown: false }} />
    </Tabs>
  );
}
