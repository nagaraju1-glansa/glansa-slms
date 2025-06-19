import { combineReducers } from "redux";
import permissionReducer from "./permissionReducer";

// other reducers
import Layout from "./layoutReducer";
// import Auth from "./authReducer"; etc.

const rootReducer = combineReducers({
  Layout,
  permission: permissionReducer,
  // Add others here
});

export default rootReducer;
