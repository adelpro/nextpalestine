//
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import AutoLinkPluginWithMutchers from './plugins/autoLinkPluginWithMutchers';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import ListMaxIndentLevelPlugin from './plugins/listMaxIndentLevelPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { $getSelection, $isRangeSelection, EditorState } from 'lexical';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LoadInitialContent } from './plugins/initialContentPlugin';
import { CodeHighlightPlugin } from './plugins/codeHighlightPlugin';
import { FloatingMenuPlugin } from './plugins/floatingMenuPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlaceholderPlugin } from './plugins/placeholderPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { SeparationAction } from './actions/separationAction';
import { ParagraphAction } from './actions/paragraphAction';
import { MarkdownAction } from './actions/markdownAction';
import { HeadingActions } from './actions/headingActions';
import { HistoryActions } from './actions/historyAction';
import AutoFocusPlugin from './plugins/autoFocusPlugin';
import TreeViewPlugin from './plugins/treeViewPlugin';
import { AlignActions } from './actions/alignActions';
import YouTubePlugin from './plugins/youtubePlugin';
import TwitterPlugin from './plugins/tweeterPlugin';
import { ListActions } from './actions/listActions';
import { QuoteAction } from './actions/quoteAction';
import { ClearAction } from './actions/clearAction';
import { CodeAction } from './actions/codeAction';
import EmotjiPlugin from './plugins/imojiPlugin';
import ImagesPlugin from './plugins/imagePlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { currentNodeType } from '@/recoil/store';
import ImageAction from './actions/imageAction';
import SaveAction from './actions/saveAction';
import { useSetRecoilState } from 'recoil';
import PostHeader from './postHeader';
import { POST } from '@/utils/types';
import { useState } from 'react';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import CopyrighPlugin from './plugins/copyrightPlugin';
import EmbadedAction from './actions/embaddedAction';

type Props = {
  config: Parameters<typeof LexicalComposer>['0']['initialConfig'];
  post?: POST;
  editable?: boolean;
};
//TODO Use onChange to enable save button

export default function Editor({ config, post, editable = false }: Props) {
  const newPost: POST = {
    title: '',
    excerpt: '',
    content: '',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublished: true,
  };
  const [editPost, setEditPost] = useState<POST>(post || newPost);
  const extendedConfig = { ...config, editable };
  const setCurrentNodeType = useSetRecoilState(currentNodeType);
  function onChange(state: EditorState) {
    state.read(() => {
      // Save the new editor state
      const newContent = JSON.stringify(state.toJSON());
      setEditPost((prev) => ({
        ...prev,
        content: newContent,
      }));

      // get the selected node type
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getParent();
        const type = element?.getType();

        if (type === 'heading') {
          const tag = element?.getTag();
          setCurrentNodeType(tag);
          return;
        }
        if (type === 'list') {
          const tag = element?.__listType;
          setCurrentNodeType(tag);
          return;
        }
        if (type === 'listitem') {
          const tag = element?.getParentOrThrow().__listType;
          setCurrentNodeType(tag);
          return;
        }
        if (type === 'code') {
          setCurrentNodeType('CodeBlock');
          return;
        }
        if (type === 'paragraph') {
          setCurrentNodeType('paragraph');
          return;
        }

        setCurrentNodeType('');
      }
    });
  }

  return (
    <div className="relative container min-h-[40vh]">
      <PostHeader
        post={editPost}
        setEditPost={setEditPost}
        editable={editable}
      />
      <LexicalComposer initialConfig={extendedConfig}>
        {/* Actions /> */}
        {!editable ? (
          <></>
        ) : (
          <div className="container block">
            <div className="flex flex-wrap gap-1 my-2">
              <ParagraphAction />
              <HeadingActions />
              <QuoteAction />
              <CodeAction />
            </div>
            {/*          <div className="flex flex-wrap items-center gap-1 my-2">
              <TextActions />
              <LinkModalAction />
            </div> */}
            <div className="flex flex-wrap gap-1 my-2">
              <AlignActions />
              <SeparationAction />
              <ListActions />
              <ImageAction />
              <EmbadedAction />
            </div>
            <div className="flex flex-wrap gap-1 my-2">
              {/* 
              // FIXME bug when saving
              // disable for now
              <StickyNodeAction /> 
              */}
              <HistoryActions />
              <MarkdownAction />
              <SaveAction post={editPost} isNew={!post} />
              <ClearAction />
            </div>
          </div>
        )}
        <div className="container relative editor__container">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="overflow-hidden resize-none text-ellipsis" />
            }
            placeholder={
              <div className="absolute top-0 left-0 p-4 pl-4 text-gray-500 opacity-50 pointer-events-none select-none">
                Start writing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <AutoLinkPluginWithMutchers />
        <AutoFocusPlugin />
        <LexicalClickableLinkPlugin />
        <HistoryPlugin />
        <ListPlugin />
        <TwitterPlugin />
        <CheckListPlugin />
        <OnChangePlugin onChange={onChange} />
        <ListMaxIndentLevelPlugin maxDepth={7} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <LoadInitialContent initialContent={post?.content} />
        <CodeHighlightPlugin />
        <FloatingMenuPlugin />
        <ClearEditorPlugin />
        <EmotjiPlugin />
        <PlaceholderPlugin />
        <TreeViewPlugin />
        <YouTubePlugin />
        <HorizontalRulePlugin />
        <ImagesPlugin />
        <CopyrighPlugin />
      </LexicalComposer>
    </div>
  );
}
