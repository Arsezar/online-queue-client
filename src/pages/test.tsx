import React, { FormEvent, useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as uuid from "uuid";
import "./pages.scss";
import { Button, Checkbox, Form, Input } from "antd";
import { AuthContext } from "../context/context";

const Registration = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const emailTest: RegExp = /\S+@\S+\.\S+/;
  const {
    errorMessageFunction,
    successMessageFunction,
    errorMessage,
    setErrorMessage,
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  function handleRegistration(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password || !username) {
      setErrorMessage("Some field is empty");
      console.log(errorMessage);
      errorMessageFunction(errorMessage);
      console.log(errorMessage);
    } else {
      const user = { id: uuid.v4(), username, email, password };
      console.log(user);
      const users = JSON.parse(localStorage.getItem("Users")!);
      const emailValidate = emailTest.test(email);
      if (!emailValidate) {
        setErrorMessage("Email is invalid");
        errorMessageFunction(errorMessage);
        return;
      }
      if (users.length !== 0) {
        const duplicate = users.find(
          (duplicate: any) =>
            email === duplicate.email || username === duplicate.username
        );
        if (duplicate) {
          setErrorMessage("This user is already exists");
          errorMessageFunction(errorMessage);
          return;
        }
        localStorage.setItem("Users", JSON.stringify([...users, user]));
        successMessageFunction();
        navigate("/login");
      } else {
        localStorage.setItem("Users", JSON.stringify([user]));
        successMessageFunction();
        navigate("/login");
      }
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
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input onChange={(e) => setUsername(e.target.value)} />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password onChange={(e) => setPassword(e.target.value)} />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Registration;
