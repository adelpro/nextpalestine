import imageSVG from '@/components/editor/editorSVGS/image.svg';
import ImageModal from '../imageModal';
import Image from 'next/image';
import * as React from 'react';

export default function ImageAction(): JSX.Element {
  const [isImageModalOpen, setIsImageModalOpen] = React.useState(false);
  const handleImageUrl = async () => {
    setIsImageModalOpen(true);
  };
  return (
    <>
      <button
        onClick={() => {
          handleImageUrl();
        }}
        title="Image"
        aria-label="Image"
        className="p-1 m-1 text-gray-700 transition-all duration-300 border-b-2 cursor-pointer hover:border-slate-500"
      >
        <Image src={imageSVG} alt="Add image" width={20} height={20} />
      </button>
      <ImageModal isOpen={isImageModalOpen} setIsOpen={setIsImageModalOpen} />
    </>
  );
}
