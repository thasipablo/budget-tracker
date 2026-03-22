import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useI18n } from '../../src/i18n';

const ICON_FALLBACK: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  transactions: 'list',
  projects: 'briefcase',
};

const TAB_LABELS: Record<string, string> = {
  index: 'dashboard',
  transactions: 'transactions',
  projects: 'projects',
};

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentRouteName = state.routes[state.index]?.name;
  // Charts belongs to the Dashboard section — keep index tab highlighted
  const activeRouteName = currentRouteName === 'charts' ? 'index' : currentRouteName;

  const renderTab = (route: typeof state.routes[number]) => {
    const isFocused = route.name === activeRouteName;
    const iconName = ICON_FALLBACK[route.name] ?? 'ellipse';
    const labelKey = TAB_LABELS[route.name] ?? route.name;

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
        accessibilityLabel={t(labelKey as any)}
        onPress={onPress}
        style={styles.tab}
      >
        <View style={[styles.tabInner, isFocused && styles.tabInnerActive]}>
          <Ionicons
            name={isFocused ? iconName : (iconName + '-outline') as keyof typeof Ionicons.glyphMap}
            size={22}
            color={isFocused ? '#007AFF' : '#8E8E93'}
          />
          <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
            {t(labelKey as any)}
          </Text>
        </View>
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
            <Text style={styles.popupSection}>{t('projects')}</Text>
            <TouchableOpacity
              style={[styles.popupBtn, styles.projectBtn]}
              onPress={() => {
                setMenuOpen(false);
                router.push('/project/new');
              }}
            >
              <Ionicons name="briefcase" size={18} color="#5856D6" />
              <Text style={[styles.popupLabel, { color: '#5856D6' }]}>{t('newProject')}</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.barRow}>
          {/* Tab items pill */}
          <View style={styles.container}>
            <View style={styles.tabs}>
              {state.routes.filter((r) => r.name in ICON_FALLBACK).map((r) => renderTab(r))}
            </View>
          </View>

          {/* Add button — separate pill */}
          <TouchableOpacity
            style={[styles.addBtn, menuOpen && styles.addBtnOpen]}
            onPress={() => setMenuOpen((o) => !o)}
            activeOpacity={0.85}
          >
            <Ionicons
              name={menuOpen ? 'close' : 'add'}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
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
    paddingHorizontal: 40,
    paddingTop: 8,
    zIndex: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    gap: 2,
  },
  tabInnerActive: {
    backgroundColor: '#E8E8ED',
  },
  tabLabel: {
    fontSize: 8,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.1,
  },
  tabLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  addBtnOpen: {
    backgroundColor: '#3A3A3C',
    shadowColor: '#000',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  expenseBtn: {
    backgroundColor: '#FFF0F0',
  },
  incomeBtn: {
    backgroundColor: '#F0FFF4',
  },
  projectBtn: {
    backgroundColor: '#F0EEFF',
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
      <Tabs.Screen name="transactions" options={{ title: t('transactions'), headerShown: false }} />
      <Tabs.Screen name="categories" options={{ title: t('categories'), headerShown: false }} />
      <Tabs.Screen name="projects" options={{ title: t('projects'), headerShown: false }} />
      <Tabs.Screen name="charts" options={{ title: t('charts'), headerShown: false }} />
    </Tabs>
  );
}

