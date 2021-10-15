import React from 'react';

export type StackParams = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  Album: {
    albumId: string;
    albumName: string;
  };
};

export type TabParams = {
  Photos: undefined;
  Gallery: undefined;
};

export type HeaderOperation = {
  name: string;
  icon: () => React.ReactElement;
  onPress: (selectedItems: any[]) => void;
  position: 'header' | 'actionsSheet';
};

export type Asset = {
  id: string;
  uri: string;
};

export type BackedUpAssetStatus =
  | 'PENDING'
  | 'UPLOADING'
  | 'BACKEDUP'
  | 'ERROR';

export type BackedUpAsset = {
  localId: string;
  remoteId: string | null;
  status: BackedUpAssetStatus;
};
