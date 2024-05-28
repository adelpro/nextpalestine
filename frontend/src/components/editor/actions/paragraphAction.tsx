import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';

import paragraphSVG from '@/components/editor/editorSVGS/paragraph.svg';
import { $setBlocksType } from '@lexical/selection';
import ActionButton from '../actionButton';
import Image from 'next/image';

export const ParagraphAction = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $setBlocksType(selection, () => $createParagraphNode());
    });
  };
  return (
    <ActionButton onClick={handleOnClick} action="Paragraph">
      <Image src={paragraphSVG} alt="paragraph" width={20} height={20} />
    </ActionButton>
  );
};
