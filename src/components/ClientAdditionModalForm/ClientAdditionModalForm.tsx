import { Cascader, Form, Input, Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/context";
import { useSearchParams } from "react-router-dom";

interface UseResetFormOnCloseModal {
  form: any;
  open: any;
}

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

const cascaderOnChange = (value: string[]) => {
  console.log(value);
};

interface ModalFormProps {
  open: boolean;
  onCancel: () => void;
  useResetFormOnCloseModal: ({ form, open }: UseResetFormOnCloseModal) => void;
}

const ClientAdditionModalForm: React.FC<ModalFormProps> = ({
  open,
  onCancel,
  useResetFormOnCloseModal,
}) => {
  const { axiosAPI, queueData, getQueueData, setQueueData, messageService } =
    useContext(AuthContext);
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const queueId = searchParams.get("queue");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getQueueData(queueId);
    setLoading(false);
  }, []);

  useResetFormOnCloseModal({
    form,
    open,
  });

  const onOk = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
    console.log(values);
    axiosAPI
      .addClientToQueue({
        username: values.username,
        queueId: queueId,
        appointment: { place: values.place, time: values.time },
      })
      .then((response: any) => {
        console.log(response);
        getQueueData(queueId);
        messageService.open({
          type: "success",
          content: "Client added!",
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
      title="Add Client to Queue"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" name="clientForm" onFinish={onFinish}>
        <Form.Item name="name" label="Username" rules={[{ required: true }]}>
          <Input placeholder="Your username" />
        </Form.Item>
        <Form.Item>
          {/* TODO: I may use only one CASCADER here due to CHILDREN prop in OPTIONS */}
          <Cascader
            loading={loading}
            onChange={() => cascaderOnChange}
            placeholder="Choose the place"
            options={queueData?.places.map((place: any) => {
              return { value: place.userId, label: place.username };
            })}
          />
        </Form.Item>
        {/* <Form.Item>
          <Cascader onChange={() => cascaderOnChange} options={[{ 1: 1 }]} />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default ClientAdditionModalForm;
