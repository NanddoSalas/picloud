export type PhotoId = number | string;

export interface Photo {
  id: PhotoId;
  filename: string;
  creationTime: number;
  uri: string;
}

export type StackParams = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  Account: undefined;
  Folder: {
    name: string;
  };
};

export type TabParams = {
  Photos: undefined;
  Gallery: undefined;
};
