import { useState } from 'react';

const useSelection = <T extends {}>() => {
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const enableSelection = (value?: T) => {
    if (value) setSelectedItems([value]);
    else setSelectedItems([]);
    setIsSelectionEnabled(true);
  };

  const disableSelection = () => {
    setIsSelectionEnabled(false);
    setSelectedItems([]);
  };

  const handleSelection = (value: T) => {
    const index = selectedItems.indexOf(value);

    if (index === -1) {
      setSelectedItems((current) => [...current, value]);
    } else if (selectedItems.length === 1) {
      disableSelection();
    } else setSelectedItems((current) => current.filter((v) => v !== value));
  };

  const selectAll = (value: T[]) => setSelectedItems(value);

  const deselectAll = () => setSelectedItems([]);

  return {
    isSelectionEnabled,
    selectedItems,
    enableSelection,
    disableSelection,
    handleSelection,
    selectAll,
    deselectAll,
  };
};

export default useSelection;
