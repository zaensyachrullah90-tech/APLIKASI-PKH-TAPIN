import React from 'react';
import { Shield, Plus, Briefcase, MapPin, Users as UsersIcon, RefreshCw, Trash2 } from 'lucide-react';

export default function DatabaseSDM({ safeSdmData, isKorkab, setSdmForm, setShowSdmModal, dbDelete, isSaving, setIsSaving }) {
  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
        <Shield className="w-48 h-48 absolute -right-10 -top-10 opacity-10 text-yellow-500" />
        <h2 className="text-3xl font-black relative z-10 text-yellow-500">Database SDM</h2>
        <p className="text-blue-200 mt-2 text-lg relative z-10">Manajemen akses dan profil pendamping.</p>
        {isKorkab && (
           <button onClick={() => { setSdmForm({}); setShowSdmModal(true); }} className="mt-6 bg-yellow-500 text-blue-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-yellow-400 cursor-pointer relative z-10">
             <Plus className="w-5 h-5 inline mr-2" /> Tambah SDM Baru
           </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {safeSdmData.map(sdm => (
          <div key={sdm.id} className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-yellow-500 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-gray-800 text-lg">{String(sdm.nama || '')}</h3>
                  <p className="text-sm text-gray-500 font-mono">{String(sdm.nik || '')}</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase ${String(sdm.status) === 'Aktif' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {String(sdm.status || '')}
                </span>
              </div>
              <div className="space-y-2 mt-4 text-sm font-medium text-gray-600 bg-gray-50 p-4 rounded-xl border">
                 <p><Briefcase className="w-4 h-4 inline mr-2 text-blue-500"/> {String(sdm.role || '').replace('_', ' ').toUpperCase()}</p>
                 <p><MapPin className="w-4 h-4 inline mr-2 text-red-500"/> Kec. {String(sdm.kecamatan || '')}</p>
                 <p><UsersIcon className="w-4 h-4 inline mr-2 text-green-500"/> {Number(sdm.jmlKpm || 0)} KPM</p>
              </div>
            </div>
            {isKorkab && (
              <div className="mt-5 flex gap-2">
                 <button onClick={() => { setSdmForm(sdm); setShowSdmModal(true); }} className="flex-1 py-3 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs cursor-pointer border border-blue-100">Edit Profil</button>
                 <button onClick={() => { setIsSaving(true); setTimeout(() => { dbDelete('sdmData', sdm.id); setIsSaving(false); }, 800); }} className="p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-xl cursor-pointer border border-red-100" title="Hapus Akun">
                    {isSaving ? <RefreshCw className="w-5 h-5 animate-spin"/> : <Trash2 className="w-5 h-5" />}
                 </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
