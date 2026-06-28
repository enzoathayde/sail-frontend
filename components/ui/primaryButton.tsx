import { StyleSheet,TouchableOpacity } from "react-native"
import { PrimaryButtonProps } from "../../interfaces/props/primaryButtonProps"
import { colors, fontFamily } from "../../constants/theme"
import CustomText from "./customText"


const PrimaryButton = (props: PrimaryButtonProps) => {

  return (
    <TouchableOpacity onPress={props.onPress} style={styles.touchable}>
      <CustomText style={styles.text} declaredFont={fontFamily.bold}>{props.textDescription}</CustomText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.primary
  },
  touchable: {
    backgroundColor: colors.inverse,
    width: '93%',
    padding: 15,
    borderRadius: 15
  }
})

export default PrimaryButton;