import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConfigProvider } from 'antd';
import store, { persistor } from './store';
import { AppRoutes } from './routes';

import './App.scss';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#195F8A',
            },
            components: {
              Card: {
                bodyPadding: 0,
              },
            }
          }}
        >
          <AppRoutes />
          <Toaster position="top-center" />
        </ConfigProvider>
      </PersistGate>
    </Provider >
  );
}

export default App;
