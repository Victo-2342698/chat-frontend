import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthProvider from '../../contexts/AuthContext';
import ChatProvider from '../../contexts/ChatContext';

import Menu from '../Menu/Menu';
import ChatsList from '../ChatsList/ChatsList';
import ChatAdd from '../ChatAdd/ChatAdd';
import ChatEdit from '../ChatEdit/ChatEdit';
import ChatDetails from '../ChatDetails/ChatDetails';
import ChatDelete from '../ChatDelete/ChatDelete';
import Login from '../Login/Login';

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Menu />}>
              <Route index element={<ChatsList />} />
              <Route path="ajout" element={<ChatAdd />} />
              <Route path="edit/:chatid" element={<ChatEdit />} />
              <Route path="details/:chatid" element={<ChatDetails />} />
              <Route path="delete/:chatid" element={<ChatDelete />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}
