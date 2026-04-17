import React from 'react';
import { Search, MapPin, ChevronLeft, Printer, UserSquare, CreditCard, Briefcase, Users as UsersIcon, GraduationCap, Stethoscope, Plus } from 'lucide-react';

export default function DataKPM({ kpmMainTab, setKpmMainTab, safeKpmData, selectedKPM, setSelectedKPM, kpmDetailTab, setKpmDetailTab, setShowPotensialModal, setShowGraduasiModal, showToast, getFilteredKPM }) {
  const myPotensial = getFilteredKPM(safeKpmData.filter(k => String(k.type) === 'potensial'));
  const myGraduasi = getFilteredKPM(safeKpmData.filter(k => String(k.type) === 'graduasi'));
  const myUtama = getFilteredKPM(safeKpmData.filter(k => String(k.type) !== 'potensial' && String(k.type) !== 'graduasi'));
  const inputClass = "w-full p-4 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800";

  // Mode Detail KPM
  if (selectedKPM) {
    return (
      <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
        <div className="flex gap-3">
          <button onClick={() => setSelectedKPM(null)} className="flex items-center text-blue-600 font-bold bg-white border px-6 py-4 rounded-2xl hover:bg-blue-50 shadow-sm cursor-pointer transition-all"><ChevronLeft className="w-5 h-5 mr-2" /> Kembali</button>
          <button onClick={() => showToast("Mendownload Profil PDF...")} className="flex-1 flex items-center justify-center text-white font-bold bg-blue-600 px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/30 cursor-pointer"><Printer className="w-5 h-5 mr-2" /> Cetak PDF KPM</button>
        </div>
        <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-center">
            <UserSquare className="w-32 h-32 p-6 bg-white rounded-[2rem] mx-auto mb-6 text-blue-600 shadow-xl" />
            <h2 className="text-4xl font-black text-white tracking-tight">{String(selectedKPM?.nama || '')}</h2>
            <p className="text-blue-100 mt-2 font-mono text-lg tracking-widest">{String(selectedKPM?.nik || '')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Mode Daftar KPM & Sub-Menu
  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="flex bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-gray-200 overflow-x-auto scrollbar-hide">
        <button onClick={() => setKpmMainTab('daftar')} className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${kpmMainTab === 'daftar' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>DATABASE KPM</button>
        <button onClick={() => setKpmMainTab('potensial')} className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${kpmMainTab === 'potensial' ? 'bg-teal-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>KPM POTENSIAL</button>
        <button onClick={() => setKpmMainTab('graduasi')} className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${kpmMainTab === 'graduasi' ? 'bg-orange-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>GRADUASI KPM</button>
      </div>

      {/* Konten KPM Utama */}
      {kpmMainTab === 'daftar' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-6 top-5 w-6 h-6 text-gray-400" />
            <input type="text" placeholder="Cari Nama / NIK KPM..." className={`${inputClass} pl-16 py-5 text-lg rounded-2xl shadow-sm`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myUtama.map(kpm => (
              <div key={kpm.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="mb-6">
                  <h3 className="font-black text-gray-800 text-2xl">{String(kpm.nama || '')}</h3>
                  <p className="text-sm text-gray-500 mt-2 font-mono bg-gray-50 p-2 rounded-lg inline-block border">{String(kpm.nik || '')}</p>
                </div>
                <button onClick={() => setSelectedKPM(kpm)} className="w-full text-blue-600 font-bold border-2 border-blue-100 px-6 py-4 rounded-2xl bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">Lihat Detail Profil</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
