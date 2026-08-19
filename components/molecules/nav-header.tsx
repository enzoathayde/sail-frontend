import { Pressable, StyleSheet, View } from "react-native";
import CustomText from "../../components/ui/customText";
import { colors, fontFamily } from "../../constants/theme";
import { router } from "expo-router";
import { Direction, NavHeaderProps } from "../../interfaces/props/navHeaderProps";

const NavHeader = (props: NavHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.header_copy}>
        <CustomText declaredFont={fontFamily.bold} style={styles.title}>
          {props.headerDescription}
        </CustomText>
      </View>
      <Pressable
        onPress={() => router.push(`/${props.navTo}`)}
        style={styles.profile_button}
      >
        <CustomText
          declaredFont={fontFamily.bold}
          style={styles.profile_button_text}
        >
          {props.buttonDirection === Direction.left ? "←" : "→"}
        </CustomText>
      </Pressable>
    </View>
  );


};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: colors.sand150,
  },
  title: {
    fontSize: 20,
    color: colors.charcoal900,
  },
  header_copy: {
    gap: 2,
  },
  profile_button: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.charcoal900,
  },
  profile_button_text: {
    color: colors.stone50,
    fontSize: 18,
  },
});

export default NavHeader;
