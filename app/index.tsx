import { useState, useEffect} from "react";
import Welcome from "./welcome/welcome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sign from "./sign/sign";

async function getWelcomeAsyncItem(): Promise<string | null> {

  const response = AsyncStorage.getItem('welcome');

  return response;
}

const Index = () => {

  const [hasAlreadyWelcome, setHasAlreadyWelcome] = useState<string | null>(null);

  useEffect(() => {
    const getWelcome = async () => {
      const welcomeResult = await getWelcomeAsyncItem()
      setHasAlreadyWelcome(welcomeResult);
    }
    getWelcome();

  },[])

  return (
    <>
      { !hasAlreadyWelcome && <Welcome /> }
      {  hasAlreadyWelcome && <Sign /> }
    </>
  )


}

export default Index;