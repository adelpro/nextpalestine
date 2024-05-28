import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import separationSVG from '@/components/editor/editorSVGS/horizantal-separation.svg';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import Image from 'next/image';

import ActionButton from '../actionButton';

export const SeparationAction = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = () => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  };
  return (
    <ActionButton onClick={handleOnClick} action="Separation">
      <Image src={separationSVG} alt="Separation" width={20} height={20} />
    </ActionButton>
  );
};
