import { StyleSheet, View } from "react-native";
import CustomText from "../ui/customText";
import { colors, fontFamily } from "../../constants/theme";
import NavHeader from "../molecules/nav-header";
import { Direction } from "../../interfaces/props/navHeaderProps";

const ProfileOrganism = () => {
  return (
    <>
      <NavHeader
        headerDescription="Meu Perfil"
        navTo="main"
        buttonDirection={Direction.left}
      />
      <View style={styles.container}>
        <CustomText declaredFont={fontFamily.bold} style={styles.title}>
          Resumo pessoal
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.text}>
          Esta tela vai concentrar suas informações de perfil e o histórico
          consolidado de gastos.
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.text}>
          Por enquanto, ela existe só como ponto de navegação secundário para o
          fluxo autenticado.
        </CustomText>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sand250,
    padding: 24,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: colors.sand150,
  },
  header_copy: {
    gap: 2,
  },
  title: {
    fontSize: 20,
    color: colors.charcoal900,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.taupe700,
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

export default ProfileOrganism;
