const INITIAL_STATE = {
  URL: "http://10.101.172.53:8080",
  login: {},
  user: {},
};
const AuthReducer = (state, action) => {
  //action = {type, payload: {tab, visual, setting, lastid, name, control}}
  // var x,y,z,t,n,c;
  switch (action.type) {
    case "URL":
      return {
        ...state,
        URL:action.payload,
      }
    case "SET_LOGIN":
      return {
        ...state,
        login: action.payload, 
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state;
  }
};
export { INITIAL_STATE };
export default AuthReducer;
