import { StyleSheet, TextInput } from "react-native";
import { GenericInput } from "../../interfaces/props/genericInput";
import { colors } from "../../constants/theme";

const GenInput = (props: GenericInput) => {
  return (
    <TextInput
      style={styles.input}
      value={props.typeValue}
      onChangeText={props.changeFunction}
      placeholder={props.fieldName}
      placeholderTextColor={colors.muted}
      secureTextEntry={props.secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '93%',
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderColor: colors.smooth,
    backgroundColor: colors.primary,
  },
});

export default GenInput;
