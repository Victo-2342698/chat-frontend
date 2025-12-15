import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../constants';

export default function ChatDelete({ chatid }: { chatid?: string }) {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { refreshChats } = useContext(ChatContext);

  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function deleteChat() {
    if (!chatid) {
      alert('Aucun chat id reçu');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chats/${chatid}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        alert('Impossible de supprimer le chat.');
        return;
      }

      refreshChats();
      navigate('/');
    } catch {
      alert('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  }

  if (!confirm) {
    return (
      <button
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        onClick={() => setConfirm(true)}
      >
        Supprimer
      </button>
    );
  }

  return (
    <div className="space-x-3">
      <span className="font-semibold">Êtes-vous sûr ?</span>

      <button
        className="bg-gray-500 text-white px-3 py-2 rounded-lg hover:bg-gray-600"
        onClick={() => setConfirm(false)}
      >
        Annuler
      </button>

      <button
        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
        disabled={loading}
        onClick={deleteChat}
      >
        Oui, supprimer
      </button>
    </div>
  );
}
