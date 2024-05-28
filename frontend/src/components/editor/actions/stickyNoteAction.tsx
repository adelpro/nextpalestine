import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import stickySVG from '@/components/editor/editorSVGS/sticky.svg';
import { $createStickyNode } from '../nodes/stickyNode';
import ActionButton from '../actionButton';
import { $getRoot } from 'lexical';
import Image from 'next/image';
import * as React from 'react';
export default function StickyNodeAction(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = () => {
    editor.update(() => {
      const root = $getRoot();
      const stickyNode = $createStickyNode(0, 0);
      root.append(stickyNode);
    });
  };
  return (
    <ActionButton onClick={handleOnClick} action="Sticky">
      <Image src={stickySVG} alt="Sticky" width={20} height={20} />
    </ActionButton>
  );
}
