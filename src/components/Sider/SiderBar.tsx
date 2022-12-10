import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileOutlined,
  UserOutlined,
  SettingOutlined,
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
    const {isAuth}: any = useContext(AuthContext);
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState('1');
    const [siderItems, setSiderItems] = useState<ItemType[] | undefined>(undefined)

    useEffect(() => {
      setCurrent('7')
      const items: MenuItem[] = [
        getItem('Navigation', 'sub1', <SettingOutlined />, [
          getItem('Option 1', '3'),
          getItem('Option 2', '4'),
          getItem('Option 3', '5'),
          getItem('Option 4', '6'),
        ]),
         isAuth
                ? 
                  getItem('User', 'sub3', <UserOutlined />, [
                    getItem(<Link to='/menu'>Menu</Link>, '10'),
                    getItem(<Link to='/profile'>Profile</Link>, '11'),
                  ])
                : 
                  getItem('User', 'sub2', <UserOutlined />, [
                    getItem(<Link to='/login'>Login</Link>, '7'),
                    getItem(<Link to='/registration'>Registration</Link>, '8'),
                  ]) 
      ];
      setSiderItems(items);
    }, [])

    const onClick: MenuProps['onClick'] = (e) => {
      console.log('click ', e);
      setCurrent(e.key);
    };

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={siderItems} onClick={onClick} selectedKeys={[current]}/>
    </Sider>
  )
}

export default SiderBar