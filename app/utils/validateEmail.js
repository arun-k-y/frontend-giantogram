export const validateInputs = (email, password, setErrorMessage) => {
  if (!email.trim()) {
    setErrorMessage("Enter details to login");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setErrorMessage("Enter Valid Email");
    return false;
  }

  if (!password.trim()) {
    setErrorMessage("Enter details to login");
    return false;
  }

  if (password.length < 8) {
    setErrorMessage("Password must be at least 8 characters.");
    return false;
  }

  return true;
};
