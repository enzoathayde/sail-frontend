import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import CustomText from "../ui/customText";
import { colors, fontFamily } from "../../constants/theme";
import { ChatMessage } from "../../interfaces/chat";
import { approveSuggestion, rejectSuggestion, sendExpenseMessage } from "../../services/chatService";
import { useChatStore } from "../../stores/chatStore";

const MESSAGE_LIMIT = 280;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function buildId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ErrorNotice({ message }: { message: string }) {
  return (
    <View style={styles.error_notice}>
      <CustomText declaredFont={fontFamily.regular} style={styles.error_notice_text}>
        {message}
      </CustomText>
    </View>
  );
}

function SuggestionCard({
  message,
  onApprove,
  onReject,
}: {
  message: ChatMessage;
  onApprove: (suggestionId: string) => Promise<void>;
  onReject: (suggestionId: string) => Promise<void>;
}) {
  const suggestion = message.suggestion;

  if (!suggestion) {
    return null;
  }

  const isResolved = message.status === "approved" || message.status === "rejected";

  return (
    <View style={styles.card}>
      <View style={styles.card_row}>
        <CustomText declaredFont={fontFamily.bold} style={styles.card_label}>
          Gasto
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.card_value}>
          {suggestion.summary}
        </CustomText>
      </View>
      <View style={styles.card_row}>
        <CustomText declaredFont={fontFamily.bold} style={styles.card_label}>
          Onde
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.card_value}>
          {suggestion.merchant}
        </CustomText>
      </View>
      <View style={styles.card_row}>
        <CustomText declaredFont={fontFamily.bold} style={styles.card_label}>
          Valor
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.card_value}>
          {formatCurrency(suggestion.amountBRL)}
        </CustomText>
      </View>
      <View style={styles.card_row}>
        <CustomText declaredFont={fontFamily.bold} style={styles.card_label}>
          Pagamento
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.card_value}>
          {suggestion.paymentMethod}
        </CustomText>
      </View>

      <View style={styles.card_footer}>
        <CustomText declaredFont={fontFamily.regular} style={styles.card_status}>
          {message.status === "approved" && "Registro aprovado"}
          {message.status === "rejected" && "Registro rejeitado"}
          {message.status === "idle" && "Confirme se a leitura faz sentido"}
          {message.status === "error" && "Não foi possível salvar sua decisão"}
        </CustomText>
      </View>

      <View style={styles.action_row}>
        <Pressable
          disabled={isResolved}
          onPress={() => onReject(suggestion.id)}
          style={[styles.action_button, styles.reject_button, isResolved && styles.action_button_disabled]}
        >
          <CustomText declaredFont={fontFamily.bold} style={styles.reject_button_text}>
            Rejeitar
          </CustomText>
        </Pressable>
        <Pressable
          disabled={isResolved}
          onPress={() => onApprove(suggestion.id)}
          style={[styles.action_button, styles.approve_button, isResolved && styles.action_button_disabled]}
        >
          <CustomText declaredFont={fontFamily.bold} style={styles.approve_button_text}>
            Aprovar
          </CustomText>
        </Pressable>
      </View>
    </View>
  );
}

function MessageBubble({
  message,
  onApprove,
  onReject,
}: {
  message: ChatMessage;
  onApprove: (suggestionId: string) => Promise<void>;
  onReject: (suggestionId: string) => Promise<void>;
}) {
  if (message.role === "user") {
    return (
      <View style={styles.user_message_row}>
        <View style={styles.user_bubble}>
          <CustomText declaredFont={fontFamily.regular} style={styles.user_message_text}>
            {message.text}
          </CustomText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.assistant_message_row}>
      <View style={styles.assistant_bubble}>
        <CustomText declaredFont={fontFamily.bold} style={styles.assistant_title}>
          Sail leu sua mensagem
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.assistant_message_text}>
          {message.text}
        </CustomText>
        {message.status === "loading" && (
          <View style={styles.loading_row}>
            <ActivityIndicator color={colors.inverse} />
            <CustomText declaredFont={fontFamily.regular} style={styles.loading_text}>
              Estruturando o gasto...
            </CustomText>
          </View>
        )}
        {message.suggestion && (
          <SuggestionCard message={message} onApprove={onApprove} onReject={onReject} />
        )}
        {message.errorMessage && <ErrorNotice message={message.errorMessage} />}
      </View>
    </View>
  );
}

const ChatOrganism = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [messageInput, setMessageInput] = useState<string>("");

  const messages = useChatStore((state) => state.messages);
  const isSending = useChatStore((state) => state.isSending);
  const setIsSending = useChatStore((state) => state.setIsSending);
  const addMessage = useChatStore((state) => state.addMessage);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const updateSuggestionStatus = useChatStore((state) => state.updateSuggestionStatus);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  async function handleSendMessage() {
    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage || trimmedMessage.length > MESSAGE_LIMIT || isSending) {
      return;
    }

    const clientMessageId = buildId("user");
    const assistantMessageId = buildId("assistant");

    addMessage({
      id: clientMessageId,
      role: "user",
      text: trimmedMessage,
      status: "idle",
      createdAt: new Date().toISOString(),
    });

    addMessage({
      id: assistantMessageId,
      role: "assistant",
      text: "Recebi sua anotação e estou organizando os campos do gasto.",
      status: "loading",
      createdAt: new Date().toISOString(),
    });

    setMessageInput("");
    setIsSending(true);

    try {
      const response = await sendExpenseMessage(trimmedMessage, clientMessageId);

      updateMessage(assistantMessageId, (message) => ({
        ...message,
        text: response.replyText,
        suggestion: response.suggestion,
        status: "idle",
        errorMessage: undefined,
      }));
    } catch {
      updateMessage(assistantMessageId, (message) => ({
        ...message,
        text: "Não consegui interpretar esse gasto agora.",
        status: "error",
        errorMessage: "Tente enviar novamente em alguns instantes.",
      }));
    } finally {
      setIsSending(false);
    }
  }

  async function handleApproveSuggestion(suggestionId: string) {
    try {
      await approveSuggestion(suggestionId);
      updateSuggestionStatus(suggestionId, "approved");
    } catch {
      Alert.alert("Falha ao aprovar", "Não foi possível confirmar esse gasto agora.");
    }
  }

  async function handleRejectSuggestion(suggestionId: string) {
    try {
      await rejectSuggestion(suggestionId);
      updateSuggestionStatus(suggestionId, "rejected");
    } catch {
      Alert.alert("Falha ao rejeitar", "Não foi possível descartar esse gasto agora.");
    }
  }

  const charactersLeft = MESSAGE_LIMIT - messageInput.length;
  const isOverLimit = charactersLeft < 0;
  const isDisabled = isSending || !messageInput.trim() || isOverLimit;

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <CustomText declaredFont={fontFamily.bold} style={styles.hero_title}>
          Registre um gasto em linguagem natural
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.hero_text}>
          Exemplo: paguei 52 reais no mercado Silva no débito.
        </CustomText>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messages_container}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.empty_state}>
            <CustomText declaredFont={fontFamily.bold} style={styles.empty_state_title}>
              Seu chat começa aqui
            </CustomText>
            <CustomText declaredFont={fontFamily.regular} style={styles.empty_state_text}>
              Envie uma frase curta e a Sail devolve um card estruturado para você aprovar ou rejeitar.
            </CustomText>
          </View>
        )}
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onApprove={handleApproveSuggestion}
            onReject={handleRejectSuggestion}
          />
        ))}
      </ScrollView>

      <View style={styles.composer}>
        <TextInput
          multiline
          maxLength={MESSAGE_LIMIT + 40}
          onChangeText={setMessageInput}
          placeholder="Descreva um gasto..."
          placeholderTextColor={colors.muted}
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
            disabled={isDisabled}
            onPress={handleSendMessage}
            style={[styles.send_button, isDisabled && styles.send_button_disabled]}
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
    backgroundColor: colors.secondary,
  },
  hero: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#E7E0D4",
    borderBottomWidth: 1,
    borderBottomColor: "#D7CFBF",
    gap: 6,
  },
  hero_title: {
    fontSize: 24,
    color: colors.inverse,
  },
  hero_text: {
    fontSize: 14,
    color: colors.pale,
    lineHeight: 20,
  },
  messages_container: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 14,
  },
  empty_state: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DED7CA",
    gap: 8,
  },
  empty_state_title: {
    fontSize: 18,
    color: colors.inverse,
  },
  empty_state_text: {
    fontSize: 14,
    color: colors.pale,
    lineHeight: 20,
  },
  user_message_row: {
    alignItems: "flex-end",
  },
  user_bubble: {
    maxWidth: "84%",
    backgroundColor: colors.inverse,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  user_message_text: {
    color: colors.primary,
    lineHeight: 20,
  },
  assistant_message_row: {
    alignItems: "flex-start",
  },
  assistant_bubble: {
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#DED7CA",
    gap: 10,
  },
  assistant_title: {
    fontSize: 16,
    color: colors.inverse,
  },
  assistant_message_text: {
    color: colors.pale,
    lineHeight: 20,
  },
  loading_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loading_text: {
    color: colors.pale,
  },
  card: {
    backgroundColor: "#F3EEE5",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DED7CA",
    padding: 14,
    gap: 10,
  },
  card_row: {
    gap: 4,
  },
  card_label: {
    fontSize: 12,
    color: colors.muted,
    textTransform: "uppercase",
  },
  card_value: {
    fontSize: 16,
    color: colors.inverse,
    lineHeight: 22,
  },
  card_footer: {
    paddingTop: 4,
  },
  card_status: {
    color: colors.pale,
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
    backgroundColor: "#E8DED1",
    borderWidth: 1,
    borderColor: "#C8BBA8",
  },
  approve_button: {
    backgroundColor: colors.inverse,
  },
  reject_button_text: {
    color: colors.inverse,
  },
  approve_button_text: {
    color: colors.primary,
  },
  error_notice: {
    borderRadius: 14,
    backgroundColor: "#FDE8E5",
    padding: 12,
  },
  error_notice_text: {
    color: "#8A2F23",
  },
  composer: {
    borderTopWidth: 1,
    borderTopColor: "#DED7CA",
    backgroundColor: colors.primary,
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
    borderColor: "#CEC6B9",
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
    backgroundColor: "#FFFDF8",
  },
  input_error: {
    borderColor: "#B33F32",
  },
  composer_footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  counter_text: {
    color: colors.pale,
    fontSize: 12,
  },
  counter_text_error: {
    color: "#B33F32",
  },
  send_button: {
    backgroundColor: colors.inverse,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  send_button_disabled: {
    opacity: 0.45,
  },
  send_button_text: {
    color: colors.primary,
  },
});

export default ChatOrganism;
