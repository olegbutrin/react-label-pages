import axios, { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { TItem, TRawData } from "../types";
import * as constants from "./constants";
import { rawToData } from "./utils";

const DATA_URL =
  "https://api.github.com/gists/e1702c1ef26cddd006da989aa47d4f62";

export interface IDataRequest {
  readonly type: typeof constants.DATA_REQUEST;
}

export interface IDataSuccess {
  readonly type: typeof constants.DATA_SUCCESS;
  readonly payload: TRawData;
}

export interface IDataError {
  readonly type: typeof constants.DATA_ERROR;
  readonly payload: string;
}

export interface ISetData {
  readonly type: typeof constants.SET_DATA;
  readonly payload: TItem;
}

export interface ISetSelected {
  readonly type: typeof constants.SET_SELECTED;
  readonly payload: number;
}

export type TAppActions = IDataRequest | IDataSuccess | IDataError | ISetData | ISetSelected;

export const getData = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: constants.DATA_REQUEST });
    axios
      .get(DATA_URL)
      .then((value: AxiosResponse<any, any>) => {
        const rawData = JSON.parse(
          value.data.files["view.json"].content
        ) as TRawData;
        dispatch({ type: constants.DATA_SUCCESS, payload: rawData });
        const data = rawToData(rawData);
        dispatch({ type: constants.SET_DATA, payload: data });
      })
      .catch((error: Error) => {
        dispatch({ type: constants.DATA_ERROR, payload: error.message });
      });
  };
};

export const setSelected = (id:number) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: constants.SET_SELECTED, payload: id });
  }
}
