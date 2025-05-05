
import { axiosInstance } from "./reqBodyTemplate";
interface userType {
  email: string | null;
  name: string | null;
  photo: string | null;
  token: string | undefined;
}


class authenticateUsers {
  loginFirebase = async (user: userType,endpoint:string) => {
    if (user.email === null || user.name === null || user.token === undefined)
      return new Error("Insufficient user data");
    const response = await axiosInstance.post(`/${endpoint}`, user);
    console.log(response.data.data.token);
    localStorage.setItem("token",response.data.data.token)
    return response.data.data.token;
  };
}
export default authenticateUsers;
