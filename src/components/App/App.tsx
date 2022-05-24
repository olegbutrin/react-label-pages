import { useCallback } from "react";
import { getData } from "../../services/actions";
import { useDispatch } from "../../services/hooks";
import Button, { IButtonComponent } from "../Button/Button";
import "./App.scss";

const refreshBtnProps: IButtonComponent = {
  text: "Refresh",
  variant: "normal",
};

const removeBtnProps: IButtonComponent = {
  text: "Remove",
  variant: "warning",
};

const App = () => {
  const dispatch = useDispatch();

  refreshBtnProps.onClick = useCallback(() => {
    dispatch(getData());
  }, [dispatch]);


  return (
    <div className="App">
      <div className="Page">
        <div className="List">ITEM LIST</div>
        <div className="Info">ITEM INFO</div>
        <div className="Footer">
          <Button key={"BTN_REFRESH"} {...refreshBtnProps} />
          <Button key={"BTN_REMOVE"} {...removeBtnProps} />
        </div>
      </div>
    </div>
  );
};

export default App;
