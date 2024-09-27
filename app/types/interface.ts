export type User = {
  _id: string;
  name: string;
  email: string;
};

export enum ItemType {
  TEXT = "text",
  FILE = "file",
}

export type Item = {
  _id: string;
  type: ItemType;
  data: string;
  createdAt: Date;
};
