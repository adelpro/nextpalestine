import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $isParagraphNode, RangeSelection } from 'lexical';
import { $isListNode, ListNode } from '@lexical/list';
import { $isCodeNode } from '@lexical/code';

import { $getNearestNodeOfType } from '@lexical/utils';

export const getNodeType = (selection: RangeSelection): string | undefined => {
  const anchorNode = selection.anchor.getNode();
  const targetNode =
    anchorNode.getKey() === 'root'
      ? anchorNode
      : anchorNode.getTopLevelElementOrThrow();

  if ($isHeadingNode(targetNode)) {
    const tag = targetNode.getTag();
    return tag.toString();
  } else if ($isListNode(targetNode)) {
    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
    const listType = parentList
      ? parentList.getListType()
      : targetNode.getListType();

    return listType.toString();
  } else {
    if ($isCodeNode(targetNode)) {
      return 'code';
    }
    if ($isQuoteNode(targetNode)) {
      return 'quote';
    }
    if ($isParagraphNode(targetNode)) {
      return 'paragraph';
    }

    return undefined;
  }
};
