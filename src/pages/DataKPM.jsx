import React from 'react';
import { Search, MapPin, ChevronLeft, Printer, UserSquare, CreditCard, Briefcase, Users as UsersIcon, GraduationCap, Stethoscope, Plus } from 'lucide-react';

export default function DataKPM({ kpmMainTab, setKpmMainTab, safeKpmData, selectedKPM, setSelectedKPM, kpmDetailTab, setKpmDetailTab, setShowPotensialModal, setShowGraduasiModal, showToast, getFilteredKPM }) {
  const myPotensial = getFilteredKPM(safeKpmData.filter(k => String(k.type) === 'potensial'));
  const myGraduasi = getFilteredKPM(safeKpmData.filter(k => String(k.type) === 'graduasi'));
  const myUtama = getFilteredKPM(safeKpmData.filter(k => String(k.type) !== 'potensial' && String(k.type) !== 'graduasi'));
  const inputClass = "w-full p-4 border border-gray-200 rounded-2xl text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800 font-medium";

  // VIEW: DETAIL PROFIL KPM
  if (selectedKPM) {
    return (
      <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
        <div className="flex gap-4">
          <button onClick={() => setSelectedKPM(null)} className="flex items-center justify-center text-blue-600 font-bold bg-white border px-6 py-4 rounded-2xl hover:bg-blue-50 shadow-sm cursor-pointer transition-all"><ChevronLeft className="w-5 h-5 mr-2" /> Kembali</button>
          <button onClick={() => showToast("Mendownload Profil PDF...")} className="flex-1 flex items-center justify-center text-white font-bold bg-blue-600 px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/30 cursor-pointer"><Printer className="w-5 h-5 mr-2" /> Cetak PDF Profil</button>
        </div>
        <div className="flex bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-gray-100">
          <button onClick={() => setKpmDetailTab('profil')} className={`flex-1 py-3 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${kpmDetailTab === 'profil' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>PROFIL UTAMA</button>
          <button onClick={() => setKpmDetailTab('komponen')} className={`flex-1 py-3 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${kpmDetailTab === 'komponen' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>KOMPONEN PKH</button>
        </div>
        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <UserSquare className="w-32 h-32 p-6 bg-white rounded-[2rem] mx-auto mb-6 text-blue-600 shadow-2xl transform rotate-3" />
            <h2 className="text-4xl font-black text-white tracking-tight relative z-10">{String(selectedKPM?.nama || '')}</h2>
            <p className="text-blue-100 mt-2 font-mono text-lg tracking-widest relative z-10">{String(selectedKPM?.nik || '')}</p>
            <div className="flex gap-3 justify-center mt-6 relative z-10"><span className="px-5 py-2 bg-white/20 backdrop-blur text-white text-xs font-black uppercase tracking-widest rounded-full border border-white/30 shadow-sm">{String(selectedKPM?.bantuan || selectedKPM?.status || 'Potensial')}</span></div>
          </div>
          <div className="p-8 lg:p-10">
            {kpmDetailTab === 'profil' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex items-start bg-gray-50 p-6 rounded-3xl border border-gray-100"><CreditCard className="w-7 h-7 text-blue-400 mr-4" /><div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No. KKS</p><p className="text-lg font-black text-gray-800 mt-1">{String(selectedKPM?.noKKS || '-')}</p></div></div>
                  <div className="flex items-start bg-gray-50 p-6 rounded-3xl border border-gray-100 md:col-span-2"><MapPin className="w-7 h-7 text-red-400 mr-4" /><div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Alamat Lengkap</p><p className="text-lg font-bold text-gray-800 mt-1">Desa {String(selectedKPM?.desa || '')}, Kec. {String(selectedKPM?.kecamatan || '')}</p></div></div>
                  <div className="flex items-start bg-orange-50 p-6 rounded-3xl border border-orange-100 md:col-span-3"><Briefcase className="w-7 h-7 text-orange-500 mr-4" /><div><p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Usaha / Potensi</p><p className="text-lg font-black text-orange-900 mt-1">{String(selectedKPM?.usaha || selectedKPM?.potensi || '-')}</p></div></div>
                </div>
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <h3 className="font-black text-gray-800 mb-6 flex items-center text-xl"><UsersIcon className="w-7 h-7 mr-3 text-blue-600"/> Anggota Keluarga (ART)</h3>
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {Array.isArray(selectedKPM?.keluarga) && selectedKPM.keluarga.length > 0 ? selectedKPM.keluarga.map((k, i) => (
                      <div key={i} className="p-6 border-b border-gray-50 flex justify-between items-center hover:bg-blue-50/50 transition-colors"><p className="text-base font-bold text-gray-800">{String(k.nama || '')}</p><span className="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-xl font-black">{String(k.umur || '0')} Thn</span></div>
                    )) : (<div className="p-10 text-center text-sm text-gray-400 font-medium">Tidak ada data anggota keluarga.</div>)}
                  </div>
                </div>
              </div>
            )}
            {kpmDetailTab === 'komponen' && (
              <div className="space-y-10 animate-in fade-in">
                <div>
                  <h4 className="font-black text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center text-xl"><GraduationCap className="w-7 h-7 mr-3 text-blue-600"/> Komponen Pendidikan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Array.isArray(selectedKPM?.komponen?.pendidikan) && selectedKPM.komponen.pendidikan.length > 0 ? selectedKPM.komponen.pendidikan.map((k, i) => (
                      <div key={i} className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex flex-col justify-center"><p className="font-black text-blue-900 text-lg mb-2">{String(k.nama || '')}</p><p className="text-sm font-medium text-blue-700">Sekolah: {String(k.sekolah || '')}</p></div>
                    )) : <p className="text-sm text-gray-400 font-medium p-4 bg-gray-50 rounded-2xl border border-dashed">Tidak ada komponen pendidikan.</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-black text-gray-800 border-b border-gray-100 pb-4 mb-6 flex items-center text-xl"><Stethoscope className="w-7 h-7 mr-3 text-emerald-600"/> Komponen Kesehatan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Array.isArray(selectedKPM?.komponen?.kesehatan) && selectedKPM.komponen.kesehatan.length > 0 ? selectedKPM.komponen.kesehatan.map((k, i) => (
                      <div key={i} className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex flex-col justify-center"><p className="font-black text-emerald-900 text-lg mb-2">{String(k.nama || '')}</p><p className="text-sm font-medium text-emerald-700">Faskes: {String(k.tempatPeriksa || '')}</p></div>
                    )) : <p className="text-sm text-gray-400 font-medium p-4 bg-gray-50 rounded-2xl border border-dashed">Tidak ada komponen kesehatan.</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // VIEW: DAFTAR KPM UTAMA
  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-gray-200 overflow-x-auto scrollbar-hide sticky top-20 z-20">
        <button onClick={() => setKpmMainTab('daftar')} className={`flex-1 min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${kpmMainTab === 'daftar' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>DATABASE KPM</button>
        <button onClick={() => setKpmMainTab('potensial')} className={`flex-1 min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${kpmMainTab === 'potensial' ? 'bg-teal-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>KPM POTENSIAL</button>
        <button onClick={() => setKpmMainTab('graduasi')} className={`flex-1 min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${kpmMainTab === 'graduasi' ? 'bg-orange-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>GRADUASI KPM</button>
      </div>

      {kpmMainTab === 'potensial' && (
        <div className="space-y-6">
          <button onClick={() => setShowPotensialModal(true)} className="w-full py-5 bg-teal-500 hover:bg-teal-600 text-white rounded-3xl font-black shadow-lg flex items-center justify-center text-lg cursor-pointer transition-all"><Plus className="w-6 h-6 mr-3" /> Tambah KPM Potensial</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myPotensial.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-t-teal-500 flex flex-col justify-between hover:shadow-xl transition-all">
                <div className="mb-6"><h4 className="font-black text-gray-800 text-xl">{String(p.nama || '')}</h4><p className="text-sm font-medium text-gray-500 mt-2 flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-teal-500"/> Desa {String(p.desa || '')}</p><div className="mt-5"><span className="text-xs font-black px-4 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 uppercase tracking-widest block w-fit">Potensi: {String(p.potensi || '')}</span></div></div>
                <button onClick={() => setSelectedKPM(p)} className="w-full mt-4 text-teal-600 text-sm font-black border-2 border-teal-100 px-4 py-4 rounded-2xl bg-white hover:bg-teal-50 cursor-pointer transition-colors">Detail Profil KPM</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {kpmMainTab === 'graduasi' && (
        <div className="space-y-6">
          <button onClick={() => setShowGraduasiModal(true)} className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-3xl font-black shadow-lg flex items-center justify-center text-lg cursor-pointer transition-all"><Plus className="w-6 h-6 mr-3" /> Tambah Data Graduasi</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myGraduasi.map(g => (
              <div key={g.id} className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-t-orange-400 flex flex-col justify-between hover:shadow-xl transition-all">
                <div className="mb-6"><h4 className="font-black text-gray-800 text-xl">{String(g.nama || '')}</h4><p className="text-sm font-medium text-gray-500 mt-2 flex items-center"><MapPin className="w-4 h-4 mr-1.5 text-orange-400"/> Desa {String(g.desa || '')}</p><div className="mt-5"><span className={`text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-widest block w-fit ${String(g.status) === 'Sudah Graduasi' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{String(g.status || '')}</span></div></div>
                <button onClick={() => setSelectedKPM(g)} className="w-full mt-4 text-orange-600 text-sm font-black border-2 border-orange-100 px-4 py-4 rounded-2xl bg-white hover:bg-orange-50 cursor-pointer transition-colors">Detail Profil KPM</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {kpmMainTab === 'daftar' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-6 top-5 w-6 h-6 text-gray-400" />
            <input type="text" placeholder="Cari Nama / NIK KPM..." className={`${inputClass} pl-16 py-5 text-lg rounded-2xl shadow-sm`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myUtama.map(kpm => (
              <div key={kpm.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="mb-6"><h3 className="font-black text-gray-800 text-2xl">{String(kpm.nama || '')}</h3><p className="text-sm text-gray-500 mt-3 font-mono bg-gray-50 px-3 py-1.5 rounded-lg border inline-block tracking-widest">{String(kpm.nik || '')}</p></div>
                <button onClick={() => setSelectedKPM(kpm)} className="w-full text-blue-600 font-black border-2 border-blue-100 px-6 py-4 rounded-2xl bg-blue-50 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">Lihat Profil Lengkap</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}