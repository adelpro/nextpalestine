/**
 * Creates a debounced version of the given function.
 *
 * @param {Function} fn - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @return {Function} - The debounced function.
 */
export function debounce<F extends (...params: any[]) => void>(
  fn: F,
  delay: number,
) {
  let timeoutID: number | undefined;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}
