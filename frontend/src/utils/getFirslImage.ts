export const getFirstImage = (
  content: string,
): { src: string; placeholder: string } | null => {
  if (!content) return null;
  const data = JSON.parse(content);
  if (!data?.root?.children) {
    return null;
  }

  for (const child of data.root.children) {
    if (
      child?.type === 'paragraph' &&
      child?.children[0]?.type === 'image' &&
      child?.children[0]?.src
    ) {
      const result = {
        src: child.children[0].src,
        placeholder: child.children[0]?.placeholder,
      };
      return result;
    }
  }
  return null;
};
