// Polyfills
import "./src/polyfills";

import { Keyboard, StyleSheet, TouchableWithoutFeedback, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ConnectionProvider } from "./src/utils/ConnectionProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import RootNavigator from "./src/navigators/RootNavigator";
import { ClusterProvider } from "./src/components/cluster/cluster-data-access";
import { useFonts } from 'expo-font';

const queryClient = new QueryClient();

export default function App() {
  const [] = useFonts({
    'SchibstedGrotesk-Regular': require('./assets/fonts/SchibstedGrotesk-Regular.ttf'),
    'SchibstedGrotesk-Medium': require('./assets/fonts/SchibstedGrotesk-Medium.ttf'),
    'SchibstedGrotesk-Bold': require('./assets/fonts/SchibstedGrotesk-Bold.ttf'),
    'SchibstedGrotesk-Black': require('./assets/fonts/SchibstedGrotesk-Black.ttf'),
    'SchibstedGrotesk-SemiBold': require('./assets/fonts/SchibstedGrotesk-SemiBold.ttf'),
  });

  const colorScheme = useColorScheme();
  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };
  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };
  return (
    <QueryClientProvider client={queryClient}>
      <ClusterProvider>
        <ConnectionProvider config={{ commitment: "processed" }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView
              style={[
                styles.shell,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? MD3DarkTheme.colors.background
                      : MD3LightTheme.colors.background,
                },
              ]}
            >
              <PaperProvider
                theme={
                  colorScheme === "dark"
                    ? CombinedDarkTheme
                    : CombinedDefaultTheme
                }
              >
                <NavigationContainer theme={
                  colorScheme === "dark"
                    ? CombinedDarkTheme
                    : CombinedDefaultTheme
                }>
                  <RootNavigator />
                </NavigationContainer>
              </PaperProvider>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </ConnectionProvider>
      </ClusterProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
  },
});
