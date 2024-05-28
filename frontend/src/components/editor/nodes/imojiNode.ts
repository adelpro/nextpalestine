import { EditorConfig, LexicalNode, TextNode } from 'lexical';

export class EmojiNode extends TextNode {
  static importJSON(serializedNode: any): EmojiNode {
    const node = new EmojiNode(
      serializedNode.className,
      serializedNode.text,
      serializedNode.key,
    );
    node.setMode(serializedNode.mode);
    return node;
  }

  exportJSON(): any {
    return {
      ...super.exportJSON(), // Get the serialized form of the TextNode
      className: this.__className,
      type: EmojiNode.getType(), // Make sure to return the correct type
    };
  }
  static getType() {
    return 'emoji';
  }

  static clone(node: LexicalNode) {
    return new EmojiNode(node.__className, node.__text, node.__key);
  }

  constructor(className: any, text: string, key?: string | undefined) {
    super(text, key);
    this.__className = className;
  }

  createDOM(config: EditorConfig) {
    const dom = document.createElement('span');
    const inner = super.createDOM(config);
    dom.className = this.__className;
    inner.className = 'px-1 mx-1';
    dom.appendChild(inner);
    return dom;
  }

  updateDOM(
    prevNode: TextNode,
    dom: { firstChild: any },
    config: EditorConfig,
  ) {
    const inner = dom.firstChild;
    if (inner === null) {
      return true;
    }
    super.updateDOM(prevNode, inner, config);
    return false;
  }
}

export function $isEmojiNode(node: LexicalNode) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className: string, emojiText: string) {
  return new EmojiNode(className, emojiText).setMode('token');
}
