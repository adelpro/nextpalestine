import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { MARKDOWN_TRANSFORMERS } from '@/components/editor/markdownTransformers';
import markdownSVG from '@/components/editor/editorSVGS/markdown.svg';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { $createTextNode, $getRoot } from 'lexical';
import Image from 'next/image';
export const MarkdownAction = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = () => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild();

      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        // Markdown -> Node
        $convertFromMarkdownString(
          firstChild.getTextContent(),
          MARKDOWN_TRANSFORMERS,
        );
      } else {
        // Node -> Markdown
        const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);
        root
          .clear()
          .append(
            $createCodeNode('markdown').append($createTextNode(markdown)),
          );
      }
    });
  };

  return (
    <>
      <button
        aria-label="Toggle Markdown"
        className="p-1 m-1 text-gray-700 transition-all duration-300 border-b-2 cursor-pointer hover:border-slate-500"
        title="Toggle Markdown"
        type="button"
        onClick={handleOnClick}
      >
        <Image src={markdownSVG} alt="Markdown" width={30} height={20} />
      </button>
    </>
  );
};
