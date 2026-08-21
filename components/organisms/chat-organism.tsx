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
import { AssistantPayload, ChatMessage, ExpenseData } from "../../interfaces/chat";
import ExpenseCard from "../molecules/expense-card";
import ExpenseEditModal from "../molecules/expense-edit-modal";
import { getChatHistory, sendChatMessage } from "../../services/chatService";
import { connectChatSocket, disconnectChatSocket } from "../../services/chatSocketService";
import { createTransaction } from "../../services/transactionService";
import { parseAssistantPayload } from "../../utils/assistantPayload";
import { useAuthStore } from "../../stores/authStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const MESSAGE_LIMIT = 280;

function buildMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toChatMessage(role: "user" | "assistant", parsed: AssistantPayload, id: string, createdAt: string): ChatMessage {
  return {
    id,
    role,
    text: parsed.kind === "text" ? (parsed.text ?? "") : parsed.message,
    status: parsed.kind === "error" ? "error" : "received",
    errorMessage: parsed.kind === "error" ? parsed.message : undefined,
    expense: parsed.kind === "expense" ? parsed.expense : null,
    createdAt,
  };
}

const ChatOrganism = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isWaitingForReply, setIsWaitingForReply] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const userId = useAuthStore((state) => state.id);
  const userName = useAuthStore((state) => state.userName);

  const editingMessage = messages.find((message) => message.id === editingId) ?? null;

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

    let cancelled = false;

    getChatHistory()
      .then((history) => {
        if (cancelled) {
          return;
        }

        setMessages(
          history.map((message) => {
            const parsed = parseAssistantPayload(message.content);

            return toChatMessage(
              message.sender === "USER" ? "user" : "assistant",
              parsed,
              String(message.id),
              message.createdAt,
            );
          }),
        );
      })
      .catch(() => {
        // mantém a conversa vazia
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (userId === null) {
      return;
    }

    connectChatSocket(
      userId,
      (body) => {
        const parsed = parseAssistantPayload(body);

        setMessages((previous) => [
          ...previous,
          toChatMessage("assistant", parsed, buildMessageId(), new Date().toISOString()),
        ]);
        setIsWaitingForReply(false);
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
    setIsWaitingForReply(true);

    try {
      await sendChatMessage(trimmedMessage);
    } catch (error) {
      setMessages((previous) =>
        previous.map((message, index) =>
          index === previous.length - 1 && message.role === "user"
            ? { ...message, status: "error", errorMessage: "Não foi possível enviar a mensagem." }
            : message,
        ),
      );
      setIsWaitingForReply(false);
    } finally {
      setIsSending(false);
    }
  }

  async function handleApprove(id: string) {
    const message = messages.find((item) => item.id === id);

    if (!message?.expense) {
      return;
    }

    try {
      await createTransaction(message.expense);
    } catch (error) {
      Alert.alert("Falha ao registrar", "Não foi possível registrar o gasto. Tente novamente.");
      return;
    }

    setMessages((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: "approved" } : item,
      ),
    );
  }

  function handleReject(id: string) {
    setMessages((previous) =>
      previous.map((message) =>
        message.id === id ? { ...message, status: "rejected" } : message,
      ),
    );
  }

  function handleEditSave(updated: ExpenseData) {
    if (editingId === null) {
      return;
    }

    setMessages((previous) =>
      previous.map((message) =>
        message.id === editingId ? { ...message, expense: updated } : message,
      ),
    );
    setEditingId(null);
  }

  const charactersLeft = MESSAGE_LIMIT - messageInput.length;
  const isOverLimit = charactersLeft < 0;
  const canSend = !isOverLimit && messageInput.trim().length > 0 && !isSending;
  const isWaitingReply = isSending || isWaitingForReply;

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
              <View
                style={[
                  styles.assistant_bubble,
                  message.status === "error" && styles.assistant_bubble_error,
                ]}
              >
              <View style={styles.card_line}>
                <CustomText declaredFont={fontFamily.bold} style={styles.assistant_title}>
                  Assistente
                </CustomText>
                {message.expense && (
                  <Pressable
                    hitSlop={8}
                    onPress={() => setEditingId(message.id)}
                    style={styles.edit_icon_button}
                  >
                    <MaterialCommunityIcons
                      name="pencil-circle"
                      size={26}
                      color={colors.charcoal900}
                    />
                  </Pressable>
                )}
              </View>
                {message.expense ? (
                  <ExpenseCard
                    expense={message.expense}
                    status={message.status}
                    onApprove={() => handleApprove(message.id)}
                    onReject={() => handleReject(message.id)}
                  />
                ) : (
                  <CustomText
                    declaredFont={fontFamily.regular}
                    style={[
                      styles.assistant_message_text,
                      message.status === "error" && styles.assistant_message_error,
                    ]}
                  >
                    {message.text}
                  </CustomText>
                )}
              </View>
            </View>
          );
        })}

        {isWaitingReply && (
          <View style={styles.assistant_message_row}>
            <View style={styles.assistant_bubble}>
              <CustomText declaredFont={fontFamily.bold} style={styles.assistant_title}>
                Assistente
              </CustomText>
              <CustomText declaredFont={fontFamily.regular} style={styles.loading_text}>
                Analisando seu gasto...
              </CustomText>
            </View>
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

      <ExpenseEditModal
        visible={editingId !== null}
        expense={editingMessage?.expense ?? null}
        onSave={handleEditSave}
        onClose={() => setEditingId(null)}
      />
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
  card_line: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  edit_icon_button: {
    padding: 2,
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
  assistant_bubble_error: {
    borderColor: colors.red700,
    backgroundColor: colors.rose100,
  },
  assistant_message_error: {
    color: colors.red700,
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