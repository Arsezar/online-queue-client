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
import QueueModalForm from "../components/QueueModalForm/QueueModalForm";

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

const Queues: React.FC = () => {
  const { setCurrent, axiosAPI, getQueues, queues, messageService } =
    useContext(AuthContext);
  const [openQueueModal, setOpenQueueModal] = useState(false);

  useEffect(() => {
    setCurrent("queues");
    getQueues();
  }, []);

  const deleteQueue = (queueId: string) => {
    axiosAPI
      .deleteQueue(queueId)
      .then((response: any) => {
        console.log(response);
        getQueues();
        messageService.open({
          type: "success",
          content: "Queue deleted",
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
          <QueueModalForm
            useResetFormOnCloseModal={useResetFormOnCloseModal}
            open={openQueueModal}
            onCancel={hideQueueModal}
          />
        </Form.Provider>
      </div>
    </>
  );
};

export default Queues;
