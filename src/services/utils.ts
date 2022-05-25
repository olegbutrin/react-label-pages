import { TRawData, TItem } from "../types";

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
  const root: TItem = {
    id: -1,
    label: "root",
    parentID: -999,
  };
  src.labels.forEach((label, index) => {
    const id = src.entityLongIds[index];
    const pid = src.parentEntityLongIds[index];
    if (label !== undefined && id !== undefined && pid !== undefined) {
      const parent = itemByID(root, pid);
      if (parent) {
        if (parent.items === undefined) {
          parent.items = [];
        }
        const child: TItem = {
          id: id,
          label: label,
          parentID: pid,
        };
        parent.items.push(child);
      }
    }
  });
  return root;
};
