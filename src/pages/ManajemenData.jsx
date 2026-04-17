```react
import React, { useState, useEffect } from 'react';
import { Database, Users as UsersIcon, Users, ClipboardCheck, MessageSquare, CalendarDays, UploadCloud, AlertTriangle, Trash2, FileSpreadsheet, Search, Plus, Columns, RefreshCw, Edit } from 'lucide-react';
import { ref, onValue, set, push, remove, update as dbUpdateRealtime, child } from 'firebase/database';

const MasterDataManagement = ({ db, isKorkab, appId }) => {
  const [activeTab, setActiveTab] = useState('kpm');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getBasePath = (collName) => {
    const safeAppId = String(appId).replace(/[.#$\[\]]/g, '_');
    return "artifacts/" + safeAppId + "/public/data/" + collName;
  };

  const tabs = [
    { id: 'kpm', label: 'Database KPM Utama', node: 'kpmData' },
    { id: 'sdm', label: 'Database SDM (Pegawai)', node: 'sdmData' },
    { id: 'tugas', label: 'Database Tugas', node: 'tugasData' },
    { id: 'agenda', label: 'Database Agenda', node: 'agendaData' }
  ];
  const activeNode = tabs.find(t => t.id === activeTab).node;

  useEffect(() => {
    setLoading(true);
    const dataRef = ref(db, getBasePath(activeNode));
    const unsubscribe = onValue(dataRef, (snapshot) => {
      setData(snapshot.exists() ? snapshot.val() : {});
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeTab, db, activeNode]);

  const records = Object.entries(data || {});
  const headers = records.length > 0 ? Object.keys(records[0][1]).filter(k => k !== 'id' && typeof records[0][1][k] !== 'object') : [];
  const filteredRecords = records.filter(([id, record]) => Object.values(record).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="mt-12 bg-white rounded-3xl shadow-xl w-full border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-white flex flex-col lg:flex-row justify-between items-center gap-4 relative overflow-hidden">
        <FileSpreadsheet className="w-32 h-32 absolute -right-5 -top-5 opacity-10" />
        <div className="relative z-10"><h2 className="text-2xl font-black">Sistem Master Data Dinamis</h2><p className="text-sm text-gray-300 mt-1">Membaca & Edit Header Kolom Database Secara Bebas.</p></div>
        <div className="flex flex-wrap bg-gray-700/50 p-1.5 rounded-xl relative z-10">
          {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 cursor-pointer ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-gray-700'}`}>{tab.label}</button>))}
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full lg:w-1/3"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" /><input type="text" placeholder={`Cari dalam ${activeTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none" /></div>
        </div>
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20"><RefreshCw className="w-10 h-10 text-blue-600 animate-spin mb-4" /><p className="text-gray-500 font-bold">Memproses Data Database...</p></div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-inner">
            <table className="w-full text-sm text-left min-w-full">
              <thead className="bg-gray-100 text-gray-700 uppercase font-black text-xs border-b"><tr>{headers.map((h) => (<th key={h} className="px-6 py-4 whitespace-nowrap">{h.replace(/_/g, ' ')}</th>))}</tr></thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(([id, record]) => (
                    <tr key={id} className="hover:bg-blue-50/50 transition-colors bg-white">
                      {headers.map((h) => { let val = record[h]; if(typeof val === 'object' && val !== null) val = JSON.stringify(val); return (<td key={`${id}-${h}`} className="px-6 py-4 whitespace-nowrap text-gray-600 font-medium truncate max-w-[200px]">{String(val || '-')}</td>); })}
                    </tr>
                  ))
                ) : (<tr><td colSpan={headers.length || 1} className="text-center py-16"><Database className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 font-bold text-lg">Database Masih Kosong</p></td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

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
          <div className="flex items-center mb-4"><div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-4"><UsersIcon className="w-7 h-7" /></div><div><h3 className="font-black text-xl text-gray-800">Database SDM</h3><p className="text-sm text-gray-500">Import akun & profil.</p></div></div>
          <button onClick={() => { setUploadType('sdm'); setUploadState('idle'); setShowUploadModal(true); }} className="w-full py-4 mt-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 cursor-pointer"><UploadCloud className="w-5 h-5 inline mr-2" /> Upload Data SDM</button>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4"><div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mr-4"><Users className="w-7 h-7" /></div><div><h3 className="font-black text-xl text-gray-800">Database KPM</h3><p className="text-sm text-gray-500">Import KPM Utama & Graduasi.</p></div></div>
          <button onClick={() => { setUploadType('kpm'); setUploadState('idle'); setShowUploadModal(true); }} className="w-full py-4 mt-4 bg-teal-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:bg-teal-600 cursor-pointer"><UploadCloud className="w-5 h-5 inline mr-2" /> Upload Data KPM</button>
        </div>
      </div>

      <MasterDataManagement db={db} appId={appId} isKorkab={isKorkab} />

      {isKorkab && (
        <div className="mt-12 bg-red-50 rounded-3xl shadow-xl w-full border border-red-200 overflow-hidden relative">
           <div className="p-8 border-b border-red-200"><h2 className="text-2xl font-black text-red-700 flex items-center"><AlertTriangle className="w-6 h-6 mr-3"/> Zona Berbahaya (Factory Reset)</h2></div>
           <div className="p-8"><button onClick={() => handleResetDB('ALL')} className="w-full py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-lg flex items-center justify-center cursor-pointer text-lg uppercase"><Trash2 className="w-6 h-6 mr-3"/> Hapus Seluruh Sistem</button></div>
        </div>
      )}
    </div>
  );
}

```
