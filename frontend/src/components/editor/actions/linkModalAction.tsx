import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import linkSVG from '@/components/editor/editorSVGS/link.svg';
import LinkModal from '../linkModal';
import { useState } from 'react';
import Image from 'next/image';
export const LinkModalAction = () => {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);

  return (
    <div data-controller="modal">
      <button
        aria-label="Add or edit link"
        className={`w-8 p-1 rounded-md cursor-pointer hover:bg-slate-200`}
        onClick={() => setisModalOpen(true)}
      >
        <Image src={linkSVG} alt="Link" width={20} height={20} />
      </button>
      <LinkModal isOpen={isModalOpen} setIsOpen={setisModalOpen} />
    </div>
  );
};
