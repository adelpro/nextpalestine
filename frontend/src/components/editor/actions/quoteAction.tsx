import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import quoteSVG from '@/components/editor/editorSVGS/quote.svg';
import { $isQuoteNode, QuoteNode } from '@lexical/rich-text';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import Image from 'next/image';

import ActionButton from '../actionButton';
export const QuoteAction = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const anchorNode = selection.anchor.getNode();
      const targetNode = $isQuoteNode(anchorNode)
        ? anchorNode
        : $getNearestNodeOfType(anchorNode, QuoteNode);

      const isQuoteNode = $isQuoteNode(targetNode);

      if (isQuoteNode) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };
  return (
    <ActionButton onClick={() => handleOnClick()} action="Quote">
      <Image src={quoteSVG} alt="quote" width={20} height={20} />
    </ActionButton>
  );
};
