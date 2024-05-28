import React, {
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import { $createLinkNode, $isLinkNode } from '@lexical/link';
import getSelectedNode from './utils/getSelectedNode';
import useEscapeKey from '@/hooks/useEscapeKeyHook';
import { isValidURL } from '@/utils/isValidURL';
import { mergeRegister } from '@lexical/utils';
import { formatURL } from '@/utils/formatURL';
import { cn } from '@/utils/cn';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export default function LinkModal({ isOpen, setIsOpen }: Props): ReactNode {
  const [title, setTitle] = useState<string | undefined>();
  const [editor] = useLexicalComposerContext();
  const [url, setUrl] = useState<string | undefined>();
  const [isError, setIsError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEscapeKey(() => setIsOpen(false));

  const reset = () => {
    setTitle('');
    setUrl('');
    setIsError(false);
  };
  useLayoutEffect(() => {
    if (isOpen && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    } else if (!isOpen && dialogRef.current?.open) {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const updateEditorData = useCallback(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) return;
    const node = getSelectedNode(selection);
    if (!node) return;
    const parent = node.getParent();

    setTitle(selection?.getTextContent());

    if ($isLinkNode(node)) setUrl(node.getURL());
    else if ($isLinkNode(parent)) setUrl(parent.getURL());
  }, []);

  useLayoutEffect(() => {
    mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateEditorData();
        });
      }),
    ),
      [editor, updateEditorData];
  });

  const handleConfirm = () => {
    if (!isValidURL(url)) {
      alert('Please enter a valid URL');
      return;
    }
    const formated_URL = formatURL(url);
    if (!formated_URL) {
      alert('Please enter a valid URL');
      return;
    }
    editor.getEditorState().read(() => {
      editor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          const textNode = $createTextNode(title || formated_URL);
          const linkNode = $createLinkNode(formated_URL);
          linkNode.setTitle(title || '');
          linkNode.setTarget('_blank');
          linkNode.setRel('noopener noreferrer');
          linkNode.append(textNode);
          selection.insertNodes([linkNode]);
        }
      });
    });

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
      <main className={cn('p-5 pb-10', { 'border border-red-600': isError })}>
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

        <h2 className="mb-4 text-2xl font-bold">Insert Link</h2>
        <hr className="mb-4" />
        <div className="flex flex-col">
          <label
            className="flex items-center justify-between gap-2 mb-2 text-sm text-gray-700"
            htmlFor="title"
          >
            Title
            <input
              type="text"
              id="titleInput"
              // autoFocus
              placeholder="Title (optional)"
              className="p-2 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
              value={title || ''}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label
            className="flex items-center justify-between gap-2 mb-2 text-sm text-gray-700"
            htmlFor="url"
          >
            URL
            <input
              type="url"
              id="urlInput"
              placeholder="https://"
              className="p-2 border border-gray-400 rounded-md focus:outline-none focus:border-blue-500"
              value={url || ''}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
          <div className="flex justify-center mt-4">
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={handleConfirm}
            >
              Insert Link
            </button>
            <button
              className="px-4 py-2 ml-2 border border-gray-400 rounded-md hover:bg-gray-200"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </dialog>
  );
}
