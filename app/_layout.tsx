import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initDatabase } from '../src/db/database';
import { I18nProvider } from '../src/i18n';
import { hasPin } from '../src/auth/authStore';
import PinSetup from '../src/components/PinSetup';
import PinUnlock from '../src/components/PinUnlock';

type AuthState = 'loading' | 'setup' | 'locked' | 'unlocked';

export default function RootLayout() {
  const [authState, setAuthState] = useState<AuthState>('loading');

  useEffect(() => {
    async function init() {
      await initDatabase();
      const pinSet = await hasPin();
      setAuthState(pinSet ? 'locked' : 'setup');
    }
    init();
  }, []);

  if (authState === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (authState === 'setup') {
    return (
      <I18nProvider>
        <StatusBar style="dark" backgroundColor="#F2F2F7" />
        <PinSetup onComplete={() => setAuthState('unlocked')} />
      </I18nProvider>
    );
  }

  if (authState === 'locked') {
    return (
      <I18nProvider>
        <StatusBar style="dark" backgroundColor="#F2F2F7" />
        <PinUnlock onUnlocked={() => setAuthState('unlocked')} />
      </I18nProvider>
    );
  }

  return (
    <I18nProvider>
      <StatusBar style="dark" backgroundColor="#F2F2F7" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#F2F2F7' },
          headerTintColor: '#007AFF',
          headerTitleStyle: { fontWeight: '600', color: '#000000' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F2F2F7' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction/[id]"
          options={{ title: 'Transaction', presentation: 'modal' }}
        />
        <Stack.Screen
          name="category/[id]"
          options={{ title: 'Category', presentation: 'modal' }}
        />
        <Stack.Screen
          name="project/[id]"
          options={{ title: 'Project', presentation: 'modal' }}
        />
        <Stack.Screen
          name="project-detail/[id]"
          options={{ title: 'Project' }}
        />
        <Stack.Screen
          name="phase/[id]"
          options={{ title: 'Phase', presentation: 'modal' }}
        />
        <Stack.Screen
          name="phase-detail/[id]"
          options={{ title: 'Phase' }}
        />
        <Stack.Screen
          name="project-expense/[id]"
          options={{ title: 'Expense', presentation: 'modal' }}
        />
        <Stack.Screen
          name="project-transfer/[id]"
          options={{ title: 'Transfer', presentation: 'modal' }}
        />
        <Stack.Screen
          name="project-category/[id]"
          options={{ title: 'Category', presentation: 'modal' }}
        />
      </Stack>
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
});
