export type Photo = {
  id: number;
  createdAt: number;
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
