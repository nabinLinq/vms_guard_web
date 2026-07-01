import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AppRouter } from './router';
import { ToastContainer } from './components/Toast/Toast';
import i18n from './i18n';
import './styles/tokens.css';
import './styles/global.css';
import './styles/animations.css';
import { useEffect } from 'react';
import { useOfflineQueueStore } from './store/offlineQueueStore';

function App() {
  const drainQueue = useOfflineQueueStore((state) => state.drainQueue);

  useEffect(() => {
    // Attempt initial drain in case we came online while app was closed
    if (navigator.onLine) {
      drainQueue();
    }
  }, [drainQueue]);

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AppRouter />
        <ToastContainer />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
