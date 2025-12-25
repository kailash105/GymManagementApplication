import React from 'react';
import { MockDatabase } from './src/services/storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './src/theme/theme';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  React.useEffect(() => {
    const init = async () => {
      try {
        await MockDatabase.init();
      } catch (e) {
        console.error('Failed to init DB', e);
      }
    };
    init();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
