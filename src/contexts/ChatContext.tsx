import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { AuthContext } from './AuthContext';

export interface IChat {
  _id: string;

  nom: string;
  race: string;
  sexe?: string;
  poids?: string;

  numeroDossier: number;
  dateNaissance: string;
  dateMiseAdoption?: string;

  description: string;

  tauxEnergie: number;
  sociabiliteHumain: number;
  compatEnfants: number;
  compatChiens: number;
  compatChats: number;

  micropuce: boolean;
  sterilise: boolean;
  degraffe?: boolean;
  vermifuge?: boolean;
  vaccinsBase: boolean;
  disponible?: boolean;

  coutTotal?: number;
  coutSterilisation?: number;
  coutVaccin?: number;
  coutVermifuge?: number;
  coutMicropuce?: number;

  photos: string[];
}

export type ChatContextType = {
  chats: IChat[];
  refreshChats: () => void;
  getChat: (id: string) => Promise<IChat | null>;
  updateChat: (id: string, data: any) => Promise<boolean>;
  deleteChat: (id: string) => Promise<boolean>;
};

export const ChatContext = createContext<ChatContextType>({
  chats: [],
  refreshChats: () => {},
  getChat: async () => null,
  updateChat: async () => false,
  deleteChat: async () => false,
});

export default function ChatProvider({ children }: any) {
  const [chats, setChats] = useState<IChat[]>([]);
  const { token } = useContext(AuthContext);

  // GET ALL CHATS
  async function refreshChats(filters?: {
    race?: string;
    tauxEnergie?: number;
  }) {
    try {
      const params = new URLSearchParams();

      if (filters?.race) params.append('race', filters.race);
      if (filters?.tauxEnergie)
        params.append('tauxEnergie', String(filters.tauxEnergie));

      const url =
        params.toString().length > 0
          ? `${API_BASE_URL}/chats/all?${params.toString()}`
          : `${API_BASE_URL}/chats/all`;

      const res = await axios.get(url);
      setChats(res.data.data ?? []);
    } catch (err) {
      console.error('Erreur refreshChats :', err);
    }
  }

  // GET ONE CHAT
  async function getChat(id: string) {
    try {
      const res = await axios.get(`${API_BASE_URL}/chats/${id}`);
      return res.data.chat ?? res.data.data ?? null;
    } catch {
      return null;
    }
  }

  // UPDATE CHAT (PUT)
  async function updateChat(id: string, data: any) {
    try {
      await axios.put(`${API_BASE_URL}/chats/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await refreshChats();
      return true;
    } catch (err) {
      console.error('Erreur updateChat :', err);
      return false;
    }
  }

  // DELETE CHAT
  async function deleteChat(id: string) {
    try {
      await axios.delete(`${API_BASE_URL}/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await refreshChats();
      return true;
    } catch (err) {
      console.error('Erreur deleteChat :', err);
      return false;
    }
  }

  useEffect(() => {
    refreshChats();
  }, []);

  return (
    <ChatContext.Provider
      value={{ chats, refreshChats, getChat, updateChat, deleteChat }}
    >
      {children}
    </ChatContext.Provider>
  );
}
