export type TRawData = {
  entityLabelPages: [
    {
      labels: Array<string>;
      entityLongIds: Array<number>;
      parentEntityLongIds: Array<number>;
    }
  ];
};

export type TItem = {
  label: string;
  id: number;
  parentID: number;
  items?: Array<TItem>;
};

export type TAppStore = {
  rawData: TRawData | null;
  data: TItem | null;
  selectedID: number | null;
  request: boolean;
  error: string;
};
