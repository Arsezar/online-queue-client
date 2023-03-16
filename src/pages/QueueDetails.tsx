import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/context";

const QueueDetails: React.FC = () => {
  const { setCurrent } = useContext(AuthContext);

  useEffect(() => {
    setCurrent("queue-details");
  }, []);

  return <div>QueueDetails</div>;
};

export default QueueDetails;
