import {
  HeadingTagType,
  $createHeadingNode,
  $isHeadingNode,
  HeadingNode,
} from '@lexical/rich-text';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $setBlocksType } from '@lexical/selection';
import ActionButton from '../actionButton';

export const HeadingActions = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const anchorNode = selection.anchor.getNode();
      const targetNode = $isHeadingNode(anchorNode)
        ? anchorNode
        : $getNearestNodeOfType(anchorNode, HeadingNode);
      // FIXME remove redendent code
      const isHeading = $isHeadingNode(targetNode);
      if (isHeading) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      } else {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };
  const headingTagTypeArray: HeadingTagType[] = ['h1', 'h2', 'h3', 'h4', 'h5'];
  return (
    <>
      {headingTagTypeArray.map((value) => {
        return (
          <ActionButton
            key={value}
            onClick={() => handleOnClick(value)}
            action={value.toUpperCase()}
          >
            {value.toUpperCase()}
          </ActionButton>
        );
      })}
    </>
  );
};
