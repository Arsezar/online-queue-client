import React, { useContext, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { AuthContext } from '../../context/context';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  open: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}

const CollectionCreateForm: React.FC<CollectionCreateFormProps> = ({
  open,
  onCreate,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="Password Reset"
      okText="Reset"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
          { 
            required: true, message: 'Please input your email!' 
          }, 
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
        ]}
          hasFeedback
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="email-confirm" 
          label="Confirm Email"
          hasFeedback
          rules={[
            { 
              required: true, message: 'Please confirm your email!' 
            },
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
              ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('email') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two emails do not match!'));
              },
            }),
          ]}
        >
          <Input type="email" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ForgotPasswordModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { axiosAPI, messageService } = useContext(AuthContext);

  const onCreate = (values: any) => {
    console.log('Received values of form: ', values);
    axiosAPI.forgotPassword(values.email)
      .then((response: any) => {
        console.log('forgot-password send');
        messageService.open({
          type: 'success',
          content: 'Check your email!',
        });
      })
      .catch((error: any) => {
        console.log(error);
        messageService.open({
          type: 'error',
          content: error.response.data,
        });
      })
    setOpen(false);
  };

  return (
    <>
      <a
        onClick={() => {
          setOpen(true);
        }}
      >
        Forgot Password
      </a>
      <CollectionCreateForm
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default ForgotPasswordModal;