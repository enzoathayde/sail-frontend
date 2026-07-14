import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";

import Welcome from "./welcome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sign from "./sign";
import { colors } from "../constants/theme";

async function getWelcomeAsyncItem(): Promise<string | null> {
  const response = AsyncStorage.getItem("welcome");

  return response;
}
async function getJwtAsyncItem(): Promise<string | null> {
  const response = AsyncStorage.getItem("jwt");

  return response;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasAlreadyWelcome, setHasAlreadyWelcome] = useState<boolean>(false);
  const [loggedUser, setLoggedUser] = useState<boolean>(false);

  useEffect(() => {
    const hydrate = async () => {
      const [welcomeResult, loggedResult] = await Promise.all([
        getWelcomeAsyncItem(),
        getJwtAsyncItem(),
      ]);

      setHasAlreadyWelcome(Boolean(welcomeResult));
      setLoggedUser(Boolean(loggedResult));
      setIsLoading(false);
    };

    hydrate();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading_container}>
        <ActivityIndicator color={colors.charcoal900} size="large" />
      </View>
    );
  }

  if (!hasAlreadyWelcome) {
    return <Welcome />;
  }

  if (!loggedUser) {
    return <Sign />;
  }

  return <Redirect href="/main" />;
};

const styles = StyleSheet.create({
  loading_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.stone50,
  },
});

export default Index;
