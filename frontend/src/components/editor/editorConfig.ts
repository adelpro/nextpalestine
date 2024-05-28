import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { EDITOR_NODES } from './editorNodes';
import { editorTheme } from './editorTheme';
const namespace = 'editor';

function onError(error: any) {
  console.error({ editorError: error });
}

export const editorConfig: Parameters<
  typeof LexicalComposer
>['0']['initialConfig'] = {
  namespace,
  nodes: EDITOR_NODES,
  theme: editorTheme,

  // Used to convert from markdown string to editor state at load time
  // editorState: () => $convertFromMarkdownString(markdown, TRANSFORMERS),
  onError,
};
