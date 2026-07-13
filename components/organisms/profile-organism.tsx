import { StyleSheet, View } from "react-native";

import CustomText from "../ui/customText";
import { colors, fontFamily } from "../../constants/theme";

const ProfileOrganism = () => {
  return (
    <View style={styles.container}>
      <CustomText declaredFont={fontFamily.bold} style={styles.title}>
        Resumo pessoal
      </CustomText>
      <CustomText declaredFont={fontFamily.regular} style={styles.text}>
        Esta tela vai concentrar suas informações de perfil e o histórico consolidado de gastos.
      </CustomText>
      <CustomText declaredFont={fontFamily.regular} style={styles.text}>
        Por enquanto, ela existe só como ponto de navegação secundário para o fluxo autenticado.
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    color: colors.inverse,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.pale,
  },
});

export default ProfileOrganism;
