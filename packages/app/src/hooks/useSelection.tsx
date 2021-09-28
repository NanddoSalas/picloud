import { useState } from 'react';

const useSelection = () => {
  const [isSelectionEnabled, setIsSelectionEnabled] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const enableSelection = (id?: string) => {
    if (id) setSelectedItems([id]);
    else setSelectedItems([]);
    setIsSelectionEnabled(true);
  };

  const disableSelection = () => {
    setIsSelectionEnabled(false);
    setSelectedItems([]);
  };

  const handleSelection = (id: string) => {
    const index = selectedItems.indexOf(id);

    if (index === -1) {
      setSelectedItems((current) => [...current, id]);
    } else if (selectedItems.length === 1) {
      disableSelection();
    } else setSelectedItems((current) => current.filter((v) => v !== id));
  };

  const selectAll = (id: string[]) => setSelectedItems(id);

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
