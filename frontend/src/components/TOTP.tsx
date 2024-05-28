import React, { useState } from 'react';

export function TOTP() {
  const [TOTP, setTOTP] = useState('------');

  const handleChange = (e: any) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/[^0-9]/g, '').slice(0, 6); // Ensure only digits and limit to 6 characters
    const formattedInput = sanitizedInput.padEnd(6, '-'); // Add dashes to reach 6 characters
    setTOTP(formattedInput);
  };

  return (
    <input
      id="TOTP"
      type="text"
      value={TOTP}
      onChange={handleChange}
      className="mx-auto w-52 rounded-md border border-gray-300 px-3 py-2"
    />
  );
}

export default TOTP;
