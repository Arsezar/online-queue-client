import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/context";
import {
  Button,
  Form,
  FormInstance,
  Input,
  Modal,
  Table,
  Typography,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import Column from "antd/es/table/Column";
import {
  CloseOutlined,
  CheckOutlined,
  DeleteOutlined,
  UserAddOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";

interface DataType {
  key: React.Key;
  username: string;
  email: string;
  phone: string;
  userId: string;
  queue: string;
  roles: string;
  appointment: Date | null;
}

const onChange: TableProps<DataType>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
};
interface Queue {
  name: string;
  places: DataType[];
  usersQueue: DataType[];
  __v: number;
  _id: string;
}

interface ModalFormProps {
  open: boolean;
  onCancel: () => void;
}

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({
  form,
  open,
}: {
  form: FormInstance;
  open: boolean;
}) => {
  const prevOpenRef = useRef<boolean>();
  useEffect(() => {
    prevOpenRef.current = open;
  }, [open]);
  const prevOpen = prevOpenRef.current;

  useEffect(() => {
    if (!open && prevOpen) {
      form.resetFields();
    }
  }, [form, prevOpen, open]);
};

const ClientModalForm: React.FC<ModalFormProps> = ({ open, onCancel }) => {
  const { axiosAPI } = useContext(AuthContext);
  const [form] = Form.useForm();

  useResetFormOnCloseModal({
    form,
    open,
  });

  const onOk = () => {
    // !!
    // axiosAPI.addClientToQueue();
    form.submit();
  };

  return (
    <Modal
      title="Add Client to Queue"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" name="clientForm">
        <Form.Item name="name" label="Username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const PlaceModalForm: React.FC<ModalFormProps> = ({ open, onCancel }) => {
  const { axiosAPI } = useContext(AuthContext);
  const [form] = Form.useForm();

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
      .createQueue({
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
        roles: "employee",
        queue: 1,
      })
      .then((reponse: any) => {
        console.log(reponse);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <Modal
      title="Add Place to Queue"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" name="placeForm" onFinish={onFinish}>
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

const QueueDetails: React.FC = () => {
  const { setCurrent, axiosAPI } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [queueData, setQueueData] = useState<Queue>();
  const [loading, setLoading] = useState(false);
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openPlaceModal, setOpenPlaceModal] = useState(false);

  const showClientModal = () => {
    setOpenClientModal(true);
  };

  const hideClientModal = () => {
    setOpenClientModal(false);
  };

  const showPlaceModal = () => {
    setOpenPlaceModal(true);
  };

  const hidePlaceModal = () => {
    setOpenPlaceModal(false);
  };

  useEffect(() => {
    setLoading(true);
    setCurrent("queue-details");
    const queueId = searchParams.get("queue");
    axiosAPI
      .findQueueById(queueId)
      .then((response: any) => {
        setQueueData(response.data);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="queueDetailsContainer">
      <Form.Provider
        onFormFinish={(name) => {
          if (name === "placeForm") {
            setOpenPlaceModal(false);
          }
          if (name === "clientForm") {
            setOpenClientModal(false);
          }
        }}
      >
        <div className="placeTableContainer">
          <Typography.Title level={4}>Place table</Typography.Title>
          <div className="tableButtonsContainer">
            <Button shape="round" onClick={showPlaceModal}>
              <UserAddOutlined />
              Add place
            </Button>
          </div>
          <Table
            size="small"
            pagination={{ hideOnSinglePage: true }}
            dataSource={queueData?.places}
            onChange={onChange}
            loading={loading}
          >
            <Column
              title="Username"
              key="Username"
              render={(_: any, place: DataType) => <>{place.username}</>}
            />
            <Column
              title="Email"
              key="email"
              render={(_: any, place: DataType) => <>{place.email}</>}
            />
            <Column
              title="Phone"
              key="phone"
              render={(_: any, place: DataType) => <>{place.phone}</>}
            />
            <Column
              title="Actions"
              key="actions"
              render={(_: any, place: DataType) => (
                <>
                  <Button danger type="text">
                    <CloseOutlined />
                  </Button>
                  <Button type="text">
                    <CheckOutlined />
                  </Button>
                  <Button type="text">
                    <DeleteOutlined />
                  </Button>
                </>
              )}
            />
          </Table>
        </div>
        <div className="clientTableContainer">
          <Typography.Title level={4}>Client table</Typography.Title>
          <div className="tableButtonsContainer">
            <Button shape="round" onClick={showClientModal}>
              <UserAddOutlined />
              Add client
            </Button>
            <Button shape="round">
              <PlayCircleOutlined />
              Step in queue
            </Button>
          </div>
          <Table
            size="small"
            pagination={{ hideOnSinglePage: true }}
            dataSource={queueData?.usersQueue}
            onChange={onChange}
            loading={loading}
          >
            <Column
              title="Username"
              key="Username"
              render={(_: any, client: DataType) => <>{client.username}</>}
            />
            <Column
              title="Email"
              key="email"
              render={(_: any, client: DataType) => <>{client.email}</>}
            />
            <Column
              title="Phone"
              key="phone"
              render={(_: any, client: DataType) => <>{client.phone}</>}
            />
            <Column
              title="Appointment"
              key="actions"
              render={(_: any, client: DataType) => <>{client.appointment}</>}
            />
            <Column
              title="Actions"
              key="actions"
              render={(_: any, client: DataType) => (
                <>
                  <Button danger type="text">
                    <CloseOutlined />
                  </Button>
                  <Button type="text">
                    <CheckOutlined />
                  </Button>
                  <Button type="text">
                    <DeleteOutlined />
                  </Button>
                </>
              )}
            />
          </Table>
          <ClientModalForm open={openClientModal} onCancel={hideClientModal} />
          <PlaceModalForm open={openPlaceModal} onCancel={hidePlaceModal} />
        </div>
      </Form.Provider>
    </div>
  );
};

export default QueueDetails;
