import { combineReducers, Reducer } from "redux";
import * as constants from "./constants";
import { TAppStore } from "../types";
import { TAppActions } from "./actions";

export const initialState: TAppStore = {
  rawData: null,
  data: null,
  selectedID: null,
  request: false,
  error: "",
};

export const appReducer: Reducer<TAppStore, TAppActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case constants.DATA_REQUEST:
      return { ...state, request: true };
    case constants.DATA_ERROR:
      return { ...state, request: false, error: action.payload };
    case constants.DATA_SUCCESS:
      return { ...state, request: false, error: "", rawData: action.payload };
    case constants.SET_DATA:
      return {
        ...state,
        data: action.payload,
        selectedID: initialState.selectedID,
      };
    case constants.SET_SELECTED:
      return {
        ...state,
        selectedID: state.selectedID === action.payload ? null : action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({ app: appReducer });
