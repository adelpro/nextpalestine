import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  createCommand,
  LexicalEditor,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { CodeNode, registerCodeHighlighting, $isCodeNode } from '@lexical/code';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { FC, useEffect } from 'react';

export const CodeHighlightPlugin: FC = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      registerCodeHighlighting(editor),
      registerCodeLanguageSelecting(editor),
    );
  }, [editor]);

  return null;
};

export const CODE_LANGUAGE_COMMAND = createCommand<string>();

function registerCodeLanguageSelecting(editor: LexicalEditor): () => void {
  return editor.registerCommand(
    CODE_LANGUAGE_COMMAND,
    (language, editor: LexicalEditor) => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return false;
      const anchorNode = selection.anchor.getNode();
      const targetNode = $isCodeNode(anchorNode)
        ? anchorNode
        : $getNearestNodeOfType(anchorNode, CodeNode);
      if (!targetNode) return false;

      editor.update(() => {
        targetNode.setLanguage(language);
      });

      return true;
    },
    COMMAND_PRIORITY_CRITICAL,
  );
}
