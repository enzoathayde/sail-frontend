import { useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import GenInput from "../../components/ui/genInput";
import SecondaryButton from "../../components/ui/secondaryButton";
import CustomText from "../../components/ui/customText";
import { fontFamily } from "../../constants/theme";
import PrimaryButton from "../../components/ui/primaryButton";
import WordLine from "../../components/ui/wordLine";

const Sign = () => {
  const [newUser, setNewUser] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<string>("");
  const [newUserKey, setNewUserKey] = useState<Array<string>>([
    "aqui", "vai", "ter", "os termos", "da chave", "do seu", "cofre", "secreto"]);

  function softReload() {
    setNewUser(!newUser);
  }

  function generateAccessKey() {
    const chave = ["bala", "girafa", "emoji", "blog", "gato", "quadro"];

    setNewUserKey(chave);
  }

  return (
    <>
      {newUser && 
        <View style={styles.container_up}>
          <View style={styles.registry_image_container}>
            <Image source={require('../../assets/sail-draw.svg')}/>
            <CustomText declaredFont={fontFamily.bold} style={styles.text_warn} >
              Vamos iniciar seu cadastro. Gere a chave do seu primeiro acesso.
            </CustomText>
          </View>
          {newUserKey.map((value: string,index: number) => {return (
            <WordLine word={value} lineIndex={index + 1}  key={value}/>
          )
          })}

          <View style={styles.btn_list_container} >
            <PrimaryButton  textDescription="Gerar chave de acesso" onPress={generateAccessKey}/>
            <SecondaryButton textDescription="Não tenho cadastro" onPress={softReload} />
          </View>
        </View>
      }
      {!newUser && 
        <View style={styles.container_in}>
          <Image source={require('../../assets/sail-draw.svg')}/>
          <CustomText declaredFont={fontFamily.bold} style={styles.text_warn} >
              Digite ou cole sua chave de acesso:
            </CustomText>
          <GenInput 
            typeValue={inputKey}
            changeFunction={(t: any) => setInputKey(t)}
            fieldName="aqui você cola a senha do cofre"
          />
          <SecondaryButton textDescription="Não tenho cadastro" onPress={softReload} />
        </View>
      }
    </>
  );
};

const styles = StyleSheet.create({
  container_in: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    gap: 20
  },
  container_up: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems:'center',
    paddingBlock: 25
  },
  text_warn: {
    fontSize: 22,
    paddingInline: 10,
    textAlign: 'center'
  },
  registry_image_container: {
    display: 'flex',
    alignItems: 'center',
    gap: 30, 
    marginBottom: '5%'
  },
  btn_list_container: {
    paddingTop: '20%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: '100%'
  }
})

export default Sign;
