import React, {
  ChangeEvent,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import loadingSVG from '@/components/editor/editorSVGS/image-loading.svg';
import EditImageSVG from '@/components/editor/editorSVGS/edit.svg';
import CloseSVG from '@/components/editor/editorSVGS/close.svg';
import imagePlaceholderSVG from '@/svgs/imagePlaceHolder.svg';
import { INSERT_IMAGE_COMMAND } from './plugins/imagePlugin';
import useEscapeKey from '@/hooks/useEscapeKeyHook';
import { ImagePayload } from './nodes/imageNode';
import usePostImage from '@/hooks/usePostImage';
import NextImage from 'next/image';
import Spinner from '../spinner';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export default function ImageModal({ isOpen, setIsOpen }: Props): ReactNode {
  const [altText, setAltText] = useState<string>('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [editor] = useLexicalComposerContext();
  const { uploadPostImageMutation } = usePostImage();
  const [imageData, setImageData] = useState<{
    preview: string | undefined;
    file: File | undefined;
    width: number | undefined;
    height: number | undefined;
  }>({
    preview: imagePlaceholderSVG,
    file: undefined,
    width: undefined,
    height: undefined,
  });
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEscapeKey(() => setIsOpen(false));

  const reset = () => {
    setAltText('');
    setWidth('');
    setHeight('');
    setImageData({
      preview: imagePlaceholderSVG,
      file: undefined,
      width: undefined,
      height: undefined,
    });
  };
  useLayoutEffect(() => {
    if (isOpen && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    } else if (!isOpen && dialogRef.current?.open) {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleInputImageOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          setWidth(String(img.width));
          setHeight(String(img.height));
          setImageData({
            preview: reader.result as string,
            file: image,
            width: img.width,
            height: img.height,
          });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(image);
    }
  };

  const handleConfirm = async () => {
    if (!imageData.file) return;
    const result = await uploadPostImageMutation.mutateAsync(imageData.file);
    const insertImagePayload: ImagePayload = {
      altText,
      src: result.url,
      width: Number(width) || imageData.width,
      height: Number(height) || imageData.height,
      showCaption: true,
      captionsEnabled: true,
      resizable: true,
      backendId: result.backendId,
      placeholder: result.placeholder,
    };
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, insertImagePayload);

    reset();
    setIsOpen(false);
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={(e) => {
        if (e.target === dialogRef.current) {
          setIsOpen(false);
        }
      }}
      aria-describedby="image-modal-content"
      className="fixed z-10 w-full max-w-xl p-0 mx-auto my-auto overflow-y-hidden origin-top top-50 left-50 -translate-x-50 -translate-y-50 rounded-xl backdrop:bg-gray-800/50 animate-slideInWithFade"
    >
      {/**
       * How the backdrop close modal is working?
       *  - Add onClick to dialog :
       * onClick={(e) => {
       *   if (e.target === dialogRef.current) {
       *     setIsOpen(false);
       *   }
       * }}
       * - Add p-0 to the dialog
       * - Add a container div inside the dialig
       * */}
      <main className={'p-2'}>
        <div className="flex justify-end">
          <button
            type="button"
            className="text-xl font-bold text-gray-700 hover:text-gray-900"
            onClick={handleCancel}
            aria-label="Close"
          >
            <NextImage src={CloseSVG} alt="close" width={30} height={30} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center w-full p-2 mx-auto border border-gray-300 rounded-md md:p-3">
          <h1 className="text-2xl font-bold">Upload image</h1>
          <div className="relative m-1">
            <div className="flex items-center justify-center w-full max-w-md m-1 mx-auto border-2 border-gray-400 rounded shadow-sm h-md">
              <NextImage
                src={
                  uploadPostImageMutation.isLoading
                    ? loadingSVG
                    : imageData?.preview || imagePlaceholderSVG
                }
                alt="preview"
                width={200}
                height={200}
                className="object-cover p-3"
              />
            </div>
            <label
              htmlFor="image"
              aria-label="Upload image"
              title="Upload image"
              className="absolute p-1 m-1 border-2 border-gray-600 border-dashed cursor-pointer right-1 bottom-1"
            >
              <NextImage
                src={EditImageSVG}
                alt="Change image"
                width={30}
                height={30}
              />
            </label>
            <input
              type="file"
              id="image"
              accept="image/jpeg, image/jpg, image/png, image/webp"
              onChange={handleInputImageOnChange}
              className="hidden w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="relative flex flex-col m-1 gap-y-3">
            <input
              type="text"
              id="altText"
              aria-label="Add an alt text"
              title="Add an alternative text"
              placeholder="Add an alt text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-3">
              <div className="flex items-center justify-center">
                <input
                  type="number"
                  id="width"
                  aria-label="Add a custom width"
                  title="Add a custom width"
                  placeholder="Custom width (default)"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="ml-1 text-gray-500">px</span>
              </div>
              <div className="flex items-center justify-center">
                <input
                  type="number"
                  id="height"
                  aria-label="Add a custom height"
                  title="Add a custom height"
                  placeholder="Custom height (default)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="ml-1 text-gray-500">px</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-2 mx-1 my-2 md:flex-row">
            <button
              disabled={
                uploadPostImageMutation.isLoading ||
                imageData.file === undefined
              }
              type="button"
              onClick={handleConfirm}
              className="w-full max-w-md px-4 py-2 font-medium text-white rounded-md bg-brand-CTA-blue-500 hover:bg-brand-CTA-blue-600 disabled:cursor-not-allowed disabled:bg-brand-CTA-blue-300"
            >
              {uploadPostImageMutation.isLoading ? (
                <div className="flex items-center justify-center text-white">
                  <Spinner />
                </div>
              ) : (
                'Add Image'
              )}
            </button>

            <button
              className="w-full max-w-md px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </dialog>
  );
}
