import { AtomEffect, RecoilState, atom } from 'recoil';

/*const store = typeof window !== 'undefined' ? window.localStorage : null;
 const localStorageEffect: (key: string) => AtomEffect<any> =
  (key) =>
  ({ setSelf, onSet }) => {
    if (store) {
      const savedValue = store.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue, _, isReset) => {
        isReset ? store.removeItem(key) : store.setItem(key, JSON.stringify(newValue));
      });
    }
  }; */

export const isSignedin: RecoilState<boolean> = atom({
  key: 'isSignedin',
  default: true,
  //effects: [localStorageEffect('isSignedin')],
});

const timerEffect: (duration_ms: number) => AtomEffect<any> =
  (duration_ms: number) =>
  ({ setSelf, onSet }) => {
    let timerId: NodeJS.Timeout;
    const setTimer = () => {
      setTimeout(() => {
        setSelf(false);
      }, duration_ms);
    };

    onSet(() => {
      setTimer();
    });

    return () => {
      clearTimeout(timerId);
    };
  };

export const isThrottled: RecoilState<boolean> = atom({
  key: 'isThrottled',
  default: false,
  effects: [
    timerEffect(
      parseInt(process.env.NEXT_PUBLIC_THROTTLE_DURATION_MS || '60000', 10),
    ),
  ],
});

export const currentNodeType: RecoilState<string> = atom({
  key: 'nodeType',
  default: '',
});
