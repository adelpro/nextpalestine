import type { RangeSelection, TextNode, ElementNode } from 'lexical';
import { $isAtNodeEnd } from '@lexical/selection';

export default function getSelectedNode(
  selection: RangeSelection,
): TextNode | ElementNode | null {
  if (!selection || selection.isCollapsed()) {
    return null;
  }
  const { anchor } = selection;
  const { focus } = selection;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  }
  return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
}
