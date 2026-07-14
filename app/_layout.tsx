
import { useFonts } from "@expo-google-fonts/inter";
import { Stack } from "expo-router";

import { fontsToLoad } from "../constants/theme";

const RootLayout = () => {
  const [loaded] = useFonts(fontsToLoad);

  if (!loaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile"/>
    </Stack>
  );
};

export default RootLayout;
