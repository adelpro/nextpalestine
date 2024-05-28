import { cn } from '@/utils/cn';

import { currentNodeType } from '@/recoil/store';
import { useRecoilValue } from 'recoil';
import { ReactNode } from 'react';
type Props = {
  children: ReactNode;
  onClick: () => void;
  action: string;
};
export default function ActionButton({ children, onClick, action }: Props) {
  const currentNodeTypeValue = useRecoilValue(currentNodeType);

  const isActive =
    currentNodeTypeValue.toLocaleLowerCase() === action.toLocaleLowerCase();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isActive ? `Remove ${action}` : `Add ${action}`}
      className={cn(
        'text-gray-700 m-1 p-1 border-b-2 hover:border-slate-500 transition-all duration-300',
        {
          'bg-slate-100 border border-slate-300 rounded shadow': isActive,
        },
      )}
      title={`${action}`}
    >
      {children}
    </button>
  );
}
