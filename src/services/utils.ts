import {TRawData, TItem} from "../types";

export const itemByID = (root: TItem, id: number) => {
  if (root.id === id) {
    return root;
  }
  if (root.items) {
    let result: TItem | null = null;
    root.items.every((item) =>{
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
} 

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
        }
        parent.items.push(child);
      }
    }
  })
  return root;
}