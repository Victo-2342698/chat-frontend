import { useState } from 'react';

export default function ChatFilters({
  onFilter,
}: {
  onFilter: (filters: { race?: string; tauxEnergie?: number }) => void;
}) {
  const [race, setRace] = useState('');
  const [tauxEnergie, setTauxEnergie] = useState('');

  return (
    <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-4">
      <input
        className="border p-2 rounded"
        placeholder="Race"
        value={race}
        onChange={(e) => setRace(e.target.value)}
      />

      <input
        type="number"
        min={1}
        max={5}
        className="border p-2 rounded"
        placeholder="Énergie (1-5)"
        value={tauxEnergie}
        onChange={(e) => setTauxEnergie(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() =>
          onFilter({
            race: race || undefined,
            tauxEnergie: tauxEnergie ? Number(tauxEnergie) : undefined,
          })
        }
      >
        Filtrer
      </button>
    </div>
  );
}
