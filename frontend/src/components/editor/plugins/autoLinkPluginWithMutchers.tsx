import {
  AutoLinkPlugin,
  createLinkMatcherWithRegExp,
} from '@lexical/react/LexicalAutoLinkPlugin';

const isProtocolPrefix = (text: string): boolean => {
  if (
    !text.startsWith('https://') &&
    !text.startsWith('http://') &&
    !text.startsWith('ftps://') &&
    !text.startsWith('ftp://') &&
    !text.startsWith('ipfs://')
  ) {
    return false;
  }
  return true;
};
export const URL_REGEX =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

export const MATCHERS = [
  createLinkMatcherWithRegExp(URL_REGEX, (text) => {
    return isProtocolPrefix(text) ? text : `https://${text}`;
  }),
  createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
    return isProtocolPrefix(text) ? text : `https://${text}`;
  }),
];

export default function AutoLinkPluginWithMutchers() {
  return <AutoLinkPlugin matchers={MATCHERS} />;
}
