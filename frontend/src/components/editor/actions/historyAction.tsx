import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getRoot,
  $isParagraphNode,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import undoSVG from '@/components/editor/editorSVGS/undo.svg';
import redoSVG from '@/components/editor/editorSVGS/redo.svg';
import { mergeRegister } from '@lexical/utils';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import Image from 'next/image';

const LowPriority = 1;
export const HistoryActions = () => {
  const [editor] = useLexicalComposerContext();
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor]);

  useEffect(
    function checkEditorEmptyState() {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();

          const children = root.getChildren();

          if (children.length > 1) {
            setIsEditorEmpty(false);

            return;
          }

          if ($isParagraphNode(children[0])) {
            setIsEditorEmpty(children[0].getChildren().length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        });
      });
    },

    [editor],
  );
  return (
    <>
      <button
        disabled={!canUndo}
        aria-disabled={isEditorEmpty}
        aria-label="Undo"
        title="Undo"
        className={cn(
          'cursor-pointer text-gray-700 m-1 p-1 border-b-2 hover:border-slate-500 transition-all duration-300',
          {
            'bg-slate-100 border text-slate-300 rounded shadow cursor-not-allowed':
              !canUndo && isEditorEmpty,
          },
        )}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        <Image src={undoSVG} alt="Undo" width={20} height={20} />
      </button>
      <button
        disabled={!canRedo}
        aria-disabled={isEditorEmpty}
        aria-label="Redo"
        title="Redo"
        className={cn(
          'cursor-pointer text-gray-700 m-1 p-1 border-b-2 hover:border-slate-500 transition-all duration-300',
          {
            'bg-slate-100 border text-slate-300 rounded shadow cursor-not-allowed':
              !canRedo,
          },
        )}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        <Image src={redoSVG} alt="Redo" width={20} height={20} />
      </button>
    </>
  );
};
