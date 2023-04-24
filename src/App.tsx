import React, { useEffect, useState } from "react";
import { Layout, message } from "antd";
import SiderBar from "./components/Sider/SiderBar";
import SiteLayout from "./components/SiteLayout/SiteLayout";
import { AuthContext } from "./context/context";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter/AppRouter";
import axiosAPI from "./api/api.service";

interface Appointment {
  place: string;
  time: Date;
}

interface Client {
  appointment: Appointment;
  approved: boolean;
  cancelled: boolean;
  email: string;
  key: string;
  password: string;
  phone: string;
  processed: boolean;
  refreshToken: string;
  roles: string;
  username: string;
  __v: 0;
  _id: string;
}

interface Place extends Client {}

interface Queue {
  name: string;
  places: Place[];
  clients: Client[];
  __v: number;
  _id: string;
}

export default function App() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [current, setCurrent] = useState<string>("1");
  const [userData, setUserData] = useState<Client>();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [queueData, setQueueData] = useState<Queue>();
  const [messageService, contextHolder] = message.useMessage();

  useEffect(() => {
    console.log("APP USEEFFECT");
    authProfileGetVerify();
  }, []);

  async function authProfileGetVerify() {
    const token = localStorage.getItem("AuthToken");
    if (token) {
      axiosAPI
        .getProfile()
        .then((response: any) => {
          setIsAuth(true);
          console.log("auth is true");
          axiosAPI
            .getUser(response.data.username)
            .then((response: any) => {
              setUserData(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  }

  async function getQueues() {
    axiosAPI
      .getQueues()
      .then((response: any) => {
        setQueues(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  async function getQueueData(queueId: string) {
    axiosAPI
      .findQueueById(queueId)
      .then((response: any) => {
        setQueueData(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        setIsAuth,
        messageService,
        axiosAPI,
        current,
        setCurrent,
        userData,
        setUserData,
        authProfileGetVerify,
        queues,
        getQueues,
        queueData,
        setQueueData,
        getQueueData,
      }}
    >
      {contextHolder}
      <BrowserRouter>
        <Layout style={{ minHeight: "100vh" }}>
          <SiderBar></SiderBar>
          <SiteLayout pages={<AppRouter />}></SiteLayout>
        </Layout>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
