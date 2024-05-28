import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  FORMAT_ELEMENT_COMMAND,
  LexicalCommand,
  createCommand,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createLinkNode } from '@lexical/link';
import { useEffect } from 'react';

type Copyright = {
  photographer: string;
  photographer_url: string;
  host: string;
};
export const INSERT_COPYRIGHT_COMMAND: LexicalCommand<Copyright> =
  createCommand();

export default function CopyrighPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand<Copyright>(
      INSERT_COPYRIGHT_COMMAND,
      (payload) => {
        const { photographer, photographer_url, host } = payload;
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }
        const photoBy = $createTextNode('Photo by ').toggleFormat('italic');
        const on = $createTextNode(' on ').toggleFormat('italic');

        const photographerLinkNode = $createLinkNode(photographer_url, {
          title: 'Copyright',
          target: '_blank',
          rel: 'noopener noreferrer',
        }).append($createTextNode(photographer).toggleFormat('italic'));

        const Host = host[0].toUpperCase() + host.slice(1).toLowerCase();

        const onLink = $createLinkNode(
          `https://www.${host.toLowerCase()}.com/`,
          {
            title: Host,
            target: '_blank',
            rel: 'noopener noreferrer',
          },
        ).append($createTextNode(Host).toggleFormat('italic'));
        selection.insertNodes([photoBy, photographerLinkNode, on, onLink]);

        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        selection.insertParagraph();
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
