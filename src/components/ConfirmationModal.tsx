"use client";

import { X } from "lucide-react";

interface ConfirmationModal {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

const ConfirmationModal = ({ setModal, children }: ConfirmationModal) => {
  return (
    <div className="fixed top-0 left-0 min-w-full h-screen bg-black/80 flex justify-center items-center z-[99]">
      <div className="relative min-w-[40%]  rounded-lg bg-white p-6">
        <X
          onClick={() => setModal(false)}
          className=" absolute top-2 right-4"
          color="red"
          size={32}
        />
        {children}
      </div>
    </div>
  );
};

export default ConfirmationModal;
