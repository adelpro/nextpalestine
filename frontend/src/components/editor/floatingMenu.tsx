import {
  arrow,
  autoPlacement,
  computePosition,
  offset,
} from '@floating-ui/dom';
import strikethroughSVG from '@/components/editor/editorSVGS/strikethrough.svg';
import inlineCodeSVG from '@/components/editor/editorSVGS/inline-code.svg';
import underlineSVG from '@/components/editor/editorSVGS/underline.svg';
import highlightSVG from '@/components/editor/editorSVGS/highlight.svg';
import italicSVG from '@/components/editor/editorSVGS/italic.svg';
import linkSVG from '@/components/editor/editorSVGS/link.svg';
import boldSVG from '@/components/editor/editorSVGS/bold.svg';
import { FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical';
import { useEffect, useRef, useState } from 'react';
import LinkModal from './linkModal';
import { cn } from '@/utils/cn';

import Image from 'next/image';

type FloatingMenuPosition = { x: number; y: number } | undefined;
type FloatingMenuProps = {
  editor: LexicalEditor;
  show: boolean;
  isBold: boolean;
  isCode: boolean;
  isLink: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
  isHighlight: boolean;
};

export default function FloatingMenu({ show, ...props }: FloatingMenuProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<FloatingMenuPosition>();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const nativeSel = window.getSelection();

  useEffect(() => {
    const isCollapsed = nativeSel?.rangeCount === 0 || nativeSel?.isCollapsed;

    if (!show || !editorRef.current || !nativeSel || isCollapsed) {
      setPos(undefined);
      return;
    }
    const domRange = nativeSel.getRangeAt(0);

    computePosition(domRange, editorRef.current, {
      placement: 'top',
      middleware: [
        autoPlacement(),
        offset(10),
        arrow({ element: editorRef.current }),
      ],
    })
      .then((pos) => {
        setPos({ x: pos.x, y: pos.y });
      })
      .catch(() => {
        setPos(undefined);
      });
    // anchorOffset, so that we sync the menu position with
    // native selection (if user selects two ranges consecutively)
  }, [show, nativeSel, nativeSel?.anchorOffset]);

  return (
    <div
      ref={editorRef}
      style={{ top: pos?.y, left: pos?.x }}
      aria-hidden={!pos?.x || !pos?.y}
      className={`absolute flex items-center justify-between bg-slate-100 border-[1px] border-slate-300 rounded-md p-1 gap-1 ${
        pos?.x && pos.y ? 'opacity-1 visible' : 'opacity-0 invisible'
      }`}
    >
      <button
        aria-label="Format text as bold"
        title="Bold"
        aria-pressed={props.isBold}
        className={cn(`w-8 p-1 rounded-md cursor-pointer hover:bg-slate-200`, {
          'bg-slate-300 text-opacity-70)': props.isBold,
        })}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
      >
        <Image src={boldSVG} alt="Bold" width={20} height={20} />
      </button>
      <button
        aria-label="Format text as italics"
        title="Italics"
        aria-pressed={props.isItalic}
        className={cn(`w-8 p-1 rounded-md cursor-pointer hover:bg-slate-200`, {
          'bg-slate-300 text-opacity-70)': props.isItalic,
        })}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
      >
        <Image src={italicSVG} alt="Italic" width={20} height={20} />
      </button>
      <button
        aria-label="Format text to underlined"
        title="Underline"
        aria-pressed={props.isUnderline}
        className={cn(`w-8 p-1 rounded-md cursor-pointer hover:bg-slate-200`, {
          'bg-slate-300 text-opacity-70)': props.isUnderline,
        })}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
      >
        <Image src={underlineSVG} alt="Underline" width={20} height={20} />
      </button>
      <button
        aria-label="Format text with a strikethrough"
        title="Strikethrough"
        aria-pressed={props.isStrikethrough}
        className={cn(`w-8 p-1 rounded-md cursor-pointer hover:bg-slate-200`, {
          'bg-slate-300 text-opacity-70)': props.isStrikethrough,
        })}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
      >
        <Image
          src={strikethroughSVG}
          alt="Strikethrough"
          width={20}
          height={20}
        />
      </button>
      <button
        aria-label="Format text with a highlight"
        title="Highlight"
        aria-pressed={props.isHighlight}
        className={cn(`w-8 p-1 rounded-md cursor-pointer hover:bg-slate-200`, {
          'bg-slate-300 text-opacity-70)': props.isHighlight,
        })}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
        }}
      >
        <Image src={highlightSVG} alt="Inline code" width={20} height={20} />
      </button>
      <button
        aria-label="Format text with inline code"
        className={cn(`w-8 p-1 rounded-md cursor-pointer hover:bg-slate-200`, {
          'bg-slate-300 text-opacity-70)': props.isCode,
        })}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
        }}
      >
        <Image src={inlineCodeSVG} alt="Inline code" width={20} height={20} />
      </button>
      <button
        aria-label="Add or edit link"
        className={cn(`w-8 p-1 rounded-md cursor-pointer hover:bg-slate-200`, {
          'bg-slate-300 text-opacity-70)': props.isLink,
        })}
        onClick={() => setIsLinkModalOpen(true)}
      >
        <Image src={linkSVG} alt="Link" width={20} height={20} />
      </button>
      <LinkModal isOpen={isLinkModalOpen} setIsOpen={setIsLinkModalOpen} />
    </div>
  );
}
