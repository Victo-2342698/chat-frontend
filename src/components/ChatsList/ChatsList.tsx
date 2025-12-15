import { useContext, useEffect } from 'react';
import { ChatContext } from '../../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';

export default function ChatsList() {
  const { chats, refreshChats } = useContext(ChatContext);
  const navigate = useNavigate();

  // Charger les chats au montage
  useEffect(() => {
    refreshChats();
  }, []);

  // Sécurité : si chats est undefined → retourner un message
  if (!Array.isArray(chats)) {
    return <p className="p-4">Chargement...</p>;
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chats.length === 0 && (
        <p className="text-center text-gray-500 col-span-full">
          Aucun chat trouvé.
        </p>
      )}

      {chats.map((chat) => (
        <div
          key={chat._id}
          className="p-4 bg-white shadow rounded cursor-pointer hover:bg-gray-50"
          onClick={() => navigate(`/details/${chat._id}`)}
        >
          <img
            src={chat.photos?.[0] || 'https://placekitten.com/400/300'}
            alt={chat.nom}
            className="w-full h-48 object-cover rounded mb-2"
          />

          <h3 className="text-lg font-bold">{chat.nom}</h3>
          <p className="text-sm text-gray-600">{chat.race}</p>
          <p className="text-sm text-gray-600">
            Dossier : {chat.numeroDossier}
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/edit/${chat._id}`);
            }}
            className="mt-3 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Modifier
          </button>
        </div>
      ))}
    </div>
  );
}
