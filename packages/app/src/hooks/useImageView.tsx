import { useState } from 'react';

const useImageView = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(-1);

  const showImageView = (index: number) => {
    setImageIndex(index);
    setIsVisible(true);
  };

  const hiddeImageView = () => setIsVisible(false);

  return {
    isVisible,
    imageIndex,
    showImageView,
    hiddeImageView,
  };
};

export default useImageView;
