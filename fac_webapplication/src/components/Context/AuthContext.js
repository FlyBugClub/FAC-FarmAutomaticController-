import { createContext, useReducer } from "react";
//import Logger from "../Logger";
import AuthReducer, {INITIAL_STATE} from "../Context/AuthReducer";
export const AuthContext = createContext(INITIAL_STATE);

// const apiURL = "http://10.101.172.53:8080";// run on server
// const apiURL = "http://103.130.211.141:8080"; //http://103.130.211.141:8080/ run on local
const apiURL = "http://172.31.8.230:3001"; // run on dat

export const AuthContextProvider =({children})=>{
    const [state, authDispatch] = useReducer(AuthReducer, INITIAL_STATE);
    return (
        <AuthContext.Provider value = {{
                users:state.users,  
                authDispatch
            }}>
            {children}
        </AuthContext.Provider>
    )
}
