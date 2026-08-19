import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import CustomText from "../ui/customText";
import GenInput from "../ui/genInput";
import { colors, fontFamily } from "../../constants/theme";
import { ExpenseData } from "../../interfaces/chat";

interface ExpenseEditModalProps {
  visible: boolean;
  expense: ExpenseData | null;
  onSave: (updated: ExpenseData) => void;
  onClose: () => void;
}

const ExpenseEditModal = ({ visible, expense, onSave, onClose }: ExpenseEditModalProps) => {
  const [valor, setValor] = useState<string>("");
  const [estabelecimento, setEstabelecimento] = useState<string>("");

  useEffect(() => {
    if (visible && expense) {
      setValor(expense.valor ?? "");
      setEstabelecimento(expense.estabelecimento ?? "");
    }
  }, [visible, expense]);

  function handleSave() {
    if (!expense) {
      return;
    }

    onSave({
      ...expense,
      valor: valor.trim() || expense.valor,
      estabelecimento: estabelecimento.trim() || expense.estabelecimento,
    });
  }

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <CustomText declaredFont={fontFamily.bold} style={styles.title}>
            Editar gasto
          </CustomText>

          <View style={styles.field}>
            <CustomText declaredFont={fontFamily.bold} style={styles.label}>
              Valor
            </CustomText>
            <GenInput typeValue={valor} changeFunction={setValor} fieldName="valor do gasto" />
          </View>

          <View style={styles.field}>
            <CustomText declaredFont={fontFamily.bold} style={styles.label}>
              Estabelecimento
            </CustomText>
            <GenInput
              typeValue={estabelecimento}
              changeFunction={setEstabelecimento}
              fieldName="nome do estabelecimento"
            />
          </View>

          <View style={styles.actions}>
            <Pressable onPress={handleSave} style={[styles.button, styles.save_button]}>
              <CustomText declaredFont={fontFamily.bold} style={styles.save_text}>
                Salvar
              </CustomText>
            </Pressable>
            <Pressable onPress={onClose} style={[styles.button, styles.cancel_button]}>
              <CustomText declaredFont={fontFamily.bold} style={styles.cancel_text}>
                Cancelar
              </CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(26, 26, 24, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modal: {
    width: "100%",
    backgroundColor: colors.sand150,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 18,
    color: colors.charcoal900,
    textAlign: "center",
  },
  field: {
    gap: 8,
    alignItems: "center",
    width: "100%",
  },
  label: {
    fontSize: 13,
    color: colors.taupe700,
    alignSelf: "flex-start",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  save_button: {
    backgroundColor: colors.charcoal900,
  },
  save_text: {
    color: colors.stone50,
    fontSize: 15,
  },
  cancel_button: {
    backgroundColor: colors.sand200,
    borderWidth: 1,
    borderColor: colors.sand450,
  },
  cancel_text: {
    color: colors.taupe700,
    fontSize: 15,
  },
});

export default ExpenseEditModal;