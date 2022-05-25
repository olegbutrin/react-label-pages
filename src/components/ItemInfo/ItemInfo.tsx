import { useEffect, useState } from "react";
import { itemByID } from "../../services/utils";
import { TItem } from "../../types";

import "./ItemInfo.scss";

interface IInfoBoxComponent {
  item: TItem;
}

const InfoBox = ({ item }: IInfoBoxComponent) => {
  return (
    <div className="InfoBox">
      <div>
        <strong>Label:</strong>
      </div>
      <div>{item.label}</div>
      <div>
        <strong>ID:</strong>
      </div>
      <div>{item.id}</div>
      <div>
        <strong>Parent ID:</strong>
      </div>
      <div>{item.parentID}</div>
    </div>
  );
};

interface IInfoConsole {
  item: TItem;
}

const InfoConsole = ({ item }: IInfoConsole) => {
  return (
    <div className="Console">
      <pre>{JSON.stringify(item, undefined, 2)}</pre>
    </div>
  );
};

interface IItemInfoComponent {
  data: TItem | null;
  selectedID: number | null;
  showConsole: boolean;
}

const ItemInfo = ({ data, selectedID, showConsole }: IItemInfoComponent) => {
  const [selectedItem, setSelectedItem] = useState<TItem | null>(null);

  useEffect(() => {
    if (data === null || selectedID === null) {
      setSelectedItem(null);
    } else {
      const item = itemByID(data, selectedID);
      setSelectedItem(item);
    }
  }, [data, selectedID, setSelectedItem]);

  return (
    <div className="ItemInfo">
      {selectedItem == null ? (
        <div className="Dummy"></div>
      ) : (
        <InfoBox item={selectedItem} />
      )}
      {showConsole && data != null && <InfoConsole item={data} />}
    </div>
  );
};

export default ItemInfo;
