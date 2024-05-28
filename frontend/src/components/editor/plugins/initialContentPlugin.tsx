import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';
type Props = { initialContent?: string };

export const LoadInitialContent = ({ initialContent }: Props) => {
  const [editor] = useLexicalComposerContext();
  const isMountedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!initialContent || isMountedRef.current) {
      return;
    }
    const editorState = editor.parseEditorState(initialContent);
    editor.setEditorState(editorState);
    isMountedRef.current = true;
  }, [editor, initialContent]);
  return null;
};
