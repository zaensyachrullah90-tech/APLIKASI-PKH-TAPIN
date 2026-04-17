import React from 'react';
import { Shield, Sliders, Clock, Save } from 'lucide-react';

export default function Pengaturan({ settingTab, setSettingTab, currentUserData, isKorkab, aturanPiket, setAturanPiket, showToast }) {
  const inputClass = "w-full p-4 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800";

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      <div className="flex bg-white rounded-lg p-1.5 shadow-sm border overflow-x-auto">
        <button onClick={() => setSettingTab('profil')} className={`flex-1 py-3 text-sm font-bold rounded-lg cursor-pointer ${settingTab === 'profil' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>Profil Akun</button>
        <button onClick={() => setSettingTab('keamanan')} className={`flex-1 py-3 text-sm font-bold rounded-lg cursor-pointer ${settingTab === 'keamanan' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}>Keamanan</button>
        {isKorkab && <button onClick={() => setSettingTab('sistem')} className={`flex-1 py-3 text-sm font-bold rounded-lg cursor-pointer ${settingTab === 'sistem' ? 'bg-red-100 text-red-700' : 'text-gray-500'}`}>Sistem (Admin)</button>}
      </div>

      {settingTab === 'profil' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Nama Lengkap Server</label>
              <input type="text" defaultValue={String(currentUserData?.nama || '')} className={`${inputClass}`}/>
            </div>
          </div>
          <button onClick={() => showToast("Profil diperbarui!")} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold cursor-pointer">
            <Save className="w-6 h-6 inline mr-2"/> Simpan Perubahan
          </button>
        </div>
      )}

      {settingTab === 'keamanan' && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-6">
          <h3 className="font-black text-gray-800 text-xl flex items-center border-b pb-5">
            <Shield className="w-7 h-7 mr-3 text-purple-600"/> Ganti Kata Sandi
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Password Baru</label>
              <input type="password" placeholder="Minimal 8 karakter unik" className={`${inputClass}`}/>
            </div>
          </div>
          <button onClick={() => showToast("Password Cloud Authentication berhasil diubah!")} className="w-full py-4 bg-purple-100 text-purple-700 rounded-xl font-bold cursor-pointer">
            Update Password
          </button>
        </div>
      )}

      {settingTab === 'sistem' && isKorkab && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-3xl shadow-lg text-white">
            <h3 className="font-black text-2xl"><Sliders className="w-8 h-8 inline mr-3 text-red-400"/> Control Panel Master</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <h4 className="font-black text-gray-800 text-lg mb-5"><Clock className="w-6 h-6 inline mr-2"/> Aturan Piket & Denda</h4>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <input type="time" value={aturanPiket.jamMulai} onChange={(e) => setAturanPiket({...aturanPiket, jamMulai: e.target.value})} className={`${inputClass}`}/>
              <input type="time" value={aturanPiket.jamSelesai} onChange={(e) => setAturanPiket({...aturanPiket, jamSelesai: e.target.value})} className={`${inputClass}`}/>
            </div>
            <button onClick={() => showToast("Aturan Global Disimpan!")} className="w-full py-4 bg-gray-100 text-blue-700 rounded-xl font-black uppercase cursor-pointer">
              Simpan Aturan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
