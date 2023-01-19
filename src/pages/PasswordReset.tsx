import React, { useContext, useState } from 'react'
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { AuthContext } from '../context/context';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const PasswordReset = () => {
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');
	const { axiosAPI, messageService } = useContext(AuthContext);
	const [seacrhParams] = useSearchParams();
	const navigate = useNavigate();

    const onFinish = (values: any) => {
        console.log('Success:', values);
				const token = seacrhParams.get('token');
				const data = { token, password };
				console.log(data);
				axiosAPI.resetPassword(data)
				.then((response: any) => {
					messageService.open({
						type: 'success',
						content: 'Your password has been changed!',
					});
					setTimeout(() => {
						navigate('/login');
					}, 1000)
				})
				.catch((error: any) => {
					messageService.open({
						type: 'error',
						content: error.response.data.message,
					});
					setTimeout(() => {
						navigate('/login');
					}, 1000)
				})
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

			function isButtonDisabled() {
				if(!passwordConfirm.length || !password.length) {
					return true;
				} else {
					return false;
				}
			}
    
      return (
        <Form
          name="basic"
					layout="horizontal"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14.5 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
					<Title style={{textAlign: 'center'}} level={2}>Reset Password</Title>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password onChange={(e) => setPassword(e.target.value)}/>
          </Form.Item>
    
          <Form.Item
            label="Confirm"
            name="confirm-password"
			hasFeedback
            rules={[
							{ required: true, message: 'Please confirm your password!' },
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
            <Input.Password onChange={(e) => setPasswordConfirm(e.target.value)}/>
          </Form.Item>
    
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button disabled={isButtonDisabled()} type="primary" htmlType="submit">
              Reset
            </Button>
          </Form.Item>
        </Form>
      );
}

export default PasswordReset