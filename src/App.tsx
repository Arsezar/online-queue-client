import React, {useEffect, useState} from "react"
import { Layout, message } from 'antd';
import SiderBar from "./components/Sider/SiderBar";
import SiteLayout from "./components/SiteLayout/SiteLayout";
import { AuthContext } from "./context/context";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter/AppRouter";
import axiosAPI from "./api/api.service";

export default function App() {
	const [isAuth, setIsAuth] = useState<boolean>(false);
  const [current, setCurrent] = useState<string>('1');
  const [userData, setUserData] = useState('');
  const [messageService, contextHolder] = message.useMessage();

	useEffect(() =>  {
    console.log('APP USEEFFECT')
    authProfileGetVerify();
  }, [])

  async function authProfileGetVerify() {
    const token = localStorage.getItem('AuthToken');
    if (token) {
      axiosAPI.getProfile()
        .then((response: any) => {
          setIsAuth(true);
          console.log('auth is true');
          axiosAPI.getUser(response.data.username)
          .then((response: any) => {
            setUserData(response.data);
            console.log('success!!!!')
          })
          .catch((error) => {
            console.log(error);
          })
        })
        .catch((error: any) => {
          console.log(error);
        })
    }
  }

    return (
        <AuthContext.Provider value={{ 
            isAuth, setIsAuth, messageService, axiosAPI, current, setCurrent, userData, setUserData, authProfileGetVerify
        }}>
					{contextHolder}
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <SiderBar></SiderBar>
                    <SiteLayout pages={<AppRouter/>}></SiteLayout>
                </Layout>
            </BrowserRouter>
       </AuthContext.Provider>
    );
}