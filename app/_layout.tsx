
import { useFonts } from '@expo-google-fonts/inter';
import { Slot } from 'expo-router'
import { fontsToLoad } from '../constants/theme';

const RootLayout = () => {
  const [ loaded ] = useFonts(fontsToLoad)

  if (!loaded) return null;

  return <Slot />
}

export default RootLayout;

