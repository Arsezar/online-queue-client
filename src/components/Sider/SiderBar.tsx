import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileOutlined,
  UserOutlined,
  TableOutlined,
  InfoOutlined,
  StarOutlined,
  PoweroffOutlined,
  KeyOutlined,
  HddOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { AuthContext } from '../../context/context';
import { ItemType } from 'antd/es/menu/hooks/useItems';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    type
  } as MenuItem;
}


const SiderBar: React.FC = () => {
    const {isAuth, setIsAuth, current, setCurrent, axiosAPI}: any = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(true);
    const [siderItems, setSiderItems] = useState<ItemType[] | undefined>(undefined);
    const navigate = useNavigate();

     const logout = () => {
      axiosAPI.logout()
      .then((response: any) => {
        console.log(response);
        localStorage.removeItem('AuthToken');
        setIsAuth(false);
        navigate(0);
      })
      .catch((error: any) => {
        console.log(error);
      })
     } 
     
    useEffect(() => {
      const items: MenuItem[] = [
         isAuth
          ? 
            getItem('Main', 'sub1', <FileOutlined />, [
              getItem(<Link to='/menu'> Menu </Link>, 'menu', <StarOutlined/>),
              getItem(<Link to='/queues'>Queues</Link>, 'queues', <TableOutlined/>),
              getItem("Profile", 'sub2', <UserOutlined />, [
                getItem(<Link to='/profile'> Info </Link>, 'profile', <InfoOutlined/>),
                getItem(<Link to='/login' onClick={() => logout()}>Logout</Link>, 'logout', <PoweroffOutlined/>),
              ]),
            ])
          : 
            getItem('Navigation', 'sub3', <AppstoreOutlined />, [
              getItem(<Link to='/login'> Login </Link>, 'login', <KeyOutlined/>),
              getItem(<Link to='/registration'> Registration </Link>, 'reg', <HddOutlined/>),
            ]) 
      ];
      setSiderItems(items);
    }, [isAuth])

    const onClick: MenuProps['onClick'] = (e) => {
      console.log('click ', e);
      setCurrent(e.key)
    };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
        <div className="logo" />
        <Menu theme="dark" mode="inline" items={siderItems} onClick={onClick} selectedKeys={[current]}/>
    </Sider>
  )
}

export default SiderBar