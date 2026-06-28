import { StyleSheet, View } from "react-native"
import { colors, fontFamily } from "../../constants/theme"
import { WordLineProps } from "../../interfaces/props/wordLineProps"
import CustomText from "./customText"

const WordLine = (props: WordLineProps) => {

  return (
    <View style={styles.container}>    
      <CustomText declaredFont={fontFamily.regular} style={styles.font_text}>
        {props.lineIndex}
      </CustomText>
      <CustomText declaredFont={fontFamily.regular} style={styles.font_text}> 
        {props.word}
      </CustomText>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 7,
    width: '93%'
  },
  font_text: {
    fontSize: 20
  }
})

export default WordLine;