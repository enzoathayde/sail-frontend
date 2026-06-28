import { Text as RNText, StyleSheet} from "react-native"
import { AppTextProps } from "../../interfaces/props/customTextProps";

const CustomText = ({ declaredFont, ...props }: AppTextProps) => {
  return <RNText {...props} style={[{ fontFamily: declaredFont }, props.style]} />
}


export default CustomText;