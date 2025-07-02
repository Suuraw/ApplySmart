import { axiosInstance } from "./reqBodyTemplate";

interface FireBaseUser {
  email: string | null;
  name: string | null;
  photo: string | null;
  token: string | undefined;
}
interface LocalLoginUser {
  email: string | null;
  photo: string | null;
  password: string | null;
  provider: string | null;
}
class authenticateUsers {
  loginFirebase = async (user: FireBaseUser, endpoint: string) => {
    console.log("User data:-->", user);
    console.log(endpoint);

    if (user.email === null || user.name === null || user.token === undefined) {
      return new Error("Insufficient user data");
    }
    console.log("No error so far");

    try {
      // Attempting to send the POST request
      const response = await axiosInstance.post(`/${endpoint}`, user);
      console.log("Response Data: ", response.data);
      console.log(response.data.data.token);

      // Store token in localStorage
      localStorage.setItem("token", response.data.data.token);
      return response.data.data.token;
    } catch (error) {
      // Catch any error during the API request
      console.error("Error occurred while logging in:", error);
      return new Error("Login failed. Please try again.");
    }
  };
  localLogin = async (user: LocalLoginUser, endpoint: string) => {
    try {
      const response = await axiosInstance.post(`/${endpoint}`, user);
      localStorage.setItem("token", response.data.data.token);
      return response.data.data.token;
    } catch (error) {}
  };
}

export default authenticateUsers;
