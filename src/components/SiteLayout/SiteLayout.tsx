import React, { ReactNode } from 'react'
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

interface siteLayoutProp {
  pages: ReactNode,
}

const SiteLayout: React.FC<siteLayoutProp> = (props: siteLayoutProp) => {

  return (
    <Layout className="site-layout">
        <Header className="site-layout-background" />
        <Content className='layoutContent'>
          {props.pages}
        </Content>
        <Footer className='layoutFooter'>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
  )
}

export default SiteLayout