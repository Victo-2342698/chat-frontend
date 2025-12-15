import { useContext, useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';

export default function Menu() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { locale, setLanguage, messages } = useContext(LanguageContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
        <div className="flex space-x-4 items-center">
          <Link to="/" className="hover:text-gray-300">
            {messages['menu.home'] ?? 'Accueil'}
          </Link>

          <Link to="/ajout" className="hover:text-gray-300">
            {messages['menu.add'] ?? 'Ajouter un chat'}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <button
              className={`px-2 py-1 rounded text-sm ${
                locale === 'fr'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              onClick={() => setLanguage('fr')}
            >
              FR
            </button>

            <button
              className={`px-2 py-1 rounded text-sm ${
                locale === 'en'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
          </div>

          <button className="hover:text-gray-300" onClick={logout}>
            {messages['menu.logout'] ?? 'Se déconnecter'}
          </button>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
