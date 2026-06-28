import { StyleSheet, TextInput } from "react-native";
import { GenericInput } from "../../interfaces/props/genericInput";

const GenInput = (props: GenericInput) => {
  return <TextInput 
    style={styles.input}
    value={props.typeValue} 
    onChangeText={props.changeFunction}
    placeholder={props.fieldName}
  />
}

const styles = StyleSheet.create({
    input: {
    width: '93%',
    height: 40,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
  },
})

export default GenInput;