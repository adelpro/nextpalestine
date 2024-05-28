import { useCallback, useEffect, useState } from 'react';
import { $isLinkNode } from '@lexical/link';
import { createPortal } from 'react-dom';
import { $getSelection } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { $isRangeSelected } from '../utils/$isRangeSelected';

import useKeyInteractions from '../hooks/useKeyInteractions';
import FloatingMenu from '../floatingMenu';

const ANCHOR_ELEMENT = document.body;

export function FloatingMenuPlugin() {
  const [show, setShow] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);

  const { isPointerDown, isKeyDown } = useKeyInteractions();
  const [editor] = useLexicalComposerContext();
  const updateFloatingMenu = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing() || isPointerDown || isKeyDown) return;

      if (editor.getRootElement() !== document.activeElement) {
        setShow(false);
        return;
      }

      const selection = $getSelection();

      if ($isRangeSelected(selection)) {
        const nodes = selection.getNodes();
        setIsBold(selection.hasFormat('bold'));
        setIsCode(selection.hasFormat('code'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
        setIsHighlight(selection.hasFormat('highlight'));
        setIsLink(nodes.every((node) => $isLinkNode(node.getParent())));
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [editor, isPointerDown, isKeyDown]);

  // Rerender the floating menu automatically on every state update.
  // Needed to show correct state for active formatting state.
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateFloatingMenu();
    });
  }, [editor, updateFloatingMenu]);

  // Rerender the floating menu on relevant user interactions.
  // Needed to show/hide floating menu on pointer up / key up.
  useEffect(() => {
    updateFloatingMenu();
  }, [isPointerDown, isKeyDown, updateFloatingMenu]);

  return createPortal(
    <FloatingMenu
      editor={editor}
      show={show}
      isBold={isBold}
      isCode={isCode}
      isLink={isLink}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isUnderline={isUnderline}
      isHighlight={isHighlight}
    />,
    ANCHOR_ELEMENT,
  );
}
