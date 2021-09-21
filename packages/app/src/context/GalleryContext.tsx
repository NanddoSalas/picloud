import { createContext } from 'react';
import { Photo } from '../types';

interface GalleryContextInterface {
  folders: string[];
  getPhotos: (folderName: string) => Photo[];
  getBackground: (folderName: string) => string;
  reload: () => void;
}

const GalleryContext = createContext<GalleryContextInterface>({
  folders: [],
  getPhotos: () => [],
  getBackground: () => '',
  reload: () => {},
});

export default GalleryContext;
