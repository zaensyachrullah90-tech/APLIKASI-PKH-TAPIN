import React from 'react';
import { Search, MapPin, ChevronLeft, Printer, UserSquare, CreditCard, Briefcase, Users as UsersIcon, GraduationCap, Stethoscope, Plus } from 'lucide-react';

export default function DataKPM({ safeKpmData, currentUserData, kpmMainTab, setKpmMainTab, selectedKPM, setSelectedKPM, kpmDetailTab, setKpmDetailTab, setShowPotensialModal, setShowGraduasiModal, showToast, getFilteredKPM }) {
  
  if (selectedKPM) {
    return (
      <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
        <div className="flex gap-3">
          <button onClick={() => setSelectedKPM(null)} className="flex items-center justify-center text-blue-600 font-bold bg-white border px-5 py-3.5 rounded-xl hover:bg-blue-50 shadow-sm cursor-pointer"><ChevronLeft className="w-5 h-5 mr-2" /> Kembali</button>
          <button onClick={() => showToast("Mendownload Profil PDF...")} className="flex-1 flex items-center justify-center text-white font-bold bg-blue-600 px-5 py-3.5 rounded-xl shadow-lg cursor-pointer"><Printer className="w-5 h-5 mr-2" /> Cetak PDF</button>
        </div>
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border">
          <button onClick={() => setKpmDetailTab('profil')} className={`flex-1 py-3 text-sm font-bold rounded-xl cursor-pointer ${kpmDetailTab === 'profil' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>Profil</button>
          <button onClick={() => setKpmDetailTab('komponen')} className={`flex-1 py-3 text-sm font-bold rounded-xl cursor-pointer ${kpmDetailTab === 'komponen' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>Komponen</button>
        </div>
        <div className="bg-white rounded-3xl shadow-md border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center">
            <UserSquare className="w-28 h-28 p-6 bg-white rounded-full mx-auto mb-5 text-gray-300 shadow-xl" />
            <h2 className="text-3xl font-black text-white">{String(selectedKPM?.nama || '')}</h2>
            <p className="text-blue-100 mt-2 font-medium">NIK: {String(selectedKPM?.nik || '')}</p>
            <div className="flex gap-3 justify-center mt-5"><span className="px-4 py-1.5 bg-white/20 text-white text-xs font-bold uppercase rounded-full border">{String(selectedKPM?.bantuan || selectedKPM?.status || 'Potensial')}</span></div>
          </div>
          <div className="p-8">
            {kpmDetailTab === 'profil' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start bg-gray-50 p-5 rounded-2xl border"><CreditCard className="w-6 h-6 text-gray-400 mr-4" /><div><p className="text-[10px] font-bold text-gray-500 uppercase">KKS</p><p className="text-base font-bold text-gray-800 mt-1">{String(selectedKPM?.noKKS || '-')}</p></div></div>
                  <div className="flex items-start bg-gray-50 p-5 rounded-2xl border md:col-span-2"><MapPin className="w-6 h-6 text-gray-400 mr-4" /><div><p className="text-[10px] font-bold text-gray-500 uppercase">Alamat</p><p className="text-base font-medium text-gray-800 mt-1">Desa {String(selectedKPM?.desa || '')}, Kec. {String(selectedKPM?.kecamatan || '')}</p></div></div>
                  <div className="flex items-start bg-orange-50 p-5 rounded-2xl border border-orange-100 md:col-span-3"><Briefcase className="w-6 h-6 text-orange-400 mr-4" /><div><p className="text-[10px] font-bold text-orange-600 uppercase">Usaha/Potensi</p><p className="text-base font-bold text-orange-900 mt-1">{String(selectedKPM?.usaha || selectedKPM?.potensi || '-')}</p></div></div>
                </div>
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-black text-gray-800 mb-5 flex items-center text-lg"><UsersIcon className="w-6 h-6 mr-3 text-blue-600"/> Anggota Keluarga</h3>
                  <div className="bg-white rounded-2xl border shadow-sm">
                    {Array.isArray(selectedKPM?.keluarga) && selectedKPM.keluarga.length > 0 ? selectedKPM.keluarga.map((k, i) => (
                      <div key={i} className="p-5 border-b flex justify-between items-center"><p className="text-base font-bold text-gray-800">{String(k.nama || '')}</p><span className="text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold">{String(k.umur || '0')} Thn</span></div>
                    )) : (<div className="p-8 text-center text-sm text-gray-400 italic">Tidak ada data.</div>)}
                  </div>
                </div>
              </div>
            )}
            {kpmDetailTab === 'komponen' && (
              <div className="space-y-8">
                <div>
                  <h4 className="font-black text-gray-800 border-b pb-4 mb-4 flex items-center text-lg"><GraduationCap className="w-6 h-6 mr-3 text-blue-600"/> Pendidikan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(selectedKPM?.komponen?.pendidikan) && selectedKPM.komponen.pendidikan.length > 0 ? selectedKPM.komponen.pendidikan.map((k, i) => (
                      <div key={i} className="bg-blue-50 border p-5 rounded-2xl flex flex-col justify-center"><p className="font-black text-blue-900 text-base mb-1.5">{String(k.nama || '')}</p><p className="text-sm text-blue-700">Sekolah: {String(k.sekolah || '')}</p></div>
                    )) : <p className="text-sm text-gray-400 italic p-2">Kosong.</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-gray-800 border-b pb-4 mb-4 flex items-center text-lg"><Stethoscope className="w-6 h-6 mr-3 text-green-600"/> Kesehatan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.isArray(selectedKPM?.komponen?.kesehatan) && selectedKPM.komponen.kesehatan.length > 0 ? selectedKPM.komponen.kesehatan.map((k, i) => (
                      <div key={i} className="bg-green-50 border p-5 rounded-2xl flex flex-col justify-center"><p className="font-black text-green-900 text-base mb-1.5">{String(k.nama || '')}</p><p className="text-sm text-green-700">Faskes: {String(k.tempatPeriksa || '')}</p></div>
                    )) : <p className="text-sm text-gray-400 italic p-2">Kosong.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const myPotensial = getFilteredKPM(safeKpmData.filter(k => String(k.type) === 'potensial'));
  const myGraduasi = getFilteredKPM(safeKpmData.filter(k => String(k.type) === 'graduasi'));
  const myUtama = getFilteredKPM(safeKpmData.filter(k => String(k.type) !== 'potensial' && String(k.type) !== 'graduasi'));
  const inputClass = "w-full p-4 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800";

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="flex bg-white rounded-2xl p-2 shadow-sm border mb-6 overflow-x-auto scrollbar-hide">
        <button onClick={() => setKpmMainTab('daftar')} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${kpmMainTab === 'daftar' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>Daftar KPM</button>
        <button onClick={() => setKpmMainTab('potensial')} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${kpmMainTab === 'potensial' ? 'bg-teal-100 text-teal-700' : 'text-gray-500'}`}>KPM Potensial</button>
        <button onClick={() => setKpmMainTab('graduasi')} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${kpmMainTab === 'graduasi' ? 'bg-orange-100 text-orange-700' : 'text-gray-500'}`}>Graduasi KPM</button>
      </div>

      {kpmMainTab === 'potensial' && (
        <div className="space-y-5">
          <button onClick={() => setShowPotensialModal(true)} className="w-full py-4 bg-teal-500 text-white rounded-3xl font-bold flex items-center justify-center text-lg cursor-pointer"><Plus className="w-6 h-6 mr-2" /> Tambah KPM Potensial</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPotensial.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-teal-500 flex flex-col justify-between">
                <div className="mb-4"><h4 className="font-black text-gray-800 text-lg">{String(p.nama || '')}</h4><p className="text-sm text-gray-500 mt-2 flex items-center"><MapPin className="w-4 h-4 mr-1.5"/> Desa {String(p.desa || '')}</p><div className="mt-4"><span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border uppercase">Potensi: {String(p.potensi || '')}</span></div></div>
                <button onClick={() => setSelectedKPM(p)} className="w-full mt-4 text-teal-600 text-sm font-bold border-2 border-teal-100 px-4 py-3 rounded-xl bg-white hover:bg-teal-50 cursor-pointer">Detail Profil</button>
              </div>
            ))}
          </div>
          {myPotensial.length === 0 && <p className="text-center text-gray-500 py-10 italic">Kosong.</p>}
        </div>
      )}

      {kpmMainTab === 'graduasi' && (
        <div className="space-y-5">
          <button onClick={() => setShowGraduasiModal(true)} className="w-full py-4 bg-orange-500 text-white rounded-3xl font-bold flex items-center justify-center text-lg cursor-pointer"><Plus className="w-6 h-6 mr-2" /> Tambah Data Graduasi</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGraduasi.map(g => (
              <div key={g.id} className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-orange-400 flex flex-col justify-between">
                <div className="mb-4"><h4 className="font-black text-gray-800 text-lg">{String(g.nama || '')}</h4><p className="text-sm text-gray-500 mt-2 flex items-center"><MapPin className="w-4 h-4 mr-1.5"/> Desa {String(g.desa || '')}</p><div className="mt-4"><span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase ${String(g.status) === 'Sudah Graduasi' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{String(g.status || '')}</span></div></div>
                <button onClick={() => setSelectedKPM(g)} className="w-full mt-4 text-orange-600 text-sm font-bold border-2 border-orange-100 px-4 py-3 rounded-xl bg-white hover:bg-orange-50 cursor-pointer">Detail Profil</button>
              </div>
            ))}
          </div>
          {myGraduasi.length === 0 && <p className="text-center text-gray-500 py-10 italic">Kosong.</p>}
        </div>
      )}

      {kpmMainTab === 'daftar' && (
        <div className="space-y-5">
          <div className="relative">
            <Search className="absolute left-5 top-4 w-6 h-6 text-gray-400" />
            <input type="text" placeholder="Cari Nama / NIK KPM..." className={`${inputClass} pl-14`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myUtama.map(kpm => (
              <div key={kpm.id} className="bg-white p-6 rounded-3xl shadow-sm border flex flex-col justify-between">
                <div className="mb-4"><h3 className="font-black text-gray-800 text-lg">{String(kpm.nama || '')}</h3><p className="text-sm text-gray-500 mt-1 font-mono">{String(kpm.nik || '')}</p></div>
                <button onClick={() => setSelectedKPM(kpm)} className="w-full mt-4 text-blue-600 text-sm font-bold border px-4 py-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white cursor-pointer">Lihat Detail</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
