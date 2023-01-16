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
      timeout: 1000,
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
}

export default new AxiosAPI("http://localhost:3000");
