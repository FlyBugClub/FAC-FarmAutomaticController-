import { createContext, useReducer } from "react";
//import Logger from "../Logger";
import AuthReducer, { INITIAL_STATE } from "../Context/AuthReducer";
export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, authDispatch] = useReducer(AuthReducer,INITIAL_STATE);
  return (
    <AuthContext.Provider
      value={{
        user:state.user,
        login:state.login,
        URL:state.URL,
        farmsct:state.farmsct,
        authDispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
