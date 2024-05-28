import { checkPasswordRequirements } from '@/utils/isValidPassword';
import React from 'react';

type Props = { password: string };
export default function PasswordRequirements({ password }: Props): JSX.Element {
  const feedback = checkPasswordRequirements(password).feedback;
  const isValid = checkPasswordRequirements(password).isValid;
  if (!password || isValid) return <></>;
  return (
    <div className="flex flex-col items-start m-2">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-full appearance-none pointer-events-none focus:ring-0 checked:bg-green-500 checked:hover:bg-green-500 checked:border-transparent"
          checked={feedback.minimumLength}
          readOnly
        />
        <span className="ml-2">Minimum length</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-full appearance-none pointer-events-none focus:ring-0 checked:bg-green-500 checked:hover:bg-green-500 checked:border-transparent"
          checked={feedback.uppercase}
          readOnly
        />
        <span>Uppercase</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-full appearance-none pointer-events-none focus:ring-0 checked:bg-green-500 checked:hover:bg-green-500 checked:border-transparent"
          checked={feedback.lowercase}
          readOnly
        />
        <span>Lowercase</span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="w-4 h-4 rounded-full appearance-none pointer-events-none focus:ring-0 checked:bg-green-500 checked:hover:bg-green-500 checked:border-transparent"
          checked={feedback.number}
          readOnly
        />
        <span>Number</span>
      </label>
    </div>
  );
}
