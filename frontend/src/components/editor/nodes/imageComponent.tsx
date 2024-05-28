import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  BaseSelection,
  LexicalCommand,
  createCommand,
  type LexicalEditor,
  type NodeKey,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  CLICK_COMMAND,
  DRAGSTART_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import deleteSVG from '@/components/editor/editorSVGS/close.svg';
import editSVG from '@/components/editor/editorSVGS/edit.svg';
import SkeletonSimple from '@/components/skeletonSimple';
import usePostImage from '@/hooks/usePostImage';
import EditImageModal from '../editImageModal';
import { mergeRegister } from '@lexical/utils';
import { $isImageNode } from './imageNode';
import ImageResizer from './imageResizer';
import ImageNext from 'next/image';
import * as React from 'react';
import './imageNode.css';

const imageCache = new Set();

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> =
  createCommand('RIGHT_CLICK_IMAGE_COMMAND');

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
  placeholder,
}: {
  altText: string;
  className: string | null;
  height: 'inherit' | number;
  width: 'inherit' | number;
  maxWidth: number;
  imageRef: { current: null | HTMLImageElement };
  src: string;
  placeholder: string;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <ImageNext
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      width={width === 'inherit' ? undefined : width}
      height={height === 'inherit' ? undefined : height}
      style={{
        height,
        maxWidth,
        width,
      }}
      placeholder="blur"
      blurDataURL={placeholder}
    />
  );
}

export default function ImageComponent({
  altText,
  caption,
  width,
  height,
  maxWidth,
  nodeKey,
  resizable,
  showCaption,
  captionsEnabled,
  src,
  backendId,
  placeholder,
}: {
  altText: string;
  caption: LexicalEditor;
  height: 'inherit' | number;
  width: 'inherit' | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  showCaption: boolean;
  captionsEnabled: boolean;
  src: string;
  backendId: string;
  placeholder: string;
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null);
  const [selection, setSelection] = React.useState<BaseSelection | null>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [editor] = useLexicalComposerContext();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const { deletePostImageMutation } = usePostImage();

  const onConfirmEdit = useCallback(
    ({
      altText,
      width,
      height,
    }: {
      altText: string;
      width: number;
      height: number;
    }) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          if (altText) {
            node.setAltText(altText);
          }
          if (width !== undefined && height !== undefined) {
            node.setWidthAndHeight(width, height);
          }
        }
      });
    },
    [editor, nodeKey],
  );

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (payload.key !== 'Backspace' && payload.key !== 'Delete') {
        return false;
      }

      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        imageCache.delete(nodeKey);
        deletePostImageMutation.mutate(backendId);
        node.remove();
      }
      return false;
    },
    [backendId, deletePostImageMutation, nodeKey],
  );

  const onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection();
      const buttonElem = buttonRef.current;
      if (
        isSelected &&
        $isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (showCaption) {
          // Move focus into nested editor
          $setSelection(null);
          event.preventDefault();
          caption.focus();
          return true;
        } else if (
          buttonElem !== null &&
          buttonElem !== document.activeElement
        ) {
          event.preventDefault();
          buttonElem.focus();
          return true;
        }
      }
      return false;
    },
    [caption, isSelected, showCaption],
  );

  const onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (
        activeEditorRef.current === caption ||
        buttonRef.current === event.target
      ) {
        $setSelection(null);
        editor.update(() => {
          setSelected(true);
          const parentRootElement = editor.getRootElement();
          if (parentRootElement !== null) {
            parentRootElement.focus();
          }
        });
        return true;
      }
      return false;
    },
    [caption, editor, setSelected],
  );

  const onRightClick = useCallback(
    (event: MouseEvent): void => {
      editor.getEditorState().read(() => {
        const latestSelection = $getSelection();
        const domElement = event.target as HTMLElement;
        if (
          domElement.tagName === 'IMG' &&
          $isRangeSelection(latestSelection) &&
          latestSelection.getNodes().length === 1
        ) {
          editor.dispatchCommand(
            RIGHT_CLICK_IMAGE_COMMAND,
            event as MouseEvent,
          );
        }
      });
    },
    [editor],
  );

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      if (isResizing) {
        return true;
      }
      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }
      return false;
    },
    [isResizing, isSelected, setSelected, clearSelection],
  );

  useEffect(() => {
    let isMounted = true;
    const rootElement = editor.getRootElement();
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(
        RIGHT_CLICK_IMAGE_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        onEscape,
        COMMAND_PRIORITY_LOW,
      ),
    );

    rootElement?.addEventListener('contextmenu', onRightClick);

    return () => {
      isMounted = false;
      unregister();
      rootElement?.removeEventListener('contextmenu', onRightClick);
    };
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    onDelete,
    onEnter,
    onEscape,
    onClick,
    onRightClick,
    setSelected,
  ]);
  const setShowCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  };

  const onResizeEnd = (
    nextWidth: 'inherit' | number,
    nextHeight: 'inherit' | number,
  ) => {
    // Delay hiding the resize bars for click case
    console.log('onResizeEnd');
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    console.log('onResizeStart');
    setIsResizing(true);
  };

  const isFocused = isSelected || isResizing;

  return (
    <Suspense
      fallback={
        <div className="container items-center justify-center">
          <SkeletonSimple />
        </div>
      }
    >
      <div className="flex items-center justify-center w-full">
        <div className="relative flex duration-100 ease-in-out hover:scale-100 hover:border-2 hover:rounded group hover:border-blue-500">
          {editor.isEditable() ? (
            <div className="absolute flex gap-2 top-1 right-2">
              <button
                type="button"
                className="hidden text-xl font-bold text-gray-400 duration-100 ease-in-out hover:text-gray-700 hover:scale-100 group-hover:block"
                aria-label="Delete"
                onClick={() => {
                  editor.update(() => $getNodeByKey(nodeKey)?.remove());
                  deletePostImageMutation.mutate(backendId);
                }}
              >
                <ImageNext
                  src={deleteSVG}
                  alt="Delete"
                  width={20}
                  height={20}
                />
              </button>
              <button
                type="button"
                className="hidden text-xl font-bold text-gray-400 duration-100 ease-in-out hover:text-gray-700 hover:scale-100 group-hover:block"
                aria-label="edit"
                onClick={() => {
                  setShowEditModal(true);
                }}
              >
                <ImageNext src={editSVG} alt="edit" width={20} height={20} />
              </button>
            </div>
          ) : null}
          <LazyImage
            className={
              isFocused
                ? `focused ${$isNodeSelection(selection) ? 'draggable' : ''}`
                : null
            }
            src={src}
            altText={altText}
            imageRef={imageRef}
            width={width}
            height={height}
            maxWidth={maxWidth}
            placeholder={placeholder}
          />
          {resizable && $isNodeSelection(selection) && isFocused && (
            <>
              <ImageResizer
                showCaption={showCaption}
                setShowCaption={setShowCaption}
                editor={editor}
                buttonRef={buttonRef}
                imageRef={imageRef}
                maxWidth={maxWidth}
                onResizeStart={onResizeStart}
                onResizeEnd={onResizeEnd}
                captionsEnabled={captionsEnabled}
              />
              {/* <p>Resizable</p> */}
            </>
          )}
        </div>
      </div>
      <EditImageModal
        isOpen={showEditModal}
        setIsOpen={setShowEditModal}
        nodeKey={nodeKey}
        onConfirm={onConfirmEdit}
      />
    </Suspense>
  );
}
