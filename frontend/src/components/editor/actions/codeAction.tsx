import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
} from '@lexical/code';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { CODE_LANGUAGE_COMMAND } from '../plugins/codeHighlightPlugin';
import codeSVG from '@/components/editor/editorSVGS/code.svg';
import { $setBlocksType } from '@lexical/selection';
import ActionButton from '../actionButton';
import { useState } from 'react';
import Image from 'next/image';
export const CodeAction = () => {
  const [editor] = useLexicalComposerContext();
  const [codeLanguage, setCodeLanguage] = useState<string>('');

  const CodeLanguagesOptions = Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  ).map(([value, label]) => ({
    value,
    label,
  }));
  const handleOnClick = (language?: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const anchorNode = selection.anchor.getNode().getParent();
      const targetNode =
        anchorNode?.getKey() === 'root'
          ? anchorNode
          : anchorNode?.getTopLevelElementOrThrow();
      const isCodeNode = $isCodeNode(targetNode);

      if (isCodeNode) {
        $setBlocksType(selection, () => $createParagraphNode());
        setCodeLanguage('');
      } else {
        $setBlocksType(selection, () => $createCodeNode(language || 'js'));
        editor.dispatchCommand(CODE_LANGUAGE_COMMAND, language || 'js');
        setCodeLanguage(language || 'js');
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      <ActionButton
        onClick={() => handleOnClick(codeLanguage)}
        action="CodeBlock"
      >
        <Image src={codeSVG} alt="code" width={20} height={20} />
      </ActionButton>
      <select
        aria-label={`code languages: ${codeLanguage}`}
        className="cursor-pointer h-[28px] w-[120px] rounded-sm border border-gray-300 bg-white p-1 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-CTA-blue-500 focus:ring-offset-2 hover:border-slate-500 transition-all duration-30"
        value={codeLanguage}
        onChange={(event) => {
          editor.dispatchCommand(CODE_LANGUAGE_COMMAND, event.target.value);
          setCodeLanguage(event.target.value);
        }}
      >
        <option value="">Select...</option>
        {CodeLanguagesOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};
