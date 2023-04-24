import axios, { Axios } from "axios";
import isEmail from "validator/lib/isEmail";

interface User {
  username: string;
  password: string;
  phone: string;
  email: string;
}

interface Place extends User {
  roles: string;
  queueId: string;
}

interface UserLogin {
  username: string;
  password: string;
}

interface Appointment {
  place: string;
  time: Date;
}

interface userDeletion {
  queueId: string;
  userId: string;
}

class AxiosAPI {
  private axios: Axios;

  constructor(private baseURL: string) {
    this.axios = axios.create({
      baseURL,
      timeout: 9000,
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

  addClientToQueue(
    queueId: string,
    username: string,
    appointment: Appointment
  ) {
    return new Promise((resolve, reject) => {
      this.axios
        .post("/queues/add-client", { username, queueId, appointment })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  addPlaceToQueue(queueId: string, username: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .post("/queues/add-place", { username, queueId })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  createPlaceInQueue(place: Place) {
    return new Promise((resolve, reject) => {
      this.axios
        .post("/queues/create-place", place)
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

  deleteQueue(queueId: string) {
    return new Promise((resolve, reject) => {
      this.axios
        .patch("/queues/delete-queue", { queueId })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  deleteClient(data: userDeletion) {
    return new Promise((resolve, reject) => {
      this.axios
        .patch("/queues/delete-client", data)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  deletePlace(data: userDeletion) {
    return new Promise((resolve, reject) => {
      this.axios
        .patch("/queues/delete-place", data)
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
