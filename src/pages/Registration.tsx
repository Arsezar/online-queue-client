import React, { FormEvent, useContext, useEffect, } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.scss';
import { Button, Checkbox, Form, Input } from 'antd';
import { AuthContext } from '../context/context';
import { AxiosPostUser } from '../api/api.service';

const Registration = () => {
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const {errorMessageFunction, successMessageFunction, errorMessage, setErrorMessage} = useContext(AuthContext);
  const navigate = useNavigate();
  
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  function handleRegistration(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setErrorMessage('');
      if (!username || !email || !password || !phone) {
        setErrorMessage('Some field is empty');
        errorMessageFunction(errorMessage);
        return;
      } else {
        const user = {username, email, password, phone};
        AxiosPostUser(user)
        .then((response) => {
          console.log(response.data);
          successMessageFunction();
          navigate('/login');
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage('Something is wrong');
          errorMessageFunction(errorMessage);
        });
      }
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
			onSubmitCapture={handleRegistration}
    >
			<Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
        ]}
      >
        <Input onChange={(e) => setEmail(e.target.value)}/>
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input onChange={(e) => setPhone(e.target.value)}/>
      </Form.Item>

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
    </Form>
  )
}

export default Registration