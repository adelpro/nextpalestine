import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { setPlaceholderOnSelection } from '../utils/setPlaceholderOnSelection';
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical';
import { useEffect } from 'react';

// https://javascript.plainenglish.io/lexical-how-to-add-nodes-placeholder-notion-so-type-865d26829c72
export const PlaceholderPlugin = () => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      setNodePlaceholderFromSelection(editor);
    });
  }, [editor]);

  return null;
};

const setNodePlaceholderFromSelection = (editor: LexicalEditor): void => {
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      // Do nothing if user selected node's content
      return;
    }

    setPlaceholderOnSelection({ selection, editor });
  });
};
