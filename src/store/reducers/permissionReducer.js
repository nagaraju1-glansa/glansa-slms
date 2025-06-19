import { SET_PERMISSIONS } from "../actions/permissionActions";

const initialState = {
  list: [],
};

const permissionReducer = (state = initialState, action) => {
     if (action.type === "SET_PERMISSIONS") {
        console.log("Reducer received SET_PERMISSIONS with payload:", action.payload);
    }

  switch (action.type) {
    case SET_PERMISSIONS:
      return {
        ...state,
        list: action.payload,
      };

    default:
      return state;
  }
};

export default permissionReducer;
