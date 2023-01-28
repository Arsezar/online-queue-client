import React, { FormEvent, useContext, useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import { AuthContext } from "../context/context";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailConfirmation, setEmailConfirmation] = useState<string>("");
  const { axiosAPI, messageService } = useContext(AuthContext);
  const navigate = useNavigate();

  function isButtonDisabled() {
    if (!emailConfirmation.length || !email.length) {
      return true;
    } else {
      return false;
    }
  }

  function hadleReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !emailConfirmation) {
      messageService.open({
        type: "error",
        content: "Some field is empty",
      });
      return;
    } else {
      const emailData = { email: email };
      console.log(emailData);
      axiosAPI
        .forgotPassword(emailData)
        .then((response: any) => {
          console.log(response);
          messageService.open({
            type: "success",
            content: "The email with reset link has been sended!",
          });
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        })
        .catch((error: any) => {
          console.log(error);
          messageService.open({
            type: "error",
            content: error.response.data.message,
          });
        });
    }
  }

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onSubmitCapture={hadleReset}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: "Please input your Email!" }]}
      >
        <Input
          onChange={(e) => setEmail(e.target.value)}
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Email"
        />
      </Form.Item>
      <Form.Item
        name="email-confirmation"
        rules={[
          { required: true, message: "Please confirm your Email!" },
          () => ({
            validator(_, value) {
              if (!value || email === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("The two emails do not match!"));
            },
          }),
        ]}
      >
        <Input
          onChange={(e) => setEmailConfirmation(e.target.value)}
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="Confirm your email"
        />
      </Form.Item>
      <Form.Item>
        <Button
          disabled={isButtonDisabled()}
          type="primary"
          htmlType="submit"
          className="login-form-button"
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ForgotPassword;
