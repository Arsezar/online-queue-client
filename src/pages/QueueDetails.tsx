import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/context";
import { Button, Form, FormInstance, Table, Typography } from "antd";
import type { TableProps } from "antd/es/table";
import Column from "antd/es/table/Column";
import {
  CloseOutlined,
  CheckOutlined,
  DeleteOutlined,
  UserAddOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import ClientAdditionModalForm from "../components/ClientAdditionModalForm/ClientAdditionModalForm";
import PlaceCreationModalForm from "../components/PlaceCreationModalForm/PlaceCreationModalForm";
import PlaceAdditionModalForm from "../components/PlaceAdditionModalForm/PlaceAdditionModalForm";

interface Appointment {
  place: string;
  time: string;
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

const QueueDetails: React.FC = () => {
  const {
    setCurrent,
    axiosAPI,
    queueData,
    getQueueData,
    setQueueData,
    messageService,
  } = useContext(AuthContext);
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
      .then((response: any) => {
        console.log(response);
        getQueueData(place.queueId);
        messageService.open({
          type: "success",
          content: "Place deleted!",
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
          <ClientAdditionModalForm
            open={openClientModal}
            onCancel={hideClientModal}
            useResetFormOnCloseModal={useResetFormOnCloseModal}
          />
          <PlaceCreationModalForm
            open={openPlaceCreationModal}
            onCancel={hidePlaceCreationModal}
            useResetFormOnCloseModal={useResetFormOnCloseModal}
          />
          <PlaceAdditionModalForm
            open={openPlaceAdditionModal}
            onCancel={hidePlaceAdditionModal}
            useResetFormOnCloseModal={useResetFormOnCloseModal}
          />
        </div>
      </Form.Provider>
    </div>
  );
};

export default QueueDetails;
