import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

const PIN_KEY = 'budget_tracker_pin';

export async function savePin(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, pin);
}

export async function hasPin(): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(PIN_KEY);
  return stored !== null;
}

export async function verifyPin(pin: string): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(PIN_KEY);
  return stored === pin;
}

export async function deletePin(): Promise<void> {
  await SecureStore.deleteItemAsync(PIN_KEY);
}

export async function isBiometricAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return isEnrolled;
}

export async function authenticateWithBiometrics(): Promise<boolean> {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock Budget Tracker',
    fallbackLabel: 'Use PIN',
    disableDeviceFallback: true,
  });
  return result.success;
}
