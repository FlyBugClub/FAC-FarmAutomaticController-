const INITIAL_STATE = {
    
  users: {},
};

const AuthReducer = (state, action) => {
  //action = {type, payload: {tab, visual, setting, lastid, name, control}}
  // var x,y,z,t,n,c;
  switch (action.type) {
    case "LOAD_USERS":
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload]: action.payload,
        },
      };
    case "SET_CONFIG":
      return {
        ...state,
        config: action.payload,
      };
    case "SET_CONTROL":
      return {
        ...state,
        control: action.payload,
      };

    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      };
    case "LOAD_VISUAL":
      return {
        ...state,
        visual: {
          ...state.visual,
          [action.payload.tab]: action.payload.visual,
        },
      };
    case "LOAD_SETTING":
      return {
        ...state,
        setting: {
          ...state.setting,
          [action.payload.tab]: action.payload.setting,
        },
      };
    case "LOAD_ID":
      return {
        ...state,
        lastid: action.payload,
      };
    case "REMOVE_NAME":
      var newname = state.name;
      delete newname[action.payload];

      return {
        ...state,
        name: newname,
      };
    case "RE_NAME":
      return {
        ...state,
        name: action.payload,
      };
    case "RESET_TOOL":
      return {
        config: {},
        lastid: {},
        visual: {},
        setting: {},
        name: {},
        control: {},
      };
    default:
      return state;
  }
};

export { INITIAL_STATE };
export default AuthReducer;
