import React from 'react';
import { BookOpen, Plus, Trash2 } from 'lucide-react';

export default function CatatanHarian({ safeCatatanData, currentUserData, setShowCatatanModal, dbDelete }) {
  const displayCatatan = safeCatatanData.filter(c => String(c.nama) === String(currentUserData?.nama));

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <BookOpen className="w-48 h-48 absolute right-0 top-0 opacity-10" />
        <h2 className="text-2xl font-black relative z-10">Buku Catatan Harian</h2>
        <p className="text-sm text-blue-100 mt-2 font-medium relative z-10">Terkunci & 100% Privat untuk akun Database Anda.</p>
      </div>
      <button onClick={() => setShowCatatanModal(true)} className="w-full py-4 bg-white border-2 border-dashed text-blue-600 rounded-2xl font-bold text-lg cursor-pointer">
        <Plus className="w-6 h-6 inline" /> Tambah Catatan Baru
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayCatatan.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border">
                  {String(c.tanggal || '')} • {String(c.jam || '')} WIB
                </span>
                <button onClick={() => dbDelete('catatanData', c.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
              <p className="text-sm font-bold text-gray-800">{String(c.kecamatan || '')} - {String(c.desa || '')}</p>
              <p className="text-sm text-gray-700 mt-3 bg-gray-50 p-4 rounded-xl border">{String(c.tentang || '')}</p>
            </div>
          </div>
        ))}
        {displayCatatan.length === 0 && <p className="text-center text-gray-500 py-8 italic md:col-span-2">Belum ada catatan.</p>}
      </div>
    </div>
  );
}
