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
import type { TableProps } from "antd/es/table";
import Column from "antd/es/table/Column";
import {
  CloseOutlined,
  CheckOutlined,
  DeleteOutlined,
  UserAddOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Cascader } from "antd";
import { AxiosError, AxiosResponse } from "axios";

interface Option {
  value: string | number;
  label: string;
  children?: Option[];
}

interface Appointment {
  place: string;
  time: Date;
}

interface DataType {
  key: React.Key;
  username: string;
  email: string;
  phone: string;
  userId: string;
  queueId: string;
  roles: string;
  appointment: Appointment | null;
}

const tableOnChange: TableProps<DataType>["onChange"] = (
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
  clients: DataType[];
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

const options: Option[] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const cascaderOnChange = (value: any) => {
  console.log(value);
};

const ClientModalForm: React.FC<ModalFormProps> = ({ open, onCancel }) => {
  const { axiosAPI, queueData, getQueueData, setQueueData } =
    useContext(AuthContext);
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();

  useResetFormOnCloseModal({
    form,
    open,
  });

  const onOk = () => {
    form.submit();
  };

  const onFinish = (values: any) => {
    const queueId = searchParams.get("queue");
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
      })
      .catch((error: any) => {
        console.log(error);
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
          <Input />
        </Form.Item>
        <Form.Item>
          <Cascader
            options={options}
            onChange={cascaderOnChange}
            placeholder="Select place"
          />
        </Form.Item>
        <Form.Item>
          <Cascader
            options={options}
            onChange={cascaderOnChange}
            placeholder="Select date"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const PlaceCreationModalForm: React.FC<ModalFormProps> = ({
  open,
  onCancel,
}) => {
  const { setCurrent, axiosAPI, queueData, getQueueData, setQueueData } =
    useContext(AuthContext);
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
      })
      .catch((error: any) => {
        console.log(error);
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

const PlaceAdditionModalForm: React.FC<ModalFormProps> = ({
  open,
  onCancel,
}) => {
  const { setCurrent, axiosAPI, queueData, getQueueData, setQueueData } =
    useContext(AuthContext);
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
    axiosAPI
      .addPlaceToQueue(values.username, queueId)
      .then((response: any) => {
        console.log(response);
        getQueueData(queueId);
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
      <Form
        form={form}
        layout="vertical"
        name="placeAdditionForm"
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const QueueDetails: React.FC = () => {
  const { setCurrent, axiosAPI, queueData, getQueueData, setQueueData } =
    useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [openClientModal, setOpenClientModal] = useState<boolean>(false);
  const [openPlaceCreationModal, setOpenPlaceCreationModal] =
    useState<boolean>(false);
  const [openPlaceAdditionModal, setOpenPlaceAdditionModal] =
    useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    setCurrent("queue-details");
    const queueId = searchParams.get("queue");
    getQueueData(queueId);
    setLoading(false);
  }, []);

  const showClientModal = () => {
    setOpenClientModal(true);
  };

  const hideClientModal = () => {
    setOpenClientModal(false);
  };

  const showPlaceCreationModal = () => {
    setOpenPlaceCreationModal(true);
  };

  const hidePlaceCreationModal = () => {
    setOpenPlaceCreationModal(false);
  };

  const showPlaceAdditionModal = () => {
    setOpenPlaceAdditionModal(true);
  };

  const hidePlaceAdditionModal = () => {
    setOpenPlaceAdditionModal(false);
  };

  const deletePlace = (place: DataType) => {
    console.log(place);
    const deletionData = { userId: place.userId, queueId: place.queueId };
    axiosAPI
      .deletePlace(deletionData)
      .then((response: AxiosResponse) => {
        console.log(response);
        getQueueData(place.queueId);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  return (
    <div className="queueDetailsContainer">
      <Form.Provider
        onFormFinish={(name) => {
          if (name === "placeCreationForm") {
            setOpenPlaceCreationModal(false);
          }
          if (name === "placeAdditionForm") {
            setOpenPlaceAdditionModal(false);
          }
          if (name === "clientForm") {
            setOpenClientModal(false);
          }
        }}
      >
        <div className="placeTableContainer">
          <Typography.Title level={4}>Place table</Typography.Title>
          <div className="tableButtonsContainer">
            <Button shape="round" onClick={showPlaceCreationModal}>
              <UserAddOutlined />
              Create Place
            </Button>
            <Button shape="round" onClick={showPlaceAdditionModal}>
              <UserAddOutlined />
              Add Place
            </Button>
          </div>
          <Table
            size="small"
            pagination={{ hideOnSinglePage: true }}
            dataSource={queueData?.places}
            onChange={tableOnChange}
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
                  {/* <Button danger type="text" title="Cancel user">
                    <CloseOutlined />
                  </Button>
                  <Button type="text" title="Approve user">
                    <CheckOutlined />
                  </Button> */}
                  <Button
                    type="text"
                    title="Delete user"
                    onClick={() => deletePlace(place)}
                  >
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
            dataSource={queueData?.clients}
            onChange={tableOnChange}
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
              render={(_: any, client: DataType) => (
                <>{client.appointment?.time}</>
              )}
            />
            <Column
              title="Actions"
              key="actions"
              render={(_: any, client: DataType) => (
                <>
                  <Button danger type="text" title="Cancel user">
                    <CloseOutlined />
                  </Button>
                  <Button type="text" title="Approve user">
                    <CheckOutlined />
                  </Button>
                  <Button type="text" title="Delete user">
                    <DeleteOutlined />
                  </Button>
                </>
              )}
            />
          </Table>
          <ClientModalForm open={openClientModal} onCancel={hideClientModal} />
          <PlaceCreationModalForm
            open={openPlaceCreationModal}
            onCancel={hidePlaceCreationModal}
          />
          <PlaceAdditionModalForm
            open={openPlaceAdditionModal}
            onCancel={hidePlaceAdditionModal}
          />
        </div>
      </Form.Provider>
    </div>
  );
};

export default QueueDetails;
