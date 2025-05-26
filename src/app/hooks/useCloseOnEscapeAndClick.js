import { useEffect } from 'react';

export const useCloseOnEscapeAndClick = (ref, onClose) => {
  useEffect(() => {
    if (!onClose) return; // ✅ Exit early if no onClose function is provided

    const handleClickOutside = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      onClose(event);
    };

    const handleEscClose = (event) => {
      if (event.key === 'Escape') {
        onClose(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleEscClose);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleEscClose);
    };
  }, [ref, onClose]);
};
