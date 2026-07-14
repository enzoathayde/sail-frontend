import { StyleSheet, View } from "react-native";
import ChatOrganism from "../components/organisms/chat-organism";
import { colors } from "../constants/theme";
import NavHeader from "../components/molecules/nav-header";
import { Direction } from "../interfaces/props/navHeaderProps";

const Main = () => {
  return (
    <View style={styles.container}>
      <NavHeader 
        headerDescription="Meus Lançamentos"
        navTo="profile"
        buttonDirection={Direction.right}
      />
      <ChatOrganism />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sand150,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.taupe600,
  }
});

export default Main;
