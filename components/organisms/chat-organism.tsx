import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Alert } from "react-native";

import CustomText from "../ui/customText";
import { colors, fontFamily } from "../../constants/theme";
import { ChatMessage } from "../../interfaces/chat";
import { sendChatMessage } from "../../services/chatService";
import { connectChatSocket, disconnectChatSocket } from "../../services/chatSocketService";
import { useAuthStore } from "../../stores/authStore";

const MESSAGE_LIMIT = 280;

function buildMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function extractAssistantText(body: string): string {
  try {
    const parsed = JSON.parse(body);

    if (typeof parsed === "string") {
      return parsed;
    }
    if (parsed && typeof parsed.data === "string") {
      return parsed.data;
    }
    if (parsed && typeof parsed.content === "string") {
      return parsed.content;
    }
  } catch (error) {
    // payload is plain text, fall through
  }

  return body;
}

const ChatOrganism = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const userId = useAuthStore((state) => state.id);
  const userName = useAuthStore((state) => state.userName);

  const scrollToEnd = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, scrollToEnd]);

  useEffect(() => {
    if (userId === null) {
      return;
    }

    connectChatSocket(
      userId,
      (body) => {
        setMessages((previous) => [
          ...previous,
          {
            id: buildMessageId(),
            role: "assistant",
            text: extractAssistantText(body),
            status: "received",
            createdAt: new Date().toISOString(),
          },
        ]);
      },
    );

    return () => {
      disconnectChatSocket();
    };
  }, [userId]);

  async function handleSendMessage() {
    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage || isSending) {
      return;
    }

    if (userId === null) {
      Alert.alert("Sessão expirada", "Entre novamente para continuar a conversa.");
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        id: buildMessageId(),
        role: "user",
        text: trimmedMessage,
        status: "idle",
        createdAt: new Date().toISOString(),
      },
    ]);
    setMessageInput("");
    setIsSending(true);

    try {
      await sendChatMessage(userId, trimmedMessage);
    } catch (error) {
      setMessages((previous) =>
        previous.map((message, index) =>
          index === previous.length - 1 && message.role === "user"
            ? { ...message, status: "error", errorMessage: "Não foi possível enviar a mensagem." }
            : message,
        ),
      );
    } finally {
      setIsSending(false);
    }
  }

  const charactersLeft = MESSAGE_LIMIT - messageInput.length;
  const isOverLimit = charactersLeft < 0;
  const canSend = !isOverLimit && messageInput.trim().length > 0 && !isSending;
  const isWaitingReply = isSending || messages[messages.length - 1]?.status === "loading";

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messages_container}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.empty_state}>
            <CustomText declaredFont={fontFamily.bold} style={styles.empty_state_title}>
              {userName ? `Bem-vindo, ${userName}!` : "Seu controle financeiro começa aqui."}
            </CustomText>
            <CustomText declaredFont={fontFamily.regular} style={styles.empty_state_text}>
              Registre um gasto em linguagem natural.
            </CustomText>
            <CustomText declaredFont={fontFamily.regular} style={styles.empty_state_text}>
              Exemplo: paguei 52 reais no mercado Silva no débito.
            </CustomText>
          </View>
        )}

        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <View key={message.id} style={styles.user_message_row}>
                <View style={styles.user_bubble}>
                  <CustomText declaredFont={fontFamily.regular} style={styles.user_message_text}>
                    {message.text}
                  </CustomText>
                  {message.status === "error" && (
                    <CustomText declaredFont={fontFamily.regular} style={styles.error_notice_text}>
                      {message.errorMessage}
                    </CustomText>
                  )}
                </View>
              </View>
            );
          }

          return (
            <View key={message.id} style={styles.assistant_message_row}>
              <View style={styles.assistant_bubble}>
                <CustomText declaredFont={fontFamily.bold} style={styles.assistant_title}>
                  Assistente
                </CustomText>
                <CustomText declaredFont={fontFamily.regular} style={styles.assistant_message_text}>
                  {message.text}
                </CustomText>
              </View>
            </View>
          );
        })}

        {isWaitingReply && (
          <View style={styles.loading_row}>
            <CustomText declaredFont={fontFamily.regular} style={styles.loading_text}>
              Analisando seu gasto...
            </CustomText>
          </View>
        )}
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
            disabled={!canSend}
            onPress={handleSendMessage}
            style={[styles.send_button, !canSend && styles.send_button_disabled]}
          >
            <CustomText declaredFont={fontFamily.bold} style={styles.send_button_text}>
              {isSending ? "Enviando..." : "Enviar"}
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
    paddingBottom: 12,
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
    gap: 6,
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
  error_notice_text: {
    color: colors.rose100,
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