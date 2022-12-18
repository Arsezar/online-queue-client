import React, {useContext, useEffect, useState, FormEvent} from 'react'
import { AuthContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input } from 'antd';
import './pages.scss'
import { AxiosPostData, AxiosPostUser } from '../api/api.service';

const Login = () => {
  const { errorMessage, setErrorMessage, errorMessageFunction, successMessageFunction, }: any = useContext(AuthContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  function handleLogin(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const user = { username, password };
      if (!password || !username) {
          setErrorMessage('Some field is empty');
          errorMessageFunction(errorMessage);
          return;
      }
      AxiosPostData('auth/login');
  }


  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      className='login-form'
      onSubmitCapture={handleLogin}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input onChange={(e) => setUsername(e.target.value)}/>
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password onChange={(e) => setPassword(e.target.value)}/>
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      <Form.Item>

      </Form.Item>
    </Form>
  );
}

export default Login