import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TreeView } from '@lexical/react/LexicalTreeView';
import arrowDownSVG from '@/svgs/arrowDown-2.svg';
import arrowUpSVG from '@/svgs/arrowUp-2.svg';
import { useState } from 'react';
import Image from 'next/image';

export default function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();
  const [showForm, setShowForm] = useState<boolean>(false);
  //FIXME: Show only for admins
  return (
    <div className="flex flex-col items-center justify-between px-2 mt-2 border rounded-sm">
      <div className="flex items-center justify-between w-full my-1">
        <h3 className="text-xl font-bol">Debug</h3>
        <button
          aria-label={showForm ? 'Hide Form' : 'Show Form'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <Image
              src={arrowDownSVG}
              alt="Fail"
              width={30}
              height={30}
              className="mx-auto"
            />
          ) : (
            <Image
              src={arrowUpSVG}
              alt="Fail"
              width={30}
              height={30}
              className="mx-auto"
            />
          )}
        </button>
      </div>
      {showForm ? (
        <div className="container mt-4 text-gray-900 bg-slate-400">
          <TreeView
            viewClassName="tree-view-output"
            timeTravelPanelClassName="debug-timetravel-panel"
            timeTravelButtonClassName="debug-timetravel-button"
            timeTravelPanelSliderClassName="debug-timetravel-panel-slider"
            timeTravelPanelButtonClassName="debug-timetravel-panel-button"
            editor={editor}
            treeTypeButtonClassName={''}
          />
        </div>
      ) : null}
    </div>
  );
}
