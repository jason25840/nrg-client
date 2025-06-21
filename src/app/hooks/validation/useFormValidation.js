import { useState, useEffect, useRef } from 'react';

export function useFormValidation({
  initialValues,
  validate = () => ({}),
  onSubmit,
}) {
  const [values, setValues] = useState(initialValues || {});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const didMount = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear field error on change
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const runValidation = () => {
    const newErrors = validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    Object.keys(values).forEach((field) => {
      if (touched[field]) {
        const fieldError = validate(values)[field] || '';
        setErrors((prev) => ({ ...prev, [field]: fieldError }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!runValidation()) {
      return;
    }
    if (onSubmit) onSubmit();
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    validate: runValidation,
    setErrors,
    setValues,
    handleSubmit,
    setTouched,
    handleBlur: (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
  };
}
