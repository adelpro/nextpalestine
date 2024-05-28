import React, { ReactNode, useLayoutEffect, useRef } from 'react';
import useEscapeKey from '@/hooks/useEscapeKeyHook';

type Props = {
  isOpen: boolean;
  text: string;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
};
export default function DeleteUserModal({
  isOpen,
  setIsOpen,
  text,
  onConfirm,
}: Props): ReactNode {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEscapeKey(() => setIsOpen(false));
  useLayoutEffect(() => {
    if (isOpen && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    } else if (!isOpen && dialogRef.current?.open) {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  };

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={(e) => {
        if (e.target === dialogRef.current) {
          setIsOpen(false);
        }
      }}
      className="fixed z-10 p-0 origin-top top-50 left-50 -translate-x-50 -translate-y-50 rounded-xl backdrop:bg-gray-800/50 animate-slideInWithFade"
    >
      {/**
       * How the backdrop close modal is working?
       *  - Add onClick to dialog :
       * onClick={(e) => {
       *   if (e.target === dialogRef.current) {
       *     setIsOpen(false);
       *   }
       * }}
       * - Add p-0 to the dialog
       * - Add a container div inside the dialig
       * */}
      <main className="p-5 pb-10">
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xl font-bold text-gray-700 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            X
          </button>
        </div>
        <p className="mb-2 text-lg font-bold">{text}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 mr-2 font-bold text-gray-800 rounded bg-brand-CTA-dark-200 hover:bg-brand-CTA-dark-500 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 font-bold text-white rounded bg-brand-CTA-red-500 hover:bg-brand-CTA-red-600 focus:outline-none"
          >
            Confirm
          </button>
        </div>
      </main>
    </dialog>
  );
}
