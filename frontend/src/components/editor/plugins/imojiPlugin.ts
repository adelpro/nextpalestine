import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor, LexicalNode, TextNode } from 'lexical';
import { $createEmojiNode } from '../nodes/imojiNode';
import { useEffect } from 'react';

function emojiTransform(node: LexicalNode) {
  const textContent = node.getTextContent();

  // When you type :), we will replace it with an emoji node
  switch (textContent) {
    case ':)':
      node.replace($createEmojiNode('emoji happysmile', '🙂'));
      break;
    case ':D':
      node.replace($createEmojiNode('emoji bigsmile', '😃'));
      break;
    case ':(':
      node.replace($createEmojiNode('emoji sad', '😞'));
      break;
    case ':cool:':
      node.replace($createEmojiNode('emoji cool', '😎'));
      break;
    case ':heart:':
      node.replace($createEmojiNode('emoji heart', '❤️'));
      break;
    case ':thumbsup:':
      node.replace($createEmojiNode('emoji thumbsup', '👍'));
      break;
    case ':rocket:':
      node.replace($createEmojiNode('emoji rocket', '🚀'));
      break;
    case ':fire:':
      node.replace($createEmojiNode('emoji fire', '🔥'));
      break;
    // Add more emoji cases as needed
    case ':star:':
      node.replace($createEmojiNode('emoji star', '⭐'));
      break;
    case ':sunglasses:':
      node.replace($createEmojiNode('emoji sunglasses', '😎'));
      break;
    default:
      break;
  }
}

function useEmojicons(editor: LexicalEditor) {
  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(
      TextNode,
      emojiTransform,
    );
    return () => {
      removeTransform();
    };
  }, [editor]);
}

export default function EmojiPlugin() {
  const [editor] = useLexicalComposerContext();
  useEmojicons(editor);
  return null;
}
