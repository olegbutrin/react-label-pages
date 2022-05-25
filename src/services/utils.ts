import { DragEvent, SyntheticEvent } from "react";
import { TRawData, TItem } from "../types";

export const arrayMove = (
  array: Array<any>,
  fromIndex: number,
  toIndex: number
) => {
  const copy = array[fromIndex];
  return [...array].reduce((res, item, index) => {
    return index === fromIndex
      ? res
      : index === toIndex
      ? res.concat([copy, item])
      : res.concat([item]);
  }, []);
};

export const moveItemByIDS: (
  raw: TRawData,
  srcID: number,
  destID: number
) => TRawData = (raw, srcID, destID) => {
  const alter = JSON.parse(JSON.stringify(raw));
  let fromIndex = alter.entityLabelPages[0].entityLongIds.indexOf(srcID);
  let toIndex = alter.entityLabelPages[0].entityLongIds.indexOf(destID);
  // change parent id for new position
  alter.entityLabelPages[0].parentEntityLongIds[fromIndex] =
    alter.entityLabelPages[0].parentEntityLongIds[toIndex];
  if (fromIndex > -1 && toIndex > -1 && fromIndex !== toIndex) {
    // move item
    alter.entityLabelPages[0].entityLongIds = arrayMove(
      alter.entityLabelPages[0].entityLongIds,
      fromIndex,
      toIndex
    );
    alter.entityLabelPages[0].parentEntityLongIds = arrayMove(
      alter.entityLabelPages[0].parentEntityLongIds,
      fromIndex,
      toIndex
    );
    alter.entityLabelPages[0].labels = arrayMove(
      alter.entityLabelPages[0].labels,
      fromIndex,
      toIndex
    );
  }
  return alter;
};

export const removeByID: (raw: TRawData, id: number) => TRawData = (
  raw,
  id
) => {
  const alter = JSON.parse(JSON.stringify(raw));
  const index = alter.entityLabelPages[0].entityLongIds.indexOf(id);
  if (index > -1) {
    alter.entityLabelPages[0].entityLongIds.splice(index, 1);
    alter.entityLabelPages[0].parentEntityLongIds.splice(index, 1);
    alter.entityLabelPages[0].labels.splice(index, 1);
  }
  return alter;
};

// deprecated, but keep in mind
export const removeByID_old: (root: TItem, id: number) => TItem = (
  root,
  id
) => {
  const items = root.items
    ? [
        ...root.items
          .filter((item) => {
            return item.id !== id;
          })
          .map((item) => {
            return removeByID_old(item, id);
          }),
      ]
    : root.items;
  return { ...root, items: items } as TItem;
};

export const itemByID = (root: TItem, id: number) => {
  if (root.id === id) {
    return root;
  }
  if (root.items) {
    let result: TItem | null = null;
    root.items.every((item) => {
      const sub = itemByID(item, id);
      if (sub) {
        result = sub;
        return false;
      } else {
        return true;
      }
    });
    return result;
  }
  return null;
};

export const rawToData: (raw: TRawData) => TItem = (raw) => {
  const src = raw.entityLabelPages[0];
  const unbounded: Array<TItem> = [];
  const root: TItem = {
    id: -1,
    label: "root",
    parentID: -999,
  };
  src.labels.forEach((label, index) => {
    const id = src.entityLongIds[index];
    const pid = src.parentEntityLongIds[index];
    if (label !== undefined && id !== undefined && pid !== undefined) {
      const child: TItem = {
        id: id,
        label: label,
        parentID: pid,
      };
      const parent = itemByID(root, pid);
      if (parent) {
        if (parent.items === undefined) {
          parent.items = [];
        }
        parent.items.push(child);
      } else {
        unbounded.push(child);
      }
    }
  });
  unbounded.forEach((child) => {
    const parent = itemByID(root, child.parentID);
    if (parent) {
      if (parent.items === undefined) {
        parent.items = [];
      }
      parent.items.push(child);
    }
  });
  return root;
};

// drag events
export const onDragStart = (e: SyntheticEvent) => {
  const current = e.currentTarget;
  const drag = e as DragEvent;
  const id = current.getAttribute("data-id");
  if (id && drag.dataTransfer) {
    drag.dataTransfer.setData("text/plain", id);
    drag.dataTransfer.dropEffect = "move";
  }
};

export const onDragOver = (e: SyntheticEvent) => {
  e.preventDefault();
  const drag = e as DragEvent;
  if (drag.dataTransfer) {
    drag.dataTransfer.dropEffect = "move";
  }
};

export const onDragEnter = (e: SyntheticEvent) => {
  e.preventDefault();
  const current = e.currentTarget;
  current.classList.add("dragover");
};

export const onDragLeave = (e: SyntheticEvent) => {
  e.preventDefault();
  const current = e.currentTarget;
  current.classList.remove("dragover");
};
