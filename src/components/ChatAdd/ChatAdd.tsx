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

const cleanNumber = (v: string): number =>
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

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    refreshChats();
    const max = chats.length
      ? Math.max(...chats.map((c) => c.numeroDossier))
      : 1000;

    setFormData((p) => ({ ...p, numeroDossier: max + 1 }));
    setLoading(false);
  }, []);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((p) => ({ ...p, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    for (const field of required) {
      if (!formData[field]) {
        setErrorMsg(
          `${messages['error.required'] ?? 'Champ requis'} : ${
            messages[`field.${field}`] ?? field
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

  if (loading) {
    return <p className="text-center mt-10">Loading…</p>;
  }

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-10 mt-10">
      <h2 className="text-3xl font-bold text-center mb-8">
        {messages['menu.add']}
      </h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 mb-6 rounded text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        <Field label={messages['field.name']}>
          <Input value={formData.nom} onChange={(v) => update('nom', v)} />
        </Field>

        <Field label={messages['field.race']}>
          <Input value={formData.race} onChange={(v) => update('race', v)} />
        </Field>

        <Field label={messages['field.sex']}>
          <select
            className="input"
            value={formData.sexe}
            onChange={(e) => update('sexe', e.target.value)}
          >
            <option value="">{messages['common.choose']}</option>
            <option value="Femelle">{messages['common.female']}</option>
            <option value="Mâle">{messages['common.male']}</option>
          </select>
        </Field>

        <Field label={messages['field.weight']}>
          <Input value={formData.poids} onChange={(v) => update('poids', v)} />
        </Field>

        <Field label={messages['field.fileNumber']}>
          <input
            className="input bg-gray-100"
            value={formData.numeroDossier}
            readOnly
          />
        </Field>

        <Field label={messages['field.birthDate']}>
          <input
            type="date"
            className="input"
            value={formData.dateNaissance}
            onChange={(e) => update('dateNaissance', e.target.value)}
          />
        </Field>

        <Field label={messages['field.adoptionDate']}>
          <input
            type="date"
            className="input"
            value={formData.dateMiseAdoption}
            onChange={(e) => update('dateMiseAdoption', e.target.value)}
          />
        </Field>

        <Field label={messages['field.energy'] + ' (1–5)'}>
          <NumberInput
            value={formData.tauxEnergie}
            onChange={(v) => update('tauxEnergie', v)}
          />
        </Field>

        <Field label={messages['field.humanSocial'] + ' (1–5)'}>
          <NumberInput
            value={formData.sociabiliteHumain}
            onChange={(v) => update('sociabiliteHumain', v)}
          />
        </Field>

        <Field label={messages['field.childCompat'] + ' (1–5)'}>
          <NumberInput
            value={formData.compatEnfants}
            onChange={(v) => update('compatEnfants', v)}
          />
        </Field>

        <Field label={messages['field.dogCompat'] + ' (1–5)'}>
          <NumberInput
            value={formData.compatChiens}
            onChange={(v) => update('compatChiens', v)}
          />
        </Field>

        <Field label={messages['field.catCompat'] + ' (1–5)'}>
          <NumberInput
            value={formData.compatChats}
            onChange={(v) => update('compatChats', v)}
          />
        </Field>

        <Field label={messages['field.description']}>
          <textarea
            className="input min-h-[100px]"
            value={formData.description}
            onChange={(e) => update('description', e.target.value)}
          />
        </Field>

        <Field label={messages['field.photo']}>
          <Input
            value={formData.photoUrl}
            onChange={(v) => update('photoUrl', v)}
          />
        </Field>
        <Field label="Options de santé">
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={formData.micropuce}
              onChange={(e) => update('micropuce', e.target.checked)}
            />
            Micropucé
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={formData.sterilise}
              onChange={(e) => update('sterilise', e.target.checked)}
            />
            Stérilisé
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={formData.degraffe}
              onChange={(e) => update('degraffe', e.target.checked)}
            />
            Dégriffé
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={formData.vermifuge}
              onChange={(e) => update('vermifuge', e.target.checked)}
            />
            Vermifugé
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={formData.vaccinsBase}
              onChange={(e) => update('vaccinsBase', e.target.checked)}
            />
            Vaccins de base
          </label>

          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={formData.disponible}
              onChange={(e) => update('disponible', e.target.checked)}
            />
            Disponible à l’adoption
          </label>
        </Field>

        <Field label={messages['field.totalCost']}>
          <Input
            value={formData.coutTotal}
            onChange={(v) => update('coutTotal', v)}
          />
        </Field>

        <Field label={messages['field.neuteringCost']}>
          <Input
            value={formData.coutSterilisation}
            onChange={(v) => update('coutSterilisation', v)}
          />
        </Field>

        <Field label={messages['field.vaccineCost']}>
          <Input
            value={formData.coutVaccin}
            onChange={(v) => update('coutVaccin', v)}
          />
        </Field>

        <Field label={messages['field.dewormingCost']}>
          <Input
            value={formData.coutVermifuge}
            onChange={(v) => update('coutVermifuge', v)}
          />
        </Field>

        <Field label={messages['field.microchipCost']}>
          <Input
            value={formData.coutMicropuce}
            onChange={(v) => update('coutMicropuce', v)}
          />
        </Field>

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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      min={1}
      max={5}
      className="input"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
