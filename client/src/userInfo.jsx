import { createContext } from "react";

const UserInfoContext = createContext({
  userInfo: {},
  setUserInfo: () => {},
});

export default UserInfoContext;