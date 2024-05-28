import {
  $getNodeByKey,
  $getRoot,
  $isParagraphNode,
  LexicalEditor,
  LexicalNode,
  RangeSelection,
} from 'lexical';
import { PointType } from 'lexical/LexicalSelection';
import { $isHeadingNode } from '@lexical/rich-text';

const PLACEHOLDER_CLASS_NAME = 'node-placeholder';

const isHtmlHeadingElement = (el: HTMLElement): el is HTMLHeadingElement => {
  return el instanceof HTMLHeadingElement;
};

const getAllLexicalChildren = (editor: LexicalEditor) => {
  const childrenKeys = editor
    .getEditorState()
    .read(() => $getRoot().getChildrenKeys());

  return childrenKeys.map((key: string) => ({
    key: key,
    node: $getNodeByKey(key),
    htmlElement: editor.getElementByKey(key),
  }));
};

const getNodePlaceholder = (lexicalNode: LexicalNode) => {
  let placeholder;

  if ($isHeadingNode(lexicalNode)) {
    const tag = lexicalNode.getTag();

    placeholder = 'Heading';
    switch (tag) {
      case 'h1': {
        placeholder += ' 1';
        break;
      }
      case 'h2': {
        placeholder += ' 2';
        break;
      }
      case 'h3': {
        placeholder += ' 3';
        break;
      }
      case 'h4': {
        placeholder += ' 4';
        break;
      }
      case 'h5': {
        placeholder += '5';
        break;
      }
      case 'h6': {
        placeholder += '6';
        break;
      }
    }
  }

  if ($isParagraphNode(lexicalNode)) {
    // Like in https://www.notion.so/
    placeholder = ' ...';
  }

  return placeholder;
};
export const setPlaceholderOnSelection = ({
  selection,
  editor,
}: {
  selection: RangeSelection;
  editor: LexicalEditor;
}): void => {
  /**
   * 1. Get all lexical nodes as HTML elements
   */
  const children = getAllLexicalChildren(editor);

  /**
   * 2. Remove "placeholder" class if it was added before
   */
  children.forEach(({ htmlElement }) => {
    if (!htmlElement) {
      return;
    }
    const classList = htmlElement.classList;

    if (classList.length && classList.contains(PLACEHOLDER_CLASS_NAME)) {
      classList.remove(PLACEHOLDER_CLASS_NAME);
    }
  });

  /**
   * 3. Do nothing if there is only one lexical child,
   * because we already have a placeholder
   * in <RichTextPlugin/> component
   * With on exception: If we converted default node to the "Heading"
   */
  if (
    children.length === 1 &&
    children[0].htmlElement &&
    !isHtmlHeadingElement(children[0].htmlElement)
  ) {
    return;
  }

  /**
   * 4. Get "PointType" object, that contain Nodes data
   * (that is selected)
   * {
   *    key: "5", <- Node's key
   *    offset: 7,
   *    type: "text"
   * }
   */
  const anchor: PointType = selection.anchor;

  /**
   * 5. Get placeholder for type ('heading'/'paragraph'/etc...)
   */
  const placeholder = getNodePlaceholder(anchor.getNode());

  if (placeholder) {
    const selectedHtmlElement = editor.getElementByKey(anchor.key);

    // Removing placeholder if it was added before if the html element contain a <br> and do not contain <span>
    if (
      !selectedHtmlElement?.innerHTML.includes('<br>') &&
      selectedHtmlElement?.innerHTML.includes('<span>')
    ) {
      selectedHtmlElement?.classList.remove(PLACEHOLDER_CLASS_NAME);
      return;
    }
    selectedHtmlElement?.setAttribute('data-placeholder', placeholder);
    selectedHtmlElement?.classList.add(PLACEHOLDER_CLASS_NAME);
  }
};
