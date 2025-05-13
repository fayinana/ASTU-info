/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from "react";

interface UseModalOptions {
  initialOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const useModal = (options: UseModalOptions = {}) => {
  const { initialOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState<any>(null);

  const open = useCallback(
    (modalData: any = null) => {
      setIsOpen(true);
      setData(modalData);
      onOpen?.();
    },
    [onOpen]
  );

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      onClose?.();
    } else {
      onOpen?.();
    }
  }, [isOpen, onOpen, onClose]);

  return {
    isOpen,
    open,
    close,
    toggle,
    data,
  };
};

export default useModal;
