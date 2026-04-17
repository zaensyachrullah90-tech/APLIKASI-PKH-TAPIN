import React from 'react';
import { Database, Users as UsersIcon, Users, ClipboardCheck, MessageSquare, CalendarDays, UploadCloud, AlertTriangle, Trash2 } from 'lucide-react';
import MasterDataManagement from '../components/MasterData'; // Memanggil file komponen Master Data yang di awal

export default function ManajemenData({ setUploadType, setUploadState, setShowUploadModal, handleResetDB, isKorkab, db, appId }) {
  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800 to-black rounded-[2rem] p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
        <Database className="w-64 h-64 absolute -right-10 -top-10 opacity-10" />
        <h2 className="text-3xl lg:text-4xl font-black relative z-10 tracking-tight">Manajemen Database Master</h2>
        <p className="text-gray-300 font-medium relative z-10 mt-2 text-lg">Pusat sinkronisasi dan import data massal via Excel/CSV.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-4">
              <UsersIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-xl text-gray-800">Database SDM</h3>
              <p className="text-sm text-gray-500">Import akun & profil pendamping.</p>
            </div>
          </div>
          <button onClick={() => { setUploadType('sdm'); setUploadState('idle'); setShowUploadModal(true); }} className="w-full py-4 mt-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center cursor-pointer">
            <UploadCloud className="w-5 h-5 mr-2" /> Upload Data SDM
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mr-4">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-xl text-gray-800">Database KPM</h3>
              <p className="text-sm text-gray-500">Import KPM Utama, Potensial, Graduasi.</p>
            </div>
          </div>
          <button onClick={() => { setUploadType('kpm'); setUploadState('idle'); setShowUploadModal(true); }} className="w-full py-4 mt-4 bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:bg-teal-600 transition-all flex items-center justify-center cursor-pointer">
            <UploadCloud className="w-5 h-5 mr-2" /> Upload Data KPM
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mr-4">
              <ClipboardCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-xl text-gray-800">Database Tugas</h3>
              <p className="text-sm text-gray-500">Import tugas direktif & deadline.</p>
            </div>
          </div>
          <button onClick={() => { setUploadType('tugas'); setUploadState('idle'); setShowUploadModal(true); }} className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center justify-center cursor-pointer">
            <UploadCloud className="w-5 h-5 mr-2" /> Upload Data Tugas
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mr-4">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-xl text-gray-800">Database Pengaduan</h3>
              <p className="text-sm text-gray-500">Import tiket pengaduan masuk.</p>
            </div>
          </div>
          <button onClick={() => { setUploadType('pengaduan'); setUploadState('idle'); setShowUploadModal(true); }} className="w-full py-4 mt-4 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 hover:bg-red-700 transition-all flex items-center justify-center cursor-pointer">
            <UploadCloud className="w-5 h-5 mr-2" /> Upload Pengaduan
          </button>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow md:col-span-2">
          <div className="flex items-center mb-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mr-4">
              <CalendarDays className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-black text-xl text-gray-800">Database Agenda</h3>
              <p className="text-sm text-gray-500">Import jadwal kegiatan, supervisi katim, dan giat khusus.</p>
            </div>
          </div>
          <button onClick={() => { setUploadType('agenda'); setUploadState('idle'); setShowUploadModal(true); }} className="w-full py-4 mt-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition-all flex items-center justify-center cursor-pointer">
            <UploadCloud className="w-5 h-5 mr-2" /> Upload Data Agenda
          </button>
        </div>
      </div>

      {/* --- KOMPONEN CRUD DINAMIS (BISA EDIT KOLOM BEBAS) --- */}
      <MasterDataManagement db={db} appId={appId} isKorkab={isKorkab} />

      {/* --- DANGER ZONE : RESET DATABASE KESELURUHAN --- */}
      {isKorkab && (
        <div className="mt-12 bg-red-50 rounded-3xl shadow-xl w-full border border-red-200 overflow-hidden relative">
           <div className="p-8 border-b border-red-200">
              <h2 className="text-2xl font-black text-red-700 flex items-center"><AlertTriangle className="w-6 h-6 mr-3"/> Zona Berbahaya (Reset Database)</h2>
              <p className="text-red-600 mt-2 text-sm font-medium">Tindakan menghapus database di bawah ini bersifat permanen dan tidak dapat dibatalkan. Sistem akan mereset ke tabel kosong.</p>
           </div>
           <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <button onClick={() => handleResetDB('kpmData')} className="py-3 px-4 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer text-sm">Kosongkan KPM</button>
              <button onClick={() => handleResetDB('sdmData')} className="py-3 px-4 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer text-sm">Kosongkan SDM</button>
              <button onClick={() => handleResetDB('tugasData')} className="py-3 px-4 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer text-sm">Kosongkan Tugas</button>
              <button onClick={() => handleResetDB('agendaData')} className="py-3 px-4 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-colors cursor-pointer text-sm">Kosongkan Agenda</button>
              
              <button onClick={() => handleResetDB('ALL')} className="col-span-2 md:col-span-4 mt-4 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-lg shadow-red-500/30 flex items-center justify-center cursor-pointer text-base uppercase">
                 <Trash2 className="w-5 h-5 mr-3"/> Factory Reset (Hapus Seluruh Sistem)
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
