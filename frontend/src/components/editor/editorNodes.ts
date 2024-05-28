import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { YouTubeNode } from './nodes/youtubeNode';
import { StickyNode } from './nodes/stickyNode';
import { EmojiNode } from './nodes/imojiNode';
import { ImageNode } from './nodes/imageNode';
import { TweetNode } from './nodes/tweetNode';
import { Klass, LexicalNode } from 'lexical';

export const EDITOR_NODES: Klass<LexicalNode>[] = [
  HorizontalRuleNode,
  TweetNode,
  StickyNode,
  HorizontalRuleNode,
  CodeNode,
  CodeHighlightNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  AutoLinkNode,
  EmojiNode,
  YouTubeNode,
  ImageNode,
];
