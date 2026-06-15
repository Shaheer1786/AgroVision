import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { LanguageProvider } from './contexts/LanguageProvider';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);