import {
  FORMAT_ELEMENT_COMMAND,
  ElementFormatType,
  OUTDENT_CONTENT_COMMAND,
  INDENT_CONTENT_COMMAND,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import justifySVG from '@/components/editor/editorSVGS/align-justify.svg';
import centerSVG from '@/components/editor/editorSVGS/align-center.svg';
import rightSVG from '@/components/editor/editorSVGS/align-right.svg';
import leftSVG from '@/components/editor/editorSVGS/align-left.svg';
import outdentSVG from '@/components/editor/editorSVGS/outdent.svg';
import indentSVG from '@/components/editor/editorSVGS/indent.svg';
import ActionButton from '../actionButton';
import Image from 'next/image';
export const AlignActions = () => {
  const [editor] = useLexicalComposerContext();
  const alignFormatTypeArray: ElementFormatType[] = [
    'left',
    'center',
    'right',
    'justify',
  ];
  const handleOnClick = (formatType: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, formatType);
  };
  const elementFormatOptions: { value: ElementFormatType; svg: string }[] = [
    { value: 'left', svg: leftSVG },
    { value: 'center', svg: centerSVG },
    { value: 'right', svg: rightSVG },
    { value: 'justify', svg: justifySVG },
  ];

  return (
    <>
      {alignFormatTypeArray.map((item) => {
        const { value, svg } = elementFormatOptions.find(
          (i) => i.value === item,
        ) as {
          value: ElementFormatType;
          svg: string;
        };
        return (
          <ActionButton
            key={value}
            action={value}
            onClick={() =>
              handleOnClick(value.toLowerCase() as ElementFormatType)
            }
          >
            <Image src={svg} alt={value} width={20} height={20} />
          </ActionButton>
        );
      })}
      <ActionButton
        action={'outdent'}
        onClick={() =>
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
        }
      >
        <Image src={outdentSVG} alt={'outdent'} width={20} height={20} />
      </ActionButton>
      <ActionButton
        action={'indent'}
        onClick={() =>
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
        }
      >
        <Image src={indentSVG} alt={'indent'} width={20} height={20} />
      </ActionButton>{' '}
    </>
  );
};
