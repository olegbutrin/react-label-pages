import { DragEvent, SyntheticEvent, useCallback, useState } from "react";
import { getData, setSelected, updateData } from "../../services/actions";
import { useDispatch, useSelector } from "../../services/hooks";
import { moveItemByIDS, rawToData, removeByID } from "../../services/utils";
import Button, { IButtonComponent } from "../Button/Button";
import ItemInfo from "../ItemInfo/ItemInfo";
import ItemList from "../ItemList/ItemList";
import Spinner from "../Spinner/Spinner";
import "./App.scss";

const showConsoleBtnProps: IButtonComponent = {
  text: "Show Console",
  variant: "normal",
};

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
  const { rawData, data, request, error, selectedID } = useSelector(
    (store) => store.app
  );

  const [showConsole, setShowConsole] = useState<boolean>(false);

  // toggle console btn
  showConsoleBtnProps.onClick = useCallback(() => {
    setShowConsole(!showConsole);
  }, [showConsole, setShowConsole]);

  showConsoleBtnProps.text = showConsole ? "Hide Console" : "Show Console";

  // refresh data btn
  refreshBtnProps.onClick = useCallback(() => {
    dispatch(getData());
  }, [dispatch]);

  removeBtnProps.onClick = useCallback(() => {
    if (rawData !== null && selectedID !== null) {
      const nextRaw = removeByID(rawData, selectedID);
      const nextData = rawToData(nextRaw);
      dispatch(updateData(nextData));
    }
  }, [dispatch, rawData, selectedID]);

  // select item
  const setSelectedItem = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      const item = e.currentTarget as HTMLElement;
      const id = Number(item.getAttribute("data-id"));
      if (id) {
        dispatch(setSelected(id));
      }
    },
    [dispatch]
  );

  // drop item
  const onDrop = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      const current = e.currentTarget;
      current.classList.remove("dragover");
      const destID = current.getAttribute("data-id");
      const drop = e as DragEvent;
      if (drop.dataTransfer) {
        const srcID = drop.dataTransfer.getData("text/plain");
        if (rawData !== null) {
          const nextRaw = moveItemByIDS(rawData, Number(srcID), Number(destID));
          const nextData = rawToData(nextRaw);
          dispatch(updateData(nextData));
        }
      }
    },
    [dispatch, rawData]
  );

  return (
    <div className="App">
      <div className="Page">
        <div className="List">
          {request && <Spinner />}
          {error && <p className="Error">{error}</p>}
          {!request && error === "" && data && (
            <ItemList
              data={data}
              level={0}
              selectedID={selectedID}
              onClick={setSelectedItem}
              onDrop={onDrop}
            />
          )}
        </div>
        <div className="Info">
          <ItemInfo
            data={data}
            selectedID={selectedID}
            showConsole={showConsole}
          />
        </div>
        <div className="Footer">
          <Button key={"BTN_CONSOLE"} {...showConsoleBtnProps} />
          <Button key={"BTN_REFRESH"} {...refreshBtnProps} />
          <Button key={"BTN_REMOVE"} {...removeBtnProps} />
        </div>
      </div>
    </div>
  );
};

export default App;
