export type Photo = {
  id: string;
  filename: string;
  creationTime: number;
  uri: string;
};

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
