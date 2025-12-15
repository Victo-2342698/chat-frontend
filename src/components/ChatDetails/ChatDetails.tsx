import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChatDelete from '../ChatDelete/ChatDelete';
import { API_BASE_URL } from '../../constants';
import { LanguageContext } from '../../contexts/LanguageContext';

export default function ChatDetails() {
  const { chatid } = useParams();
  const { messages } = useContext(LanguageContext);

  const [chat, setChat] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await fetch(`${API_BASE_URL}/chats/${chatid}`);
        const data = await res.json();
        setChat(data.data ?? data.chat ?? null);
      } catch {
        setChat(null);
      } finally {
        setLoading(false);
      }
    }
    fetchChat();
  }, [chatid]);

  if (loading)
    return (
      <p className="text-center mt-10">
        {messages['loading'] ?? 'Chargement...'}
      </p>
    );

  if (!chat)
    return (
      <p className="text-center mt-10">
        {messages['error.notFound'] ?? 'Chat introuvable.'}
      </p>
    );

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
          <span className="font-semibold">{messages['field.race']} :</span>{' '}
          {chat.race}
        </p>
        <p>
          <span className="font-semibold">{messages['field.sex']} :</span>{' '}
          {chat.sexe ?? 'N/D'}
        </p>
        <p>
          <span className="font-semibold">{messages['field.weight']} :</span>{' '}
          {chat.poids ?? 'N/D'}
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.fileNumber']} :
          </span>{' '}
          {chat.numeroDossier}
        </p>
        <p>
          <span className="font-semibold">{messages['field.birthDate']} :</span>{' '}
          {chat.dateNaissance}
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.adoptionDate']} :
          </span>{' '}
          {chat.dateMiseAdoption ?? 'N/D'}
        </p>

        <p>
          <span className="font-semibold">{messages['field.energy']} :</span>{' '}
          {chat.tauxEnergie}/5
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.humanSocial']} :
          </span>{' '}
          {chat.sociabiliteHumain}/5
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.childCompat']} :
          </span>{' '}
          {chat.compatEnfants}/5
        </p>
        <p>
          <span className="font-semibold">{messages['field.dogCompat']} :</span>{' '}
          {chat.compatChiens}/5
        </p>
        <p>
          <span className="font-semibold">{messages['field.catCompat']} :</span>{' '}
          {chat.compatChats}/5
        </p>

        <p>
          <span className="font-semibold">{messages['field.microchip']} :</span>{' '}
          {chat.micropuce ? messages['value.yes'] : messages['value.no']}
        </p>
        <p>
          <span className="font-semibold">{messages['field.neutered']} :</span>{' '}
          {chat.sterilise ? messages['value.yes'] : messages['value.no']}
        </p>
        <p>
          <span className="font-semibold">{messages['field.declawed']} :</span>{' '}
          {chat.degraffe ? messages['value.yes'] : messages['value.no']}
        </p>
        <p>
          <span className="font-semibold">{messages['field.dewormed']} :</span>{' '}
          {chat.vermifuge ? messages['value.yes'] : messages['value.no']}
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.vaccinated']} :
          </span>{' '}
          {chat.vaccinsBase ? messages['value.yes'] : messages['value.no']}
        </p>
        <p>
          <span className="font-semibold">{messages['field.available']} :</span>{' '}
          {chat.disponible ? messages['value.yes'] : messages['value.no']}
        </p>

        <p>
          <span className="font-semibold">{messages['field.totalCost']} :</span>{' '}
          {chat.coutTotal} $
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.neuteringCost']} :
          </span>{' '}
          {chat.coutSterilisation} $
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.vaccineCost']} :
          </span>{' '}
          {chat.coutVaccin} $
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.dewormingCost']} :
          </span>{' '}
          {chat.coutVermifuge} $
        </p>
        <p>
          <span className="font-semibold">
            {messages['field.microchipCost']} :
          </span>{' '}
          {chat.coutMicropuce} $
        </p>
      </div>

      <div className="mt-6 text-gray-800 text-lg">
        <p className="font-semibold mb-1">{messages['field.description']} :</p>
        <p>{chat.description}</p>
      </div>

      <div className="flex gap-4 mt-8">
        <Link
          to={`/edit/${chat._id}`}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          {messages['button.edit']}
        </Link>

        <ChatDelete chatid={chat._id} />
      </div>
    </div>
  );
}
