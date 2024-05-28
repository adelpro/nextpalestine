import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND } from 'lexical';
import clearAllSVG from '@/components/editor/editorSVGS/clear-all.svg';
import { useLayoutEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import Image from 'next/image';

export const ClearAction = () => {
  const [editor] = useLexicalComposerContext();
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  useLayoutEffect(
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
  const handleOnClick = () => {
    editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
  };
  return (
    <>
      <button
        disabled={isEditorEmpty}
        aria-disabled={isEditorEmpty}
        title="Clear all"
        aria-label="Clear all"
        className={cn(
          'cursor-pointer text-gray-700 m-1 p-1 border-b-2 hover:border-slate-500 transition-all duration-300',
          {
            'bg-slate-100 border border-slate-300 rounded shadow cursor-not-allowed':
              isEditorEmpty,
          },
        )}
        onClick={() => handleOnClick()}
      >
        <Image src={clearAllSVG} alt="Clear All" width={20} height={20} />
      </button>
    </>
  );
};
