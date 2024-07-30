const INITIAL_STATE = {
  URL: "http://103.130.211.141:8080",
  login: {},
  user: {},
  farmsct:[],
  currentFarm: {},
  currentDevice: {},
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
    case "SET_FARM":
      return {
        ...state,
        farmsct : action.payload, 
      }
      case "SET_CURRENT_FARM":
      return {
        ...state,
        currentFarm : action.payload, 
      }
      case "SET_CURRENT_DEVICE":  
      return {
        ...state,
        currentDevice : action.payload, 
      }
    default:
      return state;
  }
};
export { INITIAL_STATE };
export default AuthReducer;
