import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { LanguageContext } from '../../contexts/LanguageContext';
import { API_BASE_URL } from '../../constants';

type FormData = {
  nom: string;
  race: string;
  sexe: string;
  poids: string;
  numeroDossier: number;
  dateNaissance: string;
  dateMiseAdoption: string;

  tauxEnergie: number;
  sociabiliteHumain: number;
  compatEnfants: number;
  compatChiens: number;
  compatChats: number;

  micropuce: boolean;
  sterilise: boolean;
  degraffe: boolean;
  vermifuge: boolean;
  vaccinsBase: boolean;
  disponible: boolean;

  coutTotal: string;
  coutSterilisation: string;
  coutVaccin: string;
  coutVermifuge: string;
  coutMicropuce: string;

  description: string;
  photoUrl: string;
};

const cleanNumber = (v: string) =>
  Number(v.replace(',', '.').replace(/[^0-9.]/g, ''));

export default function ChatAdd() {
  const navigate = useNavigate();
  const { token, isLoggedIn } = useContext(AuthContext);
  const { chats, refreshChats } = useContext(ChatContext);
  const { messages } = useContext(LanguageContext);

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    nom: '',
    race: '',
    sexe: '',
    poids: '',
    numeroDossier: 0,
    dateNaissance: '',
    dateMiseAdoption: '',

    tauxEnergie: 1,
    sociabiliteHumain: 1,
    compatEnfants: 1,
    compatChiens: 1,
    compatChats: 1,

    micropuce: false,
    sterilise: false,
    degraffe: false,
    vermifuge: false,
    vaccinsBase: false,
    disponible: true,

    coutTotal: '',
    coutSterilisation: '',
    coutVaccin: '',
    coutVermifuge: '',
    coutMicropuce: '',

    description: '',
    photoUrl: '',
  });

  if (!isLoggedIn) navigate('/login');

  useEffect(() => {
    refreshChats();
    const max = chats.length
      ? Math.max(...chats.map((c) => c.numeroDossier))
      : 1000;
    setFormData((p) => ({ ...p, numeroDossier: max + 1 }));
    setLoading(false);
  }, []);

  function update<K extends keyof FormData>(k: K, v: FormData[K]) {
    setFormData((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    const required: (keyof FormData)[] = [
      'nom',
      'race',
      'sexe',
      'poids',
      'dateNaissance',
      'dateMiseAdoption',
      'description',
      'photoUrl',
      'coutTotal',
      'coutSterilisation',
      'coutVaccin',
      'coutVermifuge',
      'coutMicropuce',
    ];

    for (const f of required) {
      if (!formData[f]) {
        setErrorMsg(
          `${messages['error.required'] ?? 'Champ requis'} : ${
            messages[`field.${f}`] ?? f
          }`,
        );
        return;
      }
    }

    const poidsKg = cleanNumber(formData.poids);
    if (isNaN(poidsKg) || poidsKg <= 0.5) {
      setErrorMsg(messages['error.weight'] ?? 'Poids invalide');
      return;
    }

    const body = {
      ...formData,
      poids: poidsKg,
      coutTotal: cleanNumber(formData.coutTotal),
      coutSterilisation: cleanNumber(formData.coutSterilisation),
      coutVaccin: cleanNumber(formData.coutVaccin),
      coutVermifuge: cleanNumber(formData.coutVermifuge),
      coutMicropuce: cleanNumber(formData.coutMicropuce),
      photos: [formData.photoUrl],
    };

    const res = await fetch(`${API_BASE_URL}/chats/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setErrorMsg(messages['error.add'] ?? 'Erreur lors de l’ajout');
      return;
    }

    refreshChats();
    navigate('/');
  }

  if (loading) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        {messages['menu.add']}
      </h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 mb-6 rounded text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <L label={messages['field.name']}>
          <I v={formData.nom} f="nom" u={update} />
        </L>

        <L label={messages['field.race']}>
          <I v={formData.race} f="race" u={update} />
        </L>

        <L label={messages['field.sex']}>
          <select
            className="input"
            value={formData.sexe}
            onChange={(e) => update('sexe', e.target.value)}
          >
            <option value="">{messages['common.choose'] ?? 'Choisir'}</option>
            <option value="Femelle">
              {messages['common.female'] ?? 'Femelle'}
            </option>
            <option value="Mâle">{messages['common.male'] ?? 'Mâle'}</option>
          </select>
        </L>

        <L label={messages['field.weight']}>
          <I v={formData.poids} f="poids" u={update} />
        </L>

        <L label={messages['field.fileNumber']}>
          <input
            className="input bg-gray-100"
            value={formData.numeroDossier}
            readOnly
          />
        </L>

        <L label={messages['field.birthDate']}>
          <input
            type="date"
            className="input"
            value={formData.dateNaissance}
            onChange={(e) => update('dateNaissance', e.target.value)}
          />
        </L>

        <L label={messages['field.adoptionDate']}>
          <input
            type="date"
            className="input"
            value={formData.dateMiseAdoption}
            onChange={(e) => update('dateMiseAdoption', e.target.value)}
          />
        </L>

        <L label={`${messages['field.energy']} (1–5)`}>
          <input
            type="number"
            min={1}
            max={5}
            className="input"
            value={formData.tauxEnergie}
            onChange={(e) => update('tauxEnergie', Number(e.target.value))}
          />
        </L>

        <L label={`${messages['field.humanSocial']} (1–5)`}>
          <input
            type="number"
            min={1}
            max={5}
            className="input"
            value={formData.sociabiliteHumain}
            onChange={(e) =>
              update('sociabiliteHumain', Number(e.target.value))
            }
          />
        </L>

        <L label={`${messages['field.childCompat']} (1–5)`}>
          <input
            type="number"
            min={1}
            max={5}
            className="input"
            value={formData.compatEnfants}
            onChange={(e) => update('compatEnfants', Number(e.target.value))}
          />
        </L>

        <L label={`${messages['field.dogCompat']} (1–5)`}>
          <input
            type="number"
            min={1}
            max={5}
            className="input"
            value={formData.compatChiens}
            onChange={(e) => update('compatChiens', Number(e.target.value))}
          />
        </L>

        <L label={`${messages['field.catCompat']} (1–5)`}>
          <input
            type="number"
            min={1}
            max={5}
            className="input"
            value={formData.compatChats}
            onChange={(e) => update('compatChats', Number(e.target.value))}
          />
        </L>

        <L label={messages['field.description']}>
          <textarea
            className="input min-h-[90px]"
            value={formData.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </L>

        <L label="Photo URL">
          <I v={formData.photoUrl} f="photoUrl" u={update} />
        </L>

        <L label={messages['field.totalCost']}>
          <I v={formData.coutTotal} f="coutTotal" u={update} />
        </L>

        <L label={messages['field.neuteringCost']}>
          <I v={formData.coutSterilisation} f="coutSterilisation" u={update} />
        </L>

        <L label={messages['field.vaccineCost']}>
          <I v={formData.coutVaccin} f="coutVaccin" u={update} />
        </L>

        <L label={messages['field.dewormingCost']}>
          <I v={formData.coutVermifuge} f="coutVermifuge" u={update} />
        </L>

        <L label={messages['field.microchipCost']}>
          <I v={formData.coutMicropuce} f="coutMicropuce" u={update} />
        </L>

        <button
          type="submit"
          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-lg font-semibold"
        >
          {messages['button.add']}
        </button>
      </form>
    </div>
  );
}

function L({ label, children }: any) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      {children}
    </div>
  );
}

function I({ v, f, u }: any) {
  return (
    <input className="input" value={v} onChange={(e) => u(f, e.target.value)} />
  );
}
