import React, { FormEvent, useContext, useEffect, } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './pages.scss';
import { Button, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { AuthContext } from '../context/context';


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const { Option } = Select;

const Registration = () => {
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phonePrefix, setPhonePrefix] = useState<string>('+380');
  const [agreement, setAgreement] = useState<boolean>(false);
  const [captcha, setCapthca] = useState<string>('');
  const {messageService, axiosAPI, setCurrent} = useContext(AuthContext);
  const [form] = Form.useForm();

  useEffect(() => {
    setCurrent('reg');
  }, [])

  const navigate = useNavigate();
  
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select onChange={e => setPhonePrefix('+'.concat(e))} style={{ width: 70 }}>
        <Option value="380">+380</Option>
        <Option value="04">+04</Option>
        <Option value="05">+05</Option>
      </Select>
    </Form.Item>
  );

  function handleRegistration(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      if (!username || !email || !password || !phone) {
        console.log(15)
        messageService.open({
          type: 'error',
          content: 'Some field is empty',
        });
        return;
      } else {
        const user = {username, email, password, phone};
        axiosAPI.registration(user)
        .then((response: any) => {
          console.log(response);
          messageService.open({
            type: 'success',
            content: 'Success',
          });
          navigate('/login');
        })
        .catch((error: any) => {
          console.log(error);
          messageService.open({
            type: 'error',
            content: error.response.data.message,
          });
        });
      }
  }

  function isButtonDisabled() {
    if(!agreement || !password.length) {
      return true;
    } else {
      return false;
    }
  }

  return (
  <Form
      {...formItemLayout}
      form={form}
      className='register-form'
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: '380',
      }}
      scrollToFirstError
      onSubmitCapture={handleRegistration}
    >
      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input onChange={(e) => setEmail(e.target.value)}/>
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password onChange={e => setPassword(e.target.value)}/>
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          () => ({
            validator(_, value) {
              if (!value || password === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="username"
        label="Username"
        tooltip="What do you want others to call you?"
        rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
      >
        <Input onChange={e => setUsername(e.target.value)}/>
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input onChange={e => setPhone((phonePrefix).concat(e.target.value))} addonBefore={prefixSelector} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
          },
        ]}
        {...tailFormItemLayout}
      >
        <Checkbox value={agreement} onChange={e => setAgreement(e.target.checked)}>
          I have read the <a href="">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button disabled={isButtonDisabled()} type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Registration