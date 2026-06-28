import { useState, useEffect} from "react";
import Welcome from "./welcome/welcome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Sign from "./sign/sign";

async function getWelcomeAsyncItem(): Promise<string | null> {

  const response = AsyncStorage.getItem('welcome');

  return response;
}
async function getJwtAsyncItem(): Promise<string | null> {

  const response = AsyncStorage.getItem('jwt');

  return response;
}

const Index = () => {

  const [hasAlreadyWelcome, setHasAlreadyWelcome] = useState<string | null>(null);
  const [loggedUser, setLoggedUser] = useState<string | null>(null);

  useEffect(() => {
    const getWelcome = async () => {
      const welcomeResult = await getWelcomeAsyncItem()
      setHasAlreadyWelcome(welcomeResult);
    }
    const getLogged = async () => {
      const loggedResult = await getJwtAsyncItem()
      setLoggedUser(loggedResult);
    }
    
    getWelcome();
    getLogged();
  },[])

  return (
    <>
      { !hasAlreadyWelcome && <Welcome /> }
      { hasAlreadyWelcome && !loggedUser && <Sign /> }
    </>
  )


}

export default Index;