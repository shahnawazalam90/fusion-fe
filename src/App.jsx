import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import { AppRoutes } from './routes';

import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRoutes />
        <Toaster position="top-center" />
      </PersistGate>
    </Provider>
  );
}

export default App;
