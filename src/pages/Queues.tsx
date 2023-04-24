import React, { useContext, useEffect, useRef, useState } from "react";
import {
  SmileOutlined,
  UserOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Form, Input, Modal, Typography } from "antd";
import type { FormInstance } from "antd/es/form";
import { AuthContext } from "../context/context";
import { Link } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";

interface Client {
  username: string;
  email: string;
  phone: string;
  userId: string;
  queue: string;
  roles: string;
}

interface Place extends Client {}

interface Queue {
  name: string;
  places: Place[];
  clients: Client[];
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

const QueueModalForm: React.FC<ModalFormProps> = ({ open, onCancel }) => {
  const { axiosAPI, getQueues } = useContext(AuthContext);
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
      .createQueue(values.name)
      .then((reponse: any) => {
        console.log(reponse);
        getQueues();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  return (
    <Modal title="Create Queue" open={open} onOk={onOk} onCancel={onCancel}>
      <Form form={form} layout="vertical" name="queueForm" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name of the Queue"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Queues: React.FC = () => {
  const { setCurrent, axiosAPI, getQueues, queues } = useContext(AuthContext);
  const [openQueueModal, setOpenQueueModal] = useState(false);

  useEffect(() => {
    setCurrent("queues");
    getQueues();
  }, []);

  const deleteQueue = (queueId: string) => {
    axiosAPI
      .deleteQueue(queueId)
      .then((response: AxiosResponse) => {
        console.log(response);
        getQueues();
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  const showQueueModal = () => {
    setOpenQueueModal(true);
  };

  const hideQueueModal = () => {
    setOpenQueueModal(false);
  };

  return (
    <>
      <Button
        htmlType="button"
        className="createQueueButton"
        onClick={showQueueModal}
      >
        Create queue
      </Button>
      <div className="queuesContainer">
        <Form.Provider
          onFormFinish={(name) => {
            if (name === "queueForm") {
              setOpenQueueModal(false);
            }
          }}
        >
          {queues.map((queue: Queue) => (
            <Form name="basicForm" className="queueForm" key={queue._id}>
              <div className="queueFormHeader">
                <Form.Item>
                  <Typography.Text
                    className="ant-form-text"
                    strong
                    style={{ fontSize: "20px" }}
                    title="Queue name"
                  >
                    {queue.name}
                  </Typography.Text>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="text"
                    danger
                    onClick={() => deleteQueue(queue._id)}
                  >
                    <CloseOutlined />
                  </Button>
                </Form.Item>
              </div>
              <Form.Item
                shouldUpdate={(prevValues, curValues) =>
                  prevValues.users !== curValues.users
                }
              >
                {() => {
                  const users: Client[] = queue.clients;
                  const places: Place[] = queue.places;
                  return users.length || places.length ? (
                    <div className="usersContainer">
                      {places.length ? (
                        <>
                          <Typography.Text className="ant-form-text" strong>
                            Place list:
                          </Typography.Text>
                          {places.map((place: Place) => (
                            <ul>
                              <li key={place.username} className="user">
                                <Avatar
                                  icon={<UserOutlined />}
                                  className="userIcon"
                                />
                                {place.username}
                              </li>
                            </ul>
                          ))}
                        </>
                      ) : null}

                      {users.length ? (
                        <>
                          <Typography.Text className="ant-form-text" strong>
                            Client list:
                          </Typography.Text>
                          <ul>
                            {users.map((client: Client) => (
                              <li key={client.username} className="user">
                                <Avatar
                                  icon={<UserOutlined />}
                                  className="userIcon"
                                />
                                {client.username}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <Typography.Text className="ant-form-text" type="secondary">
                      ( <SmileOutlined /> No user yet. )
                    </Typography.Text>
                  );
                }}
              </Form.Item>
              <Form.Item>
                <Link to={`/queue-details?queue=${queue._id}`}>
                  <Button htmlType="button">
                    Details <InfoCircleOutlined />
                  </Button>
                </Link>
              </Form.Item>
            </Form>
          ))}
          <QueueModalForm open={openQueueModal} onCancel={hideQueueModal} />
        </Form.Provider>
      </div>
    </>
  );
};

export default Queues;
