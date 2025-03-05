'use client';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ToastContainer position='top-right' autoClose={3000} />
      {children}
    </Provider>
  );
}
