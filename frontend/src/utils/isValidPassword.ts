// Password should be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
};
export const checkPasswordRequirements = (password: string) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinimumLength = password.length >= 8;
  return {
    isValid: hasMinimumLength && hasUppercase && hasLowercase && hasNumber,
    feedback: {
      minimumLength: hasMinimumLength,
      uppercase: hasUppercase,
      lowercase: hasLowercase,
      number: hasNumber,
    },
  };
};
