import { useState } from "react";

export const useConfirmDialog = () => {
  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    data: null,
  });

  const showConfirmDialog = (data = null) => {
    setConfirmDialog({
      visible: true,
      data: data,
    });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog({
      visible: false,
      data: null,
    });
  };

  const handleConfirm = () => {
    const { data } = confirmDialog;
    hideConfirmDialog();
    return data;
  };

  const handleCancel = () => {
    hideConfirmDialog();
  };

  return {
    confirmDialog,
    showConfirmDialog,
    hideConfirmDialog,
    handleConfirm,
    handleCancel,
  };
};
