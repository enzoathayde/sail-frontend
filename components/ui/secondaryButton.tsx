import { StyleSheet,TouchableOpacity } from "react-native"
import { PrimaryButtonProps } from "../../interfaces/props/primaryButtonProps"
import { colors, fontFamily } from "../../constants/theme"
import CustomText from "./customText"


const SecondaryButton = (props: PrimaryButtonProps) => {

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
    color: colors.charcoal900
  },
  touchable: {
    backgroundColor: colors.sand200,
    width: '93%',
    padding: 12,
    borderRadius: 15,
    borderColor: colors.charcoal900,
    borderWidth: 2
  }
})

export default SecondaryButton;
