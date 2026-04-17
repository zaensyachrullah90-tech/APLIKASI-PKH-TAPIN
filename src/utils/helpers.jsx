import React, { useState, useEffect } from 'react';
import { Database, Search, CreditCard, MessageSquare, Globe } from 'lucide-react';

export const getBasePath = (appId, collName) => {
  const safeAppId = String(appId).replace(/[.#$\[\]]/g, '_');
  return `artifacts/${safeAppId}/public/data/${collName}`;
};

export const getCurrentDate = () => new Date().toISOString().split('T')[0];

export const getCurrentTime = () => { 
  const d = new Date(); 
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`; 
};

export const getAppIcon = (nama) => {
  const n = String(nama || '').toLowerCase();
  if (n.includes('siks') || n.includes('data')) return <Database className="w-8 h-8 text-blue-600 mb-2" />;
  if (n.includes('cek') || n.includes('search')) return <Search className="w-8 h-8 text-emerald-600 mb-2" />;
  if (n.includes('pkh') || n.includes('bayar') || n.includes('kks')) return <CreditCard className="w-8 h-8 text-orange-600 mb-2" />;
  if (n.includes('lapor') || n.includes('pengaduan')) return <MessageSquare className="w-8 h-8 text-red-600 mb-2" />;
  return <Globe className="w-8 h-8 text-indigo-600 mb-2" />;
};

export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  });
  useEffect(() => { localStorage.setItem(key, state); }, [key, state]);
  return [state, setState];
}
