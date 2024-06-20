const INITIAL_STATE = {
  URL: "http://172.31.8.230:3001",
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
    case "LOAD_USERS":
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload]: action.payload,
        },
      };
    
    default:
      return state;
  }
};
export { INITIAL_STATE };
export default AuthReducer;
