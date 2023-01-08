import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/context';
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  Typography,
} from 'antd';
import validator from 'validator';

const { Title, Paragraph } = Typography;

const Profile: React.FC = () => {
  const {setCurrent, axiosAPI, userData, messageService, setIsAuth, setUserData} = useContext(AuthContext);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(false);
  const [email, setEmail] = useState<string>(userData.email);
  const [phone, setPhone] = useState<string>(userData.phone);
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');


  const onFormLayoutChange = ({ disabled }: { disabled: boolean }) => {
    setComponentDisabled(disabled);
  };

  useEffect(() => setCurrent('userData'), []);

  async function dateChangeSubmit() {
    const isEmailValid = validator.isEmail(email);
    const isPhoneValid = validator.isMobilePhone(phone);
    console.log(isEmailValid, isPhoneValid)
    if(!isEmailValid || !isPhoneValid) {
      messageService.open({
        type: 'error',
        content: 'Email or phone is not valid',
      });
      return
    }

    const changedUser = {email, phone, password, username: userData.username};
    axiosAPI.changeData(changedUser)
    .then((response: any) => {
      console.log(response);
      setUserData(response.data);
      messageService.open({
        type: 'success',
        content: 'Success!',
      });
    })
    .catch((error: any) => {
      console.log(error);
      messageService.open({
        type: 'error',
        content: error.response.data.message,
      });
    })
  }

  function isButtonDisabled() {
    if(!password.length || !passwordConfirm.length) return true;
    if(passwordConfirm !== password) return true;
    if(passwordConfirm === password) return false;
  }

  return (
    <div className='profileForm'>
      <Title level={2}>Change user data</Title>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onValuesChange={onFormLayoutChange}
        disabled={componentDisabled}
        onSubmitCapture={dateChangeSubmit}
      >
        <Form.Item label="Username">
          <Input value={userData.username} disabled={true}/>
        </Form.Item>
        <Form.Item label="Phone">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={`previous: ${userData.phone}`}/>
        </Form.Item>
        <Form.Item label="Email">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={`previous: ${userData.email}`}/>
        </Form.Item>
        <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]} label="Password">
          <Input.Password onChange={(e) => setPassword(e.target.value)}/>
        </Form.Item>
        <Form.Item name='password-confirm' rules={[{ required: true, message: 'Please confirm your password!' }]} label="Confirm">
          <Input.Password onChange={(e) => setPasswordConfirm(e.target.value)}/>
        </Form.Item>
        <Form.Item className='submitButtonContainer'>
          <Button type='primary' htmlType='submit' disabled={isButtonDisabled()}>Submit Change</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Profile