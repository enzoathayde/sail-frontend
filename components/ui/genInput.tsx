import { StyleSheet, TextInput } from "react-native";
import { GenericInput } from "../../interfaces/props/genericInput";
import { colors } from "../../constants/theme";

const GenInput = (props: GenericInput) => {
  return (
    <TextInput
      style={styles.input}
      value={props.typeValue}
      onChangeText={(text) => props.changeFunction(props.maskFunction ? props.maskFunction(text) : text)}
      placeholder={props.fieldName}
      placeholderTextColor={colors.taupe600}
      secureTextEntry={props.secureTextEntry}
      keyboardType={props.maskFunction ? "number-pad" : undefined}
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
    borderColor: colors.sand200,
    backgroundColor: colors.stone50,
  },
});

export default GenInput;