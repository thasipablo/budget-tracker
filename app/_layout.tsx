import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initDatabase } from '../src/db/database';
import { I18nProvider } from '../src/i18n';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
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
