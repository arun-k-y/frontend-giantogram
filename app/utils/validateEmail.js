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

  if (password.length < 6) {
    setErrorMessage("Password must be at least 6 characters.");
    return false;
  }

  return true;
};
