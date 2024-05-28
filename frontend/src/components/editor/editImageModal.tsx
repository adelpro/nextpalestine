import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { ReactNode, useLayoutEffect, useRef, useState } from 'react';
import CloseSVG from '@/components/editor/editorSVGS/close.svg';
import useEscapeKey from '@/hooks/useEscapeKeyHook';
import { $isImageNode } from './nodes/imageNode';
import { $getNodeByKey } from 'lexical';
import NextImage from 'next/image';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  nodeKey: string;
  onConfirm: ({
    altText,
    width,
    height,
  }: {
    altText: string;
    width: number;
    height: number;
  }) => void;
};
export default function EditImageModal({
  isOpen,
  setIsOpen,
  nodeKey,
  onConfirm,
}: Props): ReactNode {
  const [editor] = useLexicalComposerContext();
  const defaultValues = editor.getEditorState().read(() => {
    const node = $getNodeByKey(nodeKey);
    if ($isImageNode(node)) {
      return {
        altText: node.getAltText(),
        width: node.getWidth(),
        height: node.getHeight(),
      };
    }
    return {
      altText: '',
      width: '',
      height: '',
    };
  });
  const [altText, setAltText] = useState<string>(defaultValues.altText);
  const [width, setWidth] = useState(defaultValues.width);
  const [height, setHeight] = useState(defaultValues.height);

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEscapeKey(() => setIsOpen(false));

  const reset = () => {
    editor.getEditorState().read(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        setAltText(node.getAltText());
        setWidth(node.getWidth());
        setHeight(node.getHeight());
      }
    });
  };

  useLayoutEffect(() => {
    if (isOpen && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    } else if (!isOpen && dialogRef.current?.open) {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    onConfirm({ altText, width: Number(width), height: Number(height) });
    reset();
    setIsOpen(false);
  };

  const handleCancel = () => {
    reset();
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
      aria-describedby="image-modal-content"
      className="fixed z-10 w-full max-w-xl p-0 mx-auto my-auto overflow-y-hidden origin-top top-50 left-50 -translate-x-50 -translate-y-50 rounded-xl backdrop:bg-gray-800/50 animate-slideInWithFade"
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
      <main className={'p-2'}>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xl font-bold text-gray-700 hover:text-gray-900"
            onClick={handleCancel}
            aria-label="Close"
          >
            <NextImage src={CloseSVG} alt="close" width={30} height={30} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center w-full p-2 mx-auto border border-gray-300 rounded-md md:p-3">
          <h1 className="text-2xl font-bold">Update image</h1>

          <div className="relative flex flex-col m-1 gap-y-3">
            <input
              type="text"
              id="altText"
              aria-label="Add an alt text"
              title="Add an alternative text"
              placeholder="Add an alt text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-3">
              <div className="flex items-center justify-center">
                <input
                  type="number"
                  id="width"
                  aria-label="Add a custom width"
                  title="Add a custom width"
                  placeholder="Custom width (default)"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="ml-1 text-gray-500">px</span>
              </div>
              <div className="flex items-center justify-center">
                <input
                  type="number"
                  id="height"
                  aria-label="Add a custom height"
                  title="Add a custom height"
                  placeholder="Custom height (default)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="ml-1 text-gray-500">px</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-2 mx-1 my-2 md:flex-row">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full max-w-md px-4 py-2 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600 disabled:cursor-not-allowed disabled:bg-brand-CTA-blue-300"
            >
              Update Image
            </button>

            <button
              className="w-full max-w-md px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </dialog>
  );
}
