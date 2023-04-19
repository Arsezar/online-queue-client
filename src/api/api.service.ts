import axios, { Axios } from "axios";

interface User {
  username: string;
  password: string;
  phone: string;
  email: string;
}

interface UserLogin {
  username: string;
  password: string;
}

class AxiosAPI {
  private axios: Axios;

  constructor(private baseURL: string) {
    this.axios = axios.create({
      baseURL,
      timeout: 5000,
    });

    const authToken: string | null = localStorage.getItem("AuthToken");

    this.axios.defaults.headers.common["Authorization"] =
      `Bearer ${authToken}` || "none";
  }

  registration(user: User) {
    return new Promise((resolve, reject) =>
      this.axios
        .post("/auth/signup", user)
        .then((response) => {
          console.log(response);
          resolve("success");
        })
        .catch((error) => {
          reject(error);
        })
    );
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      this.axios
        .get(`auth/profile`)
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getUser(username: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .get(`/users/${username}`)
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  login(user: UserLogin) {
    return new Promise((resolve, reject) =>
      this.axios
        .post("/auth/signin", user)
        .then((response) => {
          this.axios.defaults.headers.common["Authorization"] =
            response.data.accessToken;
          localStorage.setItem("AuthToken", response.data.accessToken);
          console.log(response);
          resolve("success");
        })
        .catch((error) => {
          reject(error);
        })
    );
  }

  changeData(changedUser: User) {
    return new Promise((resolve, reject) => {
      this.axios
        .post("/auth/change-data", changedUser)
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.axios
        .get("/auth/logout")
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // ! CHANGE NAME OF THE METHOD !
  forgotPassword(email: string) {
    console.log(email);
    return new Promise((resolve, reject) => {
      this.axios
        .post("/auth/forgot-password", email)
        .then((response) => {
          console.log(response);
          resolve("success");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  resetPassword(token: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .post("/auth/reset-password", token)
        .then((response) => {
          console.log(response);
          resolve("success");
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getQueues() {
    return new Promise((resolve, reject) => {
      this.axios
        .get("/queues/get-queues")
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  addClientToQueue(queueId: string, username: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .post("/queues/add-user", { username, queueId })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createPlaceInQueue(
    queueId: string,
    username: string,
    phone: string,
    email: string,
    password: string
  ) {
    return new Promise((resolve, reject) => {
      this.axios
        .post("/queues/create-place", {
          username,
          queueId,
          phone,
          email,
          password,
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createQueue(name: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .post("/queues/create-queue", { name })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  findQueueById(id: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .get(`/queues/${id}`)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default new AxiosAPI("http://localhost:3000");
