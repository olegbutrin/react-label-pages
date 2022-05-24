import axios, { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { TRawData } from "../types";
import * as constants from "./constants";

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

export type TAppActions = IDataRequest | IDataSuccess | IDataError;

export const getData = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: constants.DATA_REQUEST });
    axios
      .get(DATA_URL)
      .then((value: AxiosResponse<any, any>) => {
        const data = JSON.parse(
          value.data.files["view.json"].content
        ) as TRawData;
        dispatch({ type: constants.DATA_SUCCESS, payload: data });
      })
      .catch((error: Error) => {
        dispatch({ type: constants.DATA_ERROR, payload: error.message });
      });
  };
};
