import { Image, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import PrimaryButton from "../components/ui/primaryButton";
import CustomText from "../components/ui/customText";
import { fontFamily } from "../constants/theme";

async function startRegistry() {
  await AsyncStorage.setItem("welcome", "ok");
  router.replace("/sign");
}

const Welcome = () => {
  return (
    <View style={styles.main_container}>
      <View style={styles.app_description_container}>
        <Image source={require("../assets/sail-horizontal.svg")} />
        <CustomText declaredFont={fontFamily.regular} style={styles.text_description}>
          Seu controlador pessoal de finanças.
        </CustomText>
      </View>
      <PrimaryButton textDescription="Vamos começar" onPress={startRegistry} />
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBlock: "5%",
  },
  app_description_container: {
    flex: 1,
    gap: "2.5%",
    paddingTop: "35%",
  },
  text_description: {
    fontSize: 15,
  },
});

export default Welcome;
