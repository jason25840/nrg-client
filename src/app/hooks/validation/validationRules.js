export const validateSignin = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const validateSignup = (values) => {
  const errors = validateSignin(values); // reuse shared rules

  if (!values.password2) {
    errors.password2 = 'Please confirm your password';
  } else if (values.password !== values.password2) {
    errors.password2 = 'Passwords do not match';
  }

  return errors;
};
export const validateProfile = (values) => {
  const errors = {};
  if (!values.username || values.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }

  if (values.bio && values.bio.length > 160) {
    errors.bio = 'Bio must be under 160 characters';
  }

  // Add more per your schema
  return errors;
};
