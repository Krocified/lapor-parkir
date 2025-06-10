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

  const handleConfirm = (callback) => {
    const { data } = confirmDialog;
    hideConfirmDialog();
    if (callback) {
      callback(data);
    }
  };

  const handleCancel = (callback) => {
    hideConfirmDialog();
    if (callback) {
      callback();
    }
  };

  return {
    confirmDialog,
    showConfirmDialog,
    hideConfirmDialog,
    handleConfirm,
    handleCancel,
  };
};
