import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import CustomText from "../ui/customText";
import { colors, fontFamily } from "../../constants/theme";
const MESSAGE_LIMIT = 280;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function handleSendMessage() {
  console.log('hi')
}

const ChatOrganism = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);


  const charactersLeft = MESSAGE_LIMIT - messageInput.length;
  const isOverLimit = charactersLeft < 0;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messages_container}
        showsVerticalScrollIndicator={false}
      >        
        <View style={styles.empty_state}>
          <CustomText declaredFont={fontFamily.bold} style={styles.empty_state_title}>
            Seu controle financeiro começa aqui.
          </CustomText>
          <CustomText declaredFont={fontFamily.regular} style={styles.empty_state_text}>
            Registre um gasto em linguagem natural.
          </CustomText>
          <CustomText declaredFont={fontFamily.regular} style={styles.empty_state_text}>
              Exemplo: paguei 52 reais no mercado Silva no débito.
          </CustomText>
        </View>
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          multiline
          maxLength={MESSAGE_LIMIT + 40}
          onChangeText={setMessageInput}
          placeholder="Descreva um gasto..."
          placeholderTextColor={colors.taupe600}
          style={[styles.input, isOverLimit && styles.input_error]}
          value={messageInput}
        />
        <View style={styles.composer_footer}>
          <CustomText
            declaredFont={fontFamily.regular}
            style={[styles.counter_text, isOverLimit && styles.counter_text_error]}
          >
            {charactersLeft >= 0 ? `${charactersLeft} caracteres restantes` : "Limite excedido"}
          </CustomText>
          <Pressable
            disabled={false}
            onPress={handleSendMessage}
            style={[styles.send_button, true && styles.send_button_disabled]}
          >
            <CustomText declaredFont={fontFamily.bold} style={styles.send_button_text}>
              {false ? "Enviando..." : "Enviar"}
            </CustomText>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.sand250,
  },
  hero: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.sand250,
    borderBottomWidth: 1,
    borderBottomColor: colors.sand400,
    gap: 6,
  },
  hero_title: {
    fontSize: 20,
    color: colors.charcoal900,
  },
  hero_text: {
    fontSize: 14,
    color: colors.taupe700,
    lineHeight: 20,
  },
  messages_container: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 14,
  },
  empty_state: {
    backgroundColor: colors.stone50,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.sand350,
  },
  empty_state_title: {
    fontSize: 18,
    color: colors.charcoal900,
    paddingBottom: 12
  },
  empty_state_text: {
    fontSize: 14,
    color: colors.taupe700,
  },
  user_message_row: {
    alignItems: "flex-end",
  },
  user_bubble: {
    maxWidth: "84%",
    backgroundColor: colors.charcoal900,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  user_message_text: {
    color: colors.stone50,
    lineHeight: 20,
  },
  assistant_message_row: {
    alignItems: "flex-start",
  },
  assistant_bubble: {
    width: "100%",
    backgroundColor: colors.stone50,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.sand350,
    gap: 10,
  },
  assistant_title: {
    fontSize: 16,
    color: colors.charcoal900,
  },
  assistant_message_text: {
    color: colors.taupe700,
    lineHeight: 20,
  },
  loading_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loading_text: {
    color: colors.taupe700,
  },
  card: {
    backgroundColor: colors.sand100,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.sand350,
    padding: 14,
    gap: 10,
  },
  card_row: {
    gap: 4,
  },
  card_label: {
    fontSize: 12,
    color: colors.taupe600,
    textTransform: "uppercase",
  },
  card_value: {
    fontSize: 16,
    color: colors.charcoal900,
    lineHeight: 22,
  },
  card_footer: {
    paddingTop: 4,
  },
  card_status: {
    color: colors.taupe700,
  },
  action_row: {
    flexDirection: "row",
    gap: 10,
    paddingTop: 4,
  },
  action_button: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  action_button_disabled: {
    opacity: 0.55,
  },
  reject_button: {
    backgroundColor: colors.sand300,
    borderWidth: 1,
    borderColor: colors.sand500,
  },
  approve_button: {
    backgroundColor: colors.charcoal900,
  },
  reject_button_text: {
    color: colors.charcoal900,
  },
  approve_button_text: {
    color: colors.stone50,
  },
  error_notice: {
    borderRadius: 14,
    backgroundColor: colors.rose100,
    padding: 12,
  },
  error_notice_text: {
    color: colors.red800,
  },
  composer: {
    borderTopWidth: 1,
    borderTopColor: colors.sand350,
    backgroundColor: colors.stone50,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 10,
  },
  input: {
    minHeight: 88,
    maxHeight: 148,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.sand450,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
    backgroundColor: colors.ivory50,
  },
  input_error: {
    borderColor: colors.red700,
  },
  composer_footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  counter_text: {
    color: colors.taupe700,
    fontSize: 12,
  },
  counter_text_error: {
    color: colors.red700,
  },
  send_button: {
    backgroundColor: colors.charcoal900,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  send_button_disabled: {
    opacity: 0.45,
  },
  send_button_text: {
    color: colors.stone50,
  },
});

export default ChatOrganism;
