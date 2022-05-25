import { SyntheticEvent, useCallback, useState } from "react";
import { TItem } from "../../types";

import "./ItemList.scss";

export interface IItemListComponent {
  data: TItem;
  level: number;
  selectedID: number | null;
  onClick: (e: SyntheticEvent) => void;
}

const ListItem = ({ data, level, selectedID, onClick }: IItemListComponent) => {
  const [isVisible, setVisible] = useState<boolean>(true);
  const onSwapVisible = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setVisible(!isVisible);
    },
    [isVisible, setVisible]
  );

  return (
    <li className={["ListItem", "level" + level].join(" ")}>
      <div
        className={
          ["ListItemBox", "level" + level].join(" ") +
          (data.id === selectedID ? " selected" : "")
        }
        data-id={data.id}
        onClick={onClick}
      >
        <div className={"Text"}>{data.label}</div>
        {data.items && (
          <div
            className={"Control " + (isVisible ? "on" : "off")}
            onClick={onSwapVisible}
          ></div>
        )}
      </div>
      {data.items && (
        <ul
          className={["ItemList", "level" + level].join(" ")}
          hidden={!isVisible}
        >
          {data.items.map((item) => {
            return (
              <ListItem
                key={item.id}
                data={item}
                level={level + 1}
                selectedID={selectedID}
                onClick={onClick}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

const ItemList = ({ data, level, selectedID, onClick }: IItemListComponent) => {
  return (
    <div className="Container">
      <ul className="ItemList">
        {data.items &&
          data.items.map((item) => {
            return (
              <ListItem
                key={item.id}
                data={item}
                level={level + 1}
                selectedID={selectedID}
                onClick={onClick}
              />
            );
          })}
      </ul>
    </div>
  );
};

export default ItemList;
