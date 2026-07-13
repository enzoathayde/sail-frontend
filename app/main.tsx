import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import ChatOrganism from "../components/organisms/chat-organism";
import CustomText from "../components/ui/customText";
import { colors, fontFamily } from "../constants/theme";

const Main = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.header_copy}>
          <CustomText declaredFont={fontFamily.bold} style={styles.eyebrow}>
            Sail
          </CustomText>
          <CustomText declaredFont={fontFamily.bold} style={styles.title}>
            Chat de gastos
          </CustomText>
        </View>
        <Pressable onPress={() => router.push("/profile")} style={styles.profile_button}>
          <CustomText declaredFont={fontFamily.bold} style={styles.profile_button_text}>
            ↑
          </CustomText>
        </Pressable>
      </View>
      <ChatOrganism />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: colors.secondary,
  },
  header_copy: {
    gap: 2,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.muted,
  },
  title: {
    fontSize: 30,
    color: colors.inverse,
  },
  profile_button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.inverse,
  },
  profile_button_text: {
    color: colors.primary,
    fontSize: 18,
  },
});

export default Main;
