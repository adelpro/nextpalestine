'use client';
import React, { useState, useEffect } from 'react';

type props = {
  error: Error & { digest?: string };
  reset: () => void;
};
export default function Error({ error, reset }: props) {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      // Extract a user-friendly message from the error object
      const userMessage = error.message || 'An unexpected error occurred.';
      setErrorMessage(userMessage);

      // Log the error for debugging purposes
      console.error(error);
    }
  }, [error]);

  return (
    <div className="error-container">
      <h2 className="error-title">Uh oh, something went wrong!</h2>
      <p className="error-message">{errorMessage}</p>
      <button className="error-button" onClick={reset}>
        Try Again
      </button>
    </div>
  );
}
