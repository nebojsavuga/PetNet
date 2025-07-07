import 'react-native-reanimated';
import './globals.css'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';

// export default function RootLayout() {
//   return (
//     <Stack>
//       <Stack.Screen name="index" options={{ title: 'Landing' }} />
//       <Stack.Screen name="step1" options={{ title: 'step1' }} />
//       <Stack.Screen name="step2" options={{ title: 'step2' }} />
//       <Stack.Screen name="step3" options={{ title: 'step3' }} />
//     </Stack>
//   );
// }

export default function RootLayout() {
  // return (
  //   <Stack>
  //     <Stack.Screen name="index" options={{ headerShown: false }} />
  //     <Stack.Screen name="about" options={{ headerShown: false }} />
  //     <Stack.Screen name="(auth)" options={{ headerShown: false }} />
  //   </Stack>    
  // );

  return <Slot />
}
