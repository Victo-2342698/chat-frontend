/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ChatContext } from '../../contexts/ChatContext';
import { API_BASE_URL } from '../../constants';

type FormData = {
  nom: string;
  race: string;
  sexe: string;
  poids: string;
  numeroDossier: string;
  dateNaissance: string;
  dateMiseAdoption: string;
  description: string;

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

  photoUrl: string;
};

const nettoyerNombre = (v: string) =>
  Number(v.replace(',', '.').replace(/[^0-9.]/g, ''));

export default function ChatEdit() {
  const { chatid } = useParams();
  const navigate = useNavigate();

  const { token } = useContext(AuthContext);
  const { getChat, refreshChats } = useContext(ChatContext);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState<FormData>({
    nom: '',
    race: '',
    sexe: '',
    poids: '',
    numeroDossier: '',
    dateNaissance: '',
    dateMiseAdoption: '',
    description: '',

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

    photoUrl: '',
  });

  useEffect(() => {
    async function load() {
      const chat: any = await getChat(chatid!);
      if (!chat) {
        navigate('/');
        return;
      }

      setFormData({
        nom: chat.nom ?? '',
        race: chat.race ?? '',
        sexe: chat.sexe ?? '',
        poids: chat.poids?.toString() ?? '',
        numeroDossier: chat.numeroDossier?.toString() ?? '',
        dateNaissance: chat.dateNaissance?.split('T')[0] ?? '',
        dateMiseAdoption: chat.dateMiseAdoption ?? '',
        description: chat.description ?? '',

        tauxEnergie: chat.tauxEnergie ?? 1,
        sociabiliteHumain: chat.sociabiliteHumain ?? 1,
        compatEnfants: chat.compatEnfants ?? 1,
        compatChiens: chat.compatChiens ?? 1,
        compatChats: chat.compatChats ?? 1,

        micropuce: !!chat.micropuce,
        sterilise: !!chat.sterilise,
        degraffe: !!chat.degraffe,
        vermifuge: !!chat.vermifuge,
        vaccinsBase: !!chat.vaccinsBase,
        disponible: chat.disponible ?? true,

        coutTotal: chat.coutTotal?.toString() ?? '',
        coutSterilisation: chat.coutSterilisation?.toString() ?? '',
        coutVaccin: chat.coutVaccin?.toString() ?? '',
        coutVermifuge: chat.coutVermifuge?.toString() ?? '',
        coutMicropuce: chat.coutMicropuce?.toString() ?? '',

        photoUrl: chat.photos?.[0] ?? '',
      });

      setLoading(false);
    }

    load();
  }, [chatid, getChat, navigate]);

  /* ================= UPDATE ================= */

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    /* Date naissance < aujourd’hui */
    const today = new Date().toISOString().split('T')[0];
    if (formData.dateNaissance >= today) {
      setErrorMsg('La date de naissance doit être antérieure à aujourd’hui.');
      return;
    }

    /* Poids > 500 g (0.5 kg) */
    const poidsKg = nettoyerNombre(formData.poids);
    if (isNaN(poidsKg)) {
      setErrorMsg('Le poids doit être un nombre valide.');
      return;
    }
    if (poidsKg <= 0.5) {
      setErrorMsg('Le poids doit être supérieur à 500 g (0.5 kg).');
      return;
    }

    /* Couts STRICTEMENT > 0 */
    const couts: [string, string][] = [
      ['Coût total', formData.coutTotal],
      ['Coût stérilisation', formData.coutSterilisation],
      ['Coût vaccin', formData.coutVaccin],
      ['Coût vermifuge', formData.coutVermifuge],
      ['Coût micropuce', formData.coutMicropuce],
    ];

    for (const [label, value] of couts) {
      const n = nettoyerNombre(value);
      if (isNaN(n)) {
        setErrorMsg(`${label} doit être un nombre valide.`);
        return;
      }
      if (n <= 0) {
        setErrorMsg(`${label} doit être strictement supérieur à 0 $.`);
        return;
      }
    }

    const body = {
      ...formData,

      poids: poidsKg,
      numeroDossier: Number(formData.numeroDossier),

      coutTotal: nettoyerNombre(formData.coutTotal),
      coutSterilisation: nettoyerNombre(formData.coutSterilisation),
      coutVaccin: nettoyerNombre(formData.coutVaccin),
      coutVermifuge: nettoyerNombre(formData.coutVermifuge),
      coutMicropuce: nettoyerNombre(formData.coutMicropuce),

      micropuce: formData.micropuce,
      sterilise: formData.sterilise,
      degraffe: formData.degraffe,
      vermifuge: formData.vermifuge,
      vaccinsBase: formData.vaccinsBase,
      disponible: formData.disponible,

      photos: [formData.photoUrl],
    };

    const res = await fetch(`${API_BASE_URL}/chats/${chatid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setErrorMsg('Erreur lors de la sauvegarde.');
      return;
    }

    refreshChats();
    navigate('/');
  }

  if (loading) return <p className="text-center mt-10">Chargement…</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">Modifier un chat</h2>

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-3 mb-6 rounded text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nom"
          value={formData.nom}
          onChange={(v) => update('nom', v)}
        />
        <Input
          label="Race"
          value={formData.race}
          onChange={(v) => update('race', v)}
        />

        <Select
          label="Sexe"
          value={formData.sexe}
          options={['Femelle', 'Mâle']}
          onChange={(v) => update('sexe', v)}
        />

        <Input
          label="Poids (kg)"
          value={formData.poids}
          onChange={(v) => update('poids', v)}
        />

        <Input label="Numéro dossier" value={formData.numeroDossier} disabled />

        <Input
          type="date"
          label="Date naissance"
          value={formData.dateNaissance}
          onChange={(v) => update('dateNaissance', v)}
        />

        <Input
          type="date"
          label="Date adoption"
          value={formData.dateMiseAdoption}
          onChange={(v) => update('dateMiseAdoption', v)}
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(v) => update('description', v)}
        />

        <Input
          label="Photo URL"
          value={formData.photoUrl}
          onChange={(v) => update('photoUrl', v)}
        />

        <Input
          label="Coût total ($)"
          value={formData.coutTotal}
          onChange={(v) => update('coutTotal', v)}
        />
        <Input
          label="Coût stérilisation ($)"
          value={formData.coutSterilisation}
          onChange={(v) => update('coutSterilisation', v)}
        />
        <Input
          label="Coût vaccin ($)"
          value={formData.coutVaccin}
          onChange={(v) => update('coutVaccin', v)}
        />
        <Input
          label="Coût vermifuge ($)"
          value={formData.coutVermifuge}
          onChange={(v) => update('coutVermifuge', v)}
        />
        <Input
          label="Coût micropuce ($)"
          value={formData.coutMicropuce}
          onChange={(v) => update('coutMicropuce', v)}
        />

        <button className="w-full bg-blue-600 text-white p-4 rounded-lg text-lg font-semibold">
          Sauvegarder
        </button>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
}: {
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="font-semibold">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full border rounded-lg p-2 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="font-semibold">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full border rounded-lg p-2"
      />
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="font-semibold">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg p-2"
      >
        <option value="">Choisir</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
