import React, {useEffect, useState} from "react"
import { Layout, message } from 'antd';
import SiderBar from "./components/Sider/SiderBar";
import SiteLayout from "./components/SiteLayout/SiteLayout";
import { AuthContext } from "./context/context";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter/AppRouter";
import { setTimeout } from "timers/promises";

export default function App() {
	const [isAuth, setIsAuth] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
    const [messageApi, contextHolder] = message.useMessage();

    const errorMessageFunction = (message: any) => {
          messageApi.open({
            type: 'error',
            content: message,
          });
      };

      const successMessageFunction = () => {
        messageApi.open({
            type: 'success',
            content: 'Success!',
        });
      };

    useEffect(() => {
        const users = JSON.parse(localStorage.getItem("Users")!)
        if (!users) {
            console.log('APP USEEFFECT')
            localStorage.setItem('Users', JSON.stringify([]))
        }
    }, [])

    return (
        <AuthContext.Provider value={{ isAuth, setIsAuth, errorMessageFunction, successMessageFunction, errorMessage, setErrorMessage }}>
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