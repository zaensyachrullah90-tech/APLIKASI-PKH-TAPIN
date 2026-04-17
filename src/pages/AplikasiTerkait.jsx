```react
import React from 'react';
import { Globe, Plus, Search, CreditCard, MessageSquare, Database } from 'lucide-react';

export default function AplikasiTerkait({ aplikasiEksternal, isKorkab, setShowAddAppModal }) {
  const getAppIcon = (nama) => {
    const n = String(nama || '').toLowerCase();
    if (n.includes('siks') || n.includes('data')) return <Database className="w-8 h-8 text-blue-600 mb-2" />;
    if (n.includes('cek') || n.includes('search')) return <Search className="w-8 h-8 text-emerald-600 mb-2" />;
    if (n.includes('pkh') || n.includes('bayar')) return <CreditCard className="w-8 h-8 text-orange-600 mb-2" />;
    if (n.includes('lapor') || n.includes('pengaduan')) return <MessageSquare className="w-8 h-8 text-red-600 mb-2" />;
    return <Globe className="w-8 h-8 text-indigo-600 mb-2" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-800 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <Globe className="w-64 h-64 absolute -right-10 -bottom-10 opacity-20" />
        <h2 className="text-4xl font-black relative z-10 tracking-tight">Portal Aplikasi Terkait</h2>
        <p className="text-lg text-indigo-200 mt-2 relative z-10 font-medium">Akses cepat ke berbagai sistem kementerian & daerah.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {aplikasiEksternal.map(app => (
          <a key={app.id} href={app.url} target="_blank" rel="noreferrer" className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all flex flex-col items-center text-center group h-full">
            <div className="w-20 h-20 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">{getAppIcon(app.nama)}</div>
            <h4 className="font-black text-gray-800 text-base leading-relaxed break-words">{String(app.nama || '')}</h4>
          </a>
        ))}
        {isKorkab && (
          <button onClick={() => setShowAddAppModal(true)} className="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-[2rem] p-6 flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-100 hover:border-indigo-400 transition-all min-h-[220px] cursor-pointer relative z-20">
            <Plus className="w-10 h-10 mb-4" />
            <span className="text-xs font-black uppercase tracking-widest">Tambah Link Web</span>
          </button>
        )}
      </div>
    </div>
  );
}

```
