import { Form, Input, Modal } from "antd";
import React, { useContext } from "react";
import { AuthContext } from "../../context/context";
import { useSearchParams } from "react-router-dom";

interface UseResetFormOnCloseModal {
  form: any;
  open: any;
}

interface ModalFormProps {
  open: boolean;
  onCancel: () => void;
  useResetFormOnCloseModal: ({ form, open }: UseResetFormOnCloseModal) => void;
}

const PlaceCreationModalForm: React.FC<ModalFormProps> = ({
  open,
  onCancel,
  useResetFormOnCloseModal,
}) => {
  const {
    setCurrent,
    axiosAPI,
    queueData,
    getQueueData,
    setQueueData,
    messageService,
  } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const queueId = searchParams.get("queue");

  useResetFormOnCloseModal({
    form,
    open,
  });

  const onOk = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
    console.log(values);
    const place = {
      username: values.username,
      password: values.password,
      phone: values.phone,
      email: values.email,
      queueId: queueId,
      roles: "employee",
    };
    axiosAPI
      .createPlaceInQueue(place)
      .then((response: any) => {
        console.log(response);
        getQueueData(queueId);
        messageService.open({
          type: "success",
          content: "Place created!",
        });
      })
      .catch((error: any) => {
        console.log(error);
        messageService.open({
          type: "error",
          content: error.response?.data?.message,
        });
      });
  };

  return (
    <Modal
      title="Create Place for Queue"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form
        form={form}
        layout="vertical"
        name="placeCreationForm"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PlaceCreationModalForm;
