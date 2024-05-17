"use client";

import { X } from "lucide-react";

interface FullScreenModal<T> {
  modalCloseValue: T;
  setModal: React.Dispatch<React.SetStateAction<T>>;
  children: React.ReactNode;
}

const FullScreenModal = <T,>({
  modalCloseValue,
  setModal,
  children,
}: FullScreenModal<T>) => {
  return (
    <div className="fixed top-0 left-0 min-w-full h-screen bg-black/80 flex justify-center items-center z-[999]">
      <X
        onClick={() => setModal(modalCloseValue as T)}
        className=" absolute top-2 right-4 z-50 cursor-pointer"
        color="red"
        size={40}
      />
      {children}
    </div>
  );
};

export default FullScreenModal;
