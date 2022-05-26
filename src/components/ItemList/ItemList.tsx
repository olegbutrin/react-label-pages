import { SyntheticEvent, useCallback, useState } from "react";
import { TItem } from "../../types";
import {
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
} from "../../services/utils";

import "./ItemList.scss";

export interface IItemListComponent {
  data: TItem;
  level: number;
  selectedID: number | null;
  onClick: (e: SyntheticEvent) => void;
  onDrop: (e: SyntheticEvent) => void;
}

const ListItem = ({
  data,
  level,
  selectedID,
  onClick,
  onDrop,
}: IItemListComponent) => {
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
        draggable={true}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
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
          className={
            ["ItemList", "level" + level].join(" ") +
            (!isVisible ? " hidden" : "")
          }
        >
          {data.items.map((item) => {
            return (
              <ListItem
                key={item.id}
                data={item}
                level={level + 1}
                selectedID={selectedID}
                onClick={onClick}
                onDrop={onDrop}
              />
            );
          })}
        </ul>
      )}
    </li>
  );
};

const ItemList = ({
  data,
  level,
  selectedID,
  onClick,
  onDrop,
}: IItemListComponent) => {
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
                onDrop={onDrop}
              />
            );
          })}
      </ul>
    </div>
  );
};

export default ItemList;
