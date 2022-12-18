import axios from "axios";
import { useNavigate } from "react-router-dom";

const usersURL = "http://localhost:3000/users";
const localURL = "http://localhost:3000";

export const AxiosPostUser = (user: object) => {
  return axios.post(usersURL, user);
};

export const AxiosPostData = (data: any) => {
  return axios.post(localURL, data);
};
