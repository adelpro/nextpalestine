import {
  $createTextNode,
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_COPYRIGHT_COMMAND } from '../plugins/copyrightPlugin';
import { INSERT_YOUTUBE_COMMAND } from '../plugins/youtubePlugin';
import embedSVG from '@/components/editor/editorSVGS/embed.svg';
import { INSERT_TWEET_COMMAND } from '../plugins/tweeterPlugin';
import { INSERT_IMAGE_COMMAND } from '../plugins/imagePlugin';
import getExifData from '../utils/getExifData';
import Image from 'next/image';
import * as React from 'react';

export default function EmbaddedAction(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  async function embaddedURL(editor: LexicalEditor) {
    const url = prompt('Enter Your URL:', '');
    if (!url) {
      return;
    }

    // Twitter / x
    const matchX =
      /^https:\/\/(twitter|x)\.com\/(#!\/)?(\w+)\/status(es)*\/(\d+)/.exec(url);

    if (matchX) {
      const id = matchX[5];
      editor.dispatchCommand(INSERT_TWEET_COMMAND, id);
      return;
    }

    //Youtube
    const matchYoutube = /^https:\/\/www\.youtube\.com\/watch\?v=(.*)$/.exec(
      url,
    );
    if (matchYoutube) {
      const id = matchYoutube[1];
      editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, id);
      return;
    }
    // Pexels

    const matchPexels =
      /^(?:https?:\/\/)?(?:www\.)?pexels\.com\/photo\/.*-(\d+)(?:\/)?$/i.exec(
        url,
      );

    if (matchPexels) {
      const id = matchPexels[1];
      // use api
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/pexels-copyright?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then((res) => res.json())
        .then((res) => res);
      const { photographer, photographer_url, src } = response;
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText:
          'Photographer: ' +
          photographer +
          ' Photographer URL: ' +
          photographer_url,
        src,
        showCaption: true,
      });
      editor.dispatchCommand(INSERT_COPYRIGHT_COMMAND, {
        photographer,
        photographer_url,
        host: 'pixels',
      });
      return;
    }
    // Unsplash
    const matchUnsplash =
      /^(?:https?:\/\/)?(?:www\.)?unsplash\.com\/photos\/.*-(.+)(?:\/)?$/i.exec(
        url,
      );
    if (matchUnsplash) {
      const id = matchUnsplash[1];

      // use api
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/unsplash-copyright?id=${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then((res) => res.json())
        .then((res) => res);

      const { photographer, photographer_url, src } = response;
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText:
          'Photographer: ' +
          photographer +
          ' Photographer URL: ' +
          photographer_url,
        src,
        showCaption: true,
      });
      editor.dispatchCommand(INSERT_COPYRIGHT_COMMAND, {
        photographer,
        photographer_url,
        host: 'unsplash',
      });
      return;
    }

    // Pixabay
    const matchPixabay =
      /^(?:https?:\/\/)?(?:www\.)?pixabay\.com\/photos\/.*-(\d+)(?:\/)?$/i.exec(
        url,
      );
    if (matchPixabay) {
      const id = matchPixabay[1];
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/pixabay-copyright?id=${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
        .then((res) => res.json())
        .then((res) => res);

      const { photographer, photographer_url, src } = response;
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText:
          'Photographer: ' +
          photographer +
          ' Photographer URL: ' +
          photographer_url,
        src,
        showCaption: true,
      });

      editor.dispatchCommand(INSERT_COPYRIGHT_COMMAND, {
        photographer,
        photographer_url,
        host: 'pixabay',
      });
      return;

      return;
    }

    // Fallback to image if it's possible
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        return;
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: 'Image URL: ' + url,
          src: url,
          showCaption: true,
        });
        const exifData = await getExifData(url);
        if (!exifData.Artist) {
          return;
        }
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return;
          }
          const copyright = `Photo by ${exifData.Artist || 'Unknown Artist'} - ${
            exifData.License || 'Unknown License'
          }`;

          const textNode = $createTextNode(copyright).toggleFormat('italic');
          selection.insertNodes([textNode]);
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
          selection.insertParagraph();
        });

        return;
      }
      throw new Error('The provided URL do not contain a valid image.');
    } catch (error: any) {
      alert(`Fetch error: ${error?.message}`);
    }
  }

  return (
    <button
      onClick={() => {
        embaddedURL(editor);
      }}
      title="Embadded URL"
      aria-label="Embadded URL"
      className="p-1 m-1 text-gray-700 transition-all duration-300 border-b-2 cursor-pointer hover:border-slate-500"
    >
      <Image src={embedSVG} alt="Add Embadded URL" width={20} height={20} />
    </button>
  );
}
