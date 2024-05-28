import { EditorThemeClasses } from 'lexical';

export const editorTheme: EditorThemeClasses = {
  // Root styles
  root: 'rounded-sm p-4 min-h-[200px] border-slate-500 border-1 bg-slate-50',

  // Content styles
  blockquote: 'border-left-4 border-blue-300 pl-4 pr-4 mb-4',
  ltr: 'text-left',
  rtl: 'text-right',
  paragraph: 'mb-4',

  quote:
    'border-l-2 border-purple-500 p-3 bg-purple-100 text-purple-800 italic',
  code: 'code',
  codeHighlight: {
    function: 'text-blue-500',
    keyword: 'text-blue-500',
    punctuation: 'text-blue-500',
    number: 'text-blue-500',
    string: 'text-green-500',
    boolean: 'text-blue-500',
    operator: 'text-blue-500',
    console: 'text-red-500',
    comment: 'text-gray-500',
  },
  hashtag: 'text-blue-500',
  heading: {
    h1: 'text-xl font-bold mb-4',
    h2: 'text-lg font-bold mb-3',
    h3: 'text-base font-bold mb-2',
    h4: 'text-sm font-bold mb-1',
    h5: 'text-xs font-bold',
  },

  image: 'rounded-lg max-w-full',

  link: 'text-blue-500 underline cursor-pointer',

  // Text styles
  text: {
    bold: 'font-bold',
    italic: 'font-italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
    code: 'font-mono bg-slate-100 p-1 rounded text-salate-800',
  },
  list: {
    ul: 'pl-4 list-disc list-inside',
    ol: 'pl-4 list-decimal list-inside',
    listitem: 'mb-2',
    nested: {
      listitem: 'ml-4',
    },
    listitemChecked: 'listItemChecked',
    listitemUnchecked: 'listItemUnchecked',
  },
  embedBlock: {
    base: 'bg-slate-100 p-4 rounded max-w-md max-h-md border',
    focus: 'bg-slate-200',
  },
};
