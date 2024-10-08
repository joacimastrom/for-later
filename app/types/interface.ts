export type User = {
  _id: string;
  name: string;
  email: string;
};

export enum ItemType {
  TEXT = "text",
  FILE = "file",
}

export type ItemFile = {
  url: string;
  name: string;
  size: number;
  type: string;
};

export type Item = {
  _id: string;
  type: ItemType;
  text?: string;
  files?: ItemFile[];
  createdAt: Date;
};
