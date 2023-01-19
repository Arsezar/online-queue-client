import React, {useContext, useEffect, useState, FormEvent} from 'react'
import { AuthContext } from '../context/context';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import './pages.scss'

const Login = () => {
  const { messageService, axiosAPI, setIsAuth, setCurrent }: any = useContext(AuthContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    setCurrent('login');
  }, [])

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
        messageService.open({
          type: 'error',
          content: 'Some field is empty',
        });
          return;
      }
      axiosAPI.login(user)
      .then((response: any) => {
        console.log(response);
        messageService.open({
          type: 'success',
          content: 'Success',
        });
        setIsAuth(true);
        navigate('/');
        navigate(0);
      })
      .catch((error: any) => {
        messageService.open({
          type: 'error',
          content: error.response.data.message,
        });
        console.log(error)
      })
  }



  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onSubmitCapture={handleLogin}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        
        <Link to='/forgot-password'>Forgot password</Link>

      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link to="/registration">register now!</Link>
      </Form.Item>
    </Form>
  );
}


//   return (
//     <Form
//       name="basic"
//       labelCol={{ span: 10 }}
//       wrapperCol={{ span: 12 }}
//       initialValues={{ remember: true }}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//       autoComplete="off"
//       className='login-form'
//       onSubmitCapture={handleLogin}
//     >
//       <Form.Item
//         label="Username"
//         name="username"
//         rules={[{ required: true, message: 'Please input your username!' }]}
//       >
//         <Input onChange={(e) => setUsername(e.target.value)}/>
//       </Form.Item>

//       <Form.Item
//         label="Password"
//         name="password"
//         rules={[{ required: true, message: 'Please input your password!' }]}
//       >
//         <Input.Password onChange={(e) => setPassword(e.target.value)}/>
//       </Form.Item>

//       <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
//         <Checkbox>Remember me</Checkbox>
//       </Form.Item>

//       <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>

//       <Form.Item>

//       </Form.Item>
//     </Form>
//   );
// }

export default Login