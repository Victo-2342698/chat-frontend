import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, isLoggedIn, restoreLogin, pageRedirectAfterLogin } =
    useContext(AuthContext);

  const { messages } = useContext(LanguageContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');

  const navigate = useNavigate();

  async function submit() {
    login(email, password)
      .then((ok) => {
        if (!ok) {
          setErreur('Identifiants invalides');
        } else {
          setErreur('');
        }
      })
      .catch(() => setErreur('Erreur serveur'));
  }

  useEffect(() => {
    restoreLogin();
  }, []);

  useEffect(() => {
    if (isLoggedIn) navigate(pageRedirectAfterLogin);
  }, [isLoggedIn]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 shadow rounded max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{messages['login.title']}</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Mot de passe"
          onChange={(e) => setPassword(e.target.value)}
        />

        <p className="text-red-600 mb-3">{erreur}</p>

        <button
          onClick={submit}
          className="bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          {messages['login.button']}
        </button>
      </div>
    </div>
  );
}
