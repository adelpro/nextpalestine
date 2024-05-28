import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isListItemNode } from '@lexical/list';

import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import numberListSVG from '@/components/editor/editorSVGS/number-list.svg';
import bulletListSVG from '@/components/editor/editorSVGS/bullet-list.svg';
import checkListSVG from '@/components/editor/editorSVGS/check-list.svg';
import { $getSelection, $isRangeSelection } from 'lexical';
import ActionButton from '../actionButton';
import Image from 'next/image';

type ListTag = 'number' | 'bullet' | 'check';
export const ListActions = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (tag: ListTag) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const node = selection.anchor.getNode();
      const parentNode = selection.anchor.getNode().getParentOrThrow();
      const isList = $isListItemNode(parentNode);
      const isParentList = $isListItemNode(selection.anchor.getNode());

      if (isList || isParentList) {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        return;
      }
      switch (tag) {
        case 'number':
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          break;

        case 'bullet':
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          break;

        case 'check':
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
          break;
      }
    });
  };

  const listTypeOptions: { value: ListTag; svg: string }[] = [
    { value: 'number', svg: numberListSVG },
    { value: 'bullet', svg: bulletListSVG },
    { value: 'check', svg: checkListSVG },
  ];
  return (
    <>
      {listTypeOptions.map(
        (item: { value: ListTag; svg: string }): JSX.Element => {
          const { value, svg } = item;

          return (
            <ActionButton
              key={value}
              action={value}
              onClick={() => handleOnClick(value)}
            >
              <Image src={svg} alt={value} width={20} height={20} />
            </ActionButton>
          );
        },
      )}
    </>
  );
};
