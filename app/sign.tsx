import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import GenInput from "../components/ui/genInput";
import SecondaryButton from "../components/ui/secondaryButton";
import CustomText from "../components/ui/customText";
import { colors, fontFamily } from "../constants/theme";
import PrimaryButton from "../components/ui/primaryButton";
import WordLine from "../components/ui/wordLine";
import { authenticateVaultUser, registerVaultUser } from "../services/authService";
import { useAuthStore } from "../stores/authStore";
import { Session } from "../interfaces/auth";

const Sign = () => {
  const [newUser, setNewUser] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newUserKey, setNewUserKey] = useState<Array<string>>([]);
  const [generatedSession, setGeneratedSession] = useState<Session | null>(null);
  const setSession = useAuthStore((state) => state.setSession);

  function softReload() {
    setNewUser(!newUser);
  }

  async function generateAccessKey() {
    setIsSubmitting(true);

    try {
      const generated = await registerVaultUser();

      setNewUserKey(generated.vaultKey.split(" "));
      setGeneratedSession({
        id: generated.id,
        userName: generated.userName,
        token: generated.token,
        vaultKey: generated.vaultKey,
      });
    } catch (error) {
      Alert.alert("Erro ao gerar chave", "Não foi possível gerar sua chave de acesso. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function enterWithKey() {
    if (!inputKey.trim()) {
      Alert.alert("Chave obrigatória", "Digite sua chave de acesso antes de continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const authenticated = await authenticateVaultUser(inputKey.trim());

      await setSession({
        id: authenticated.id,
        userName: authenticated.userName,
        token: authenticated.token,
      });

      router.replace("/main");
    } catch (error) {
      Alert.alert("Falha na autenticação", "Chave inválida ou não encontrada. Confira e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function continueWithGeneratedKey() {
    if (!generatedSession) {
      Alert.alert("Chave obrigatória", "Gere sua chave de acesso antes de continuar.");
      return;
    }

    setIsSubmitting(true);

    try {
      await setSession(generatedSession);

      router.replace("/main");
    } catch (error) {
      Alert.alert("Erro ao entrar", "Não foi possível concluir seu cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {newUser && (
        <View style={styles.container_up}>
          <View style={styles.registry_image_container}>
            <Image source={require("../assets/sail-draw.svg")} />
            <CustomText declaredFont={fontFamily.bold} style={styles.text_warn}>
              Vamos iniciar seu cadastro. Gere a chave do seu primeiro acesso.
            </CustomText>
          </View>
          {newUserKey.length > 0 &&
            newUserKey.map((value: string, index: number) => {
              return <WordLine word={value} lineIndex={index + 1} key={`${value}-${index}`} />;
            })}

          <View style={styles.btn_list_container}>
            <PrimaryButton
              textDescription={isSubmitting ? "Gerando..." : "Gerar chave de acesso"}
              onPress={generateAccessKey}
            />
            <PrimaryButton
              textDescription={isSubmitting ? "Entrando..." : "Continuar"}
              onPress={continueWithGeneratedKey}
            />
            <SecondaryButton textDescription="Já tenho cadastro" onPress={softReload} />
          </View>
        </View>
      )}
      {!newUser && (
        <View style={styles.container_in}>
          <Image source={require("../assets/sail-draw.svg")} />
          <CustomText declaredFont={fontFamily.bold} style={styles.text_warn}>
            Digite ou cole sua chave de acesso:
          </CustomText>
          <GenInput
            typeValue={inputKey}
            changeFunction={setInputKey}
            fieldName="aqui você cola a senha do cofre"
            secureTextEntry
          />
          <PrimaryButton
            textDescription={isSubmitting ? "Entrando..." : "Entrar"}
            onPress={enterWithKey}
          />
          <SecondaryButton textDescription="Não tenho cadastro" onPress={softReload} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container_in: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    backgroundColor: colors.sand150,
  },
  container_up: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBlock: 25,
    backgroundColor: colors.sand150,
  },
  text_warn: {
    fontSize: 22,
    paddingInline: 10,
    textAlign: "center",
  },
  registry_image_container: {
    display: "flex",
    alignItems: "center",
    gap: 30,
    marginBottom: "5%",
  },
  btn_list_container: {
    paddingTop: "20%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
});

export default Sign;