import { useContext, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function Menu() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) navigate('/login');
  }, [isLoggedIn]);

  return (
    <>
      <nav className="bg-gray-800 p-4 text-white flex justify-between">
        <div className="flex space-x-4">
          <Link to="/">Chats disponibles</Link>
          <Link to="/ajout">Ajouter un chat</Link>
        </div>
        <button className="hover:text-gray-300" onClick={logout}>
          Se déconnecter
        </button>
      </nav>
      <Outlet />
    </>
  );
}
