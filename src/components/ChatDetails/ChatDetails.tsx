import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChatDelete from '../ChatDelete/ChatDelete';
import { API_BASE_URL } from '../../constants';

export default function ChatDetails() {
  const { chatid } = useParams();
  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await fetch(`${API_BASE_URL}/chats/${chatid}`);
        const data = await res.json();

        // selon ton backend
        setChat(data.data ?? data.chat ?? null);
      } catch (err) {
        console.error(err);
        setChat(null);
      } finally {
        setLoading(false);
      }
    }

    fetchChat();
  }, [chatid]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!chat) return <p className="text-center mt-10">Chat introuvable.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-6">
      <img
        src={chat.photos?.[0]}
        alt={chat.nom}
        className="w-full rounded-xl mb-6 object-cover h-64"
      />

      <h1 className="text-4xl font-bold mb-3 text-gray-800">{chat.nom}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-lg">
        <p>
          <span className="font-semibold">Race :</span> {chat.race}
        </p>
        <p>
          <span className="font-semibold">Sexe :</span> {chat.sexe ?? 'N/D'}
        </p>
        <p>
          <span className="font-semibold">Poids :</span> {chat.poids ?? 'N/D'}
        </p>
        <p>
          <span className="font-semibold">Numéro dossier :</span>{' '}
          {chat.numeroDossier}
        </p>
        <p>
          <span className="font-semibold">Date de naissance :</span>{' '}
          {chat.dateNaissance}
        </p>
        <p>
          <span className="font-semibold">Date mise en adoption :</span>{' '}
          {chat.dateMiseAdoption ?? 'N/D'}
        </p>

        <p>
          <span className="font-semibold">Énergie :</span> {chat.tauxEnergie}/5
        </p>
        <p>
          <span className="font-semibold">Sociabilité humain :</span>{' '}
          {chat.sociabiliteHumain}/5
        </p>
        <p>
          <span className="font-semibold">Compat. enfants :</span>{' '}
          {chat.compatEnfants}/5
        </p>
        <p>
          <span className="font-semibold">Compat. chiens :</span>{' '}
          {chat.compatChiens}/5
        </p>
        <p>
          <span className="font-semibold">Compat. chats :</span>{' '}
          {chat.compatChats}/5
        </p>

        <p>
          <span className="font-semibold">Micropuce :</span>{' '}
          {chat.micropuce ? 'Oui' : 'Non'}
        </p>
        <p>
          <span className="font-semibold">Stérilisé :</span>{' '}
          {chat.sterilise ? 'Oui' : 'Non'}
        </p>
        <p>
          <span className="font-semibold">Dégriffé :</span>{' '}
          {chat.degraffe ? 'Oui' : 'Non'}
        </p>
        <p>
          <span className="font-semibold">Vermifuge :</span>{' '}
          {chat.vermifuge ? 'Oui' : 'Non'}
        </p>
        <p>
          <span className="font-semibold">Vaccins de base :</span>{' '}
          {chat.vaccinsBase ? 'Oui' : 'Non'}
        </p>
        <p>
          <span className="font-semibold">Disponible :</span>{' '}
          {chat.disponible ? 'Oui' : 'Non'}
        </p>

        <p>
          <span className="font-semibold">Coût total :</span>{' '}
          {chat.coutTotal ?? 'N/D'} $
        </p>
        <p>
          <span className="font-semibold">Stérilisation :</span>{' '}
          {chat.coutSterilisation ?? 'N/D'} $
        </p>
        <p>
          <span className="font-semibold">Vaccin :</span>{' '}
          {chat.coutVaccin ?? 'N/D'} $
        </p>
        <p>
          <span className="font-semibold">Vermifuge :</span>{' '}
          {chat.coutVermifuge ?? 'N/D'} $
        </p>
        <p>
          <span className="font-semibold">Micropuce coût :</span>{' '}
          {chat.coutMicropuce ?? 'N/D'} $
        </p>
      </div>

      <div className="mt-6 text-gray-800 text-lg">
        <p className="font-semibold mb-1">Description :</p>
        <p>{chat.description}</p>
      </div>

      <div className="flex gap-4 mt-8">
        <Link
          to={`/edit/${chat._id}`}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          Modifier
        </Link>

        <ChatDelete chatid={chat._id} />
      </div>
    </div>
  );
}
