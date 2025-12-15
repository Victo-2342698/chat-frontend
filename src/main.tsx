import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App';

import AuthProvider from './contexts/AuthContext'; // ✔ correct
import ChatProvider from './contexts/ChatContext'; // ✔ nouveau provider chats

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </StrictMode>,
);
