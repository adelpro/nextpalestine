import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import strikethroughSVG from '@/components/editor/editorSVGS/strikethrough.svg';
import inlineCodeSVG from '@/components/editor/editorSVGS/inline-code.svg';
import underlineSVG from '@/components/editor/editorSVGS/underline.svg';
import highlightSVG from '@/components/editor/editorSVGS/highlight.svg';
import italicSVG from '@/components/editor/editorSVGS/italic.svg';
import boldSVG from '@/components/editor/editorSVGS/bold.svg';
import { FORMAT_TEXT_COMMAND, TextFormatType } from 'lexical';
import ActionButton from '../actionButton';
import Image from 'next/image';

export function TextActions(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (formatType: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };
  const textFormatOptions: { value: TextFormatType; svg: string }[] = [
    { value: 'bold', svg: boldSVG },
    { value: 'italic', svg: italicSVG },
    { value: 'underline', svg: underlineSVG },
    { value: 'code', svg: inlineCodeSVG },
    { value: 'highlight', svg: highlightSVG },
    { value: 'strikethrough', svg: strikethroughSVG },
  ];

  return (
    <>
      {textFormatOptions.map((item) => {
        return (
          <ActionButton
            key={item.value}
            action={item.value}
            onClick={() => handleOnClick(item.value)}
          >
            <Image src={item.svg} alt={item.value} width={20} height={20} />
          </ActionButton>
        );
      })}
    </>
  );
}
