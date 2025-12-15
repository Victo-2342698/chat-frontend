/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { API_BASE_URL } from '../../constants';

/* ================= TYPES ================= */

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

/* ================= HELPERS ================= */

const cleanNumber = (v: string) =>
  Number(v.replace(',', '.').replace(/[^0-9.]/g, ''));

/* ================= COMPONENT ================= */

export default function ChatAdd() {
  const navigate = useNavigate();
  const { token, isLoggedIn } = useContext(AuthContext);
  const { chats, refreshChats } = useContext(ChatContext);

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

  /* ================= INIT NUMERO DOSSIER ================= */

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

  /* ================= SUBMIT ================= */

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
        setErrorMsg(`❌ Champ obligatoire manquant : ${f}`);
        return;
      }
    }

    if (chats.some((c) => c.photos?.includes(formData.photoUrl))) {
      setErrorMsg('❌ Cette photo est déjà utilisée.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    if (formData.dateNaissance >= today) {
      setErrorMsg('❌ Date de naissance invalide.');
      return;
    }

    const poidsKg = cleanNumber(formData.poids);
    if (isNaN(poidsKg) || poidsKg <= 0.5) {
      setErrorMsg('❌ Le poids doit être supérieur à 500 g.');
      return;
    }

    const couts = [
      formData.coutTotal,
      formData.coutSterilisation,
      formData.coutVaccin,
      formData.coutVermifuge,
      formData.coutMicropuce,
    ];

    if (couts.some((c) => cleanNumber(c) <= 0)) {
      setErrorMsg('❌ Tous les coûts doivent être supérieurs à 0.');
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
      setErrorMsg('❌ Erreur lors de l’ajout.');
      return;
    }

    refreshChats();
    navigate('/');
  }

  if (loading) return <p className="text-center mt-10">Chargement…</p>;

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Ajouter un chat</h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 mb-6 rounded text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* ===== Infos générales ===== */}
        <L label="Nom">
          <I v={formData.nom} f="nom" u={update} />
        </L>

        <L label="Race">
          <I v={formData.race} f="race" u={update} />
        </L>

        <L label="Sexe">
          <select
            className="input"
            value={formData.sexe}
            onChange={(e) => update('sexe', e.target.value)}
          >
            <option value="">Choisir</option>
            <option value="Femelle">Femelle</option>
            <option value="Mâle">Mâle</option>
          </select>
        </L>

        <L label="Poids (kg)">
          <I v={formData.poids} f="poids" u={update} />
        </L>

        <L label="Numéro dossier">
          <input
            className="input bg-gray-100"
            value={formData.numeroDossier}
            readOnly
          />
        </L>

        <L label="Date naissance">
          <input
            type="date"
            className="input"
            value={formData.dateNaissance}
            onChange={(e) => update('dateNaissance', e.target.value)}
          />
        </L>

        <L label="Date mise en adoption">
          <input
            type="date"
            className="input"
            value={formData.dateMiseAdoption}
            onChange={(e) => update('dateMiseAdoption', e.target.value)}
          />
        </L>

        {/* ===== Notes / compatibilités ===== */}
        <L label="Énergie (1 à 5)">
          <input
            type="number"
            min={1}
            max={5}
            className="input text-center"
            value={formData.tauxEnergie}
            onChange={(e) => update('tauxEnergie', Number(e.target.value))}
          />
        </L>

        <L label="Sociabilité humain (1 à 5)">
          <input
            type="number"
            min={1}
            max={5}
            className="input text-center"
            value={formData.sociabiliteHumain}
            onChange={(e) =>
              update('sociabiliteHumain', Number(e.target.value))
            }
          />
        </L>

        <L label="Compatibilité enfants (1 à 5)">
          <input
            type="number"
            min={1}
            max={5}
            className="input text-center"
            value={formData.compatEnfants}
            onChange={(e) => update('compatEnfants', Number(e.target.value))}
          />
        </L>

        <L label="Compatibilité chiens (1 à 5)">
          <input
            type="number"
            min={1}
            max={5}
            className="input text-center"
            value={formData.compatChiens}
            onChange={(e) => update('compatChiens', Number(e.target.value))}
          />
        </L>

        <L label="Compatibilité chats (1 à 5)">
          <input
            type="number"
            min={1}
            max={5}
            className="input text-center"
            value={formData.compatChats}
            onChange={(e) => update('compatChats', Number(e.target.value))}
          />
        </L>

        {/* ===== Description & photo ===== */}
        <L label="Description">
          <textarea
            className="input min-h-[90px]"
            value={formData.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </L>

        <L label="Photo URL">
          <I v={formData.photoUrl} f="photoUrl" u={update} />
        </L>

        {/* ===== Santé / état ===== */}
        <L label="Micropuce">
          <label className="flex items-center gap-3 h-10">
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
              checked={formData.micropuce}
              onChange={(e) => update('micropuce', e.target.checked)}
            />
            <span>Oui</span>
          </label>
        </L>

        <L label="Stérilisé">
          <label className="flex items-center gap-3 h-10">
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
              checked={formData.sterilise}
              onChange={(e) => update('sterilise', e.target.checked)}
            />
            <span>Oui</span>
          </label>
        </L>

        <L label="Dégriffé">
          <label className="flex items-center gap-3 h-10">
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
              checked={formData.degraffe}
              onChange={(e) => update('degraffe', e.target.checked)}
            />
            <span>Oui</span>
          </label>
        </L>

        <L label="Vermifugé">
          <label className="flex items-center gap-3 h-10">
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
              checked={formData.vermifuge}
              onChange={(e) => update('vermifuge', e.target.checked)}
            />
            <span>Oui</span>
          </label>
        </L>

        <L label="Vaccins de base">
          <label className="flex items-center gap-3 h-10">
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
              checked={formData.vaccinsBase}
              onChange={(e) => update('vaccinsBase', e.target.checked)}
            />
            <span>Oui</span>
          </label>
        </L>

        <L label="Disponible">
          <label className="flex items-center gap-3 h-10">
            <input
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
              checked={formData.disponible}
              onChange={(e) => update('disponible', e.target.checked)}
            />
            <span>Oui</span>
          </label>
        </L>

        {/* ===== Coûts ===== */}
        <L label="Coût total ($)">
          <I v={formData.coutTotal} f="coutTotal" u={update} />
        </L>

        <L label="Coût stérilisation ($)">
          <I v={formData.coutSterilisation} f="coutSterilisation" u={update} />
        </L>

        <L label="Coût vaccin ($)">
          <I v={formData.coutVaccin} f="coutVaccin" u={update} />
        </L>

        <L label="Coût vermifuge ($)">
          <I v={formData.coutVermifuge} f="coutVermifuge" u={update} />
        </L>

        <L label="Coût micropuce ($)">
          <I v={formData.coutMicropuce} f="coutMicropuce" u={update} />
        </L>

        {/* ===== Submit ===== */}
        <button
          type="submit"
          className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-lg font-semibold transition"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

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
