import '@erp/ui/styles.css';
import { initI18n } from '@erp/ui';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app/App';
import { panelResources } from '@/common/i18n/resources';

initI18n(panelResources);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
