import { Pressable, StyleSheet, View } from "react-native";

import CustomText from "../ui/customText";
import { colors, fontFamily } from "../../constants/theme";
import { ExpenseData, MessageStatus } from "../../interfaces/chat";

interface ExpenseCardProps {
  expense: ExpenseData;
  status: MessageStatus;
  onApprove: () => void;
  onReject: () => void;
}

function formatParcelas(parcelas?: string | number | null): string | null {
  if (parcelas === null || parcelas === undefined || parcelas === "") {
    return null;
  }

  const quantity = Number(parcelas);
  const formatted = Number.isInteger(quantity) ? String(quantity) : String(parcelas);

  return `${formatted}x`;
}

const ExpenseCard = ({ expense, status, onApprove, onReject }: ExpenseCardProps) => {
  const resolved = status === "approved" || status === "rejected";
  const parcelas = formatParcelas(expense.parcelas);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <CustomText declaredFont={fontFamily.bold} style={styles.label}>
          Estabelecimento
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.value}>
          {expense.estabelecimento ?? "—"}
        </CustomText>
      </View>

      {expense.categoria && (
        <View style={styles.row}>
          <CustomText declaredFont={fontFamily.bold} style={styles.label}>
            Categoria
          </CustomText>
          <CustomText declaredFont={fontFamily.regular} style={styles.value}>
            {expense.categoria}
          </CustomText>
        </View>
      )}

      <View style={styles.row}>
        <CustomText declaredFont={fontFamily.bold} style={styles.label}>
          Valor
        </CustomText>
        <CustomText declaredFont={fontFamily.bold} style={styles.value}>
          R$ {expense.valor ?? "—"}
        </CustomText>
      </View>

      <View style={styles.row}>
        <CustomText declaredFont={fontFamily.bold} style={styles.label}>
          Pagamento
        </CustomText>
        <CustomText declaredFont={fontFamily.regular} style={styles.value}>
          {expense.metodoPagamento ?? "—"}
          {parcelas ? ` · ${parcelas}` : ""}
        </CustomText>
      </View>

      {resolved && (
        <View style={styles.status_banner}>
          <CustomText declaredFont={fontFamily.bold} style={styles.status_text}>
            {status === "approved" ? "Gasto registrado" : "Registro descartado"}
          </CustomText>
        </View>
      )}

      {!resolved && (
        <View style={styles.actions}>
          <Pressable onPress={onReject} style={[styles.action_button, styles.reject_button]}>
            <CustomText declaredFont={fontFamily.bold} style={styles.reject_text}>
              Recusar
            </CustomText>
          </Pressable>
          <Pressable onPress={onApprove} style={[styles.action_button, styles.approve_button]}>
            <CustomText declaredFont={fontFamily.bold} style={styles.approve_text}>
              Aprovar
            </CustomText>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.ivory50,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.sand350,
    padding: 14,
    gap: 10,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  label: {
    fontSize: 13,
    color: colors.taupe600,
  },
  value: {
    fontSize: 14,
    color: colors.charcoal900,
    flexShrink: 1,
    textAlign: "right",
  },
  status_banner: {
    backgroundColor: colors.sand200,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  status_text: {
    fontSize: 13,
    color: colors.taupe700,
  },
  actions: {
    paddingTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  action_button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  approve_button: {
    backgroundColor: colors.charcoal900,
  },
  approve_text: {
    color: colors.stone50,
    fontSize: 13,
  },
  reject_button: {
    backgroundColor: colors.rose100,
    borderWidth: 1,
    borderColor: colors.red700,
  },
  reject_text: {
    color: colors.red700,
    fontSize: 13,
  },
});

export default ExpenseCard;