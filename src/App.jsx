import React, { useState, useEffect } from 'react';
import { db } from './config/firebase';
import { ref, onValue } from 'firebase/database';
import { menuConfig } from './config/menuConfig';
import { usePersistentState, getBasePath } from './utils/helpers';

// Import Pages
import Dashboard from './pages/Dashboard';
// Import halaman lain yang Anda buat di src/pages/...

export default function App() {
  const [activeTab, setActiveTab] = usePersistentState('active_tab', 'dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = usePersistentState('user_id', 'admin1');
  
  // State Data Realtime
  const [kpmData, setKpmData] = useState([]);
  const [sdmData, setSdmData] = useState([]);
  const [piketData, setPiketData] = useState([]);
  const [agendaData, setAgendaData] = useState([]);

  // Sinkronisasi Database Otomatis
  useEffect(() => {
    const unsubKpm = onValue(ref(db, getBasePath('kpmData')), (snap) => {
      setKpmData(snap.exists() ? Object.values(snap.val()) : []);
    });
    const unsubSdm = onValue(ref(db, getBasePath('sdmData')), (snap) => {
      setSdmData(snap.exists() ? Object.values(snap.val()) : []);
    });
    // Tambahkan listener lainnya sesuai file App.jsx asli Anda
    return () => { unsubKpm(); unsubSdm(); };
  }, []);

  const currentUserData = sdmData.find(s => s.id === selectedUserId) || {};

  // Logika Router Dinamis
  const RenderContent = () => {
    const props = { currentUserData, safeKpmData: kpmData, safePiketData: piketData, safeAgendaData: agendaData, isKorkab: currentUserData.role === 'ketuatim_kab' };
    
    switch (activeTab) {
      case 'dashboard': return <Dashboard {...props} />;
      // case 'kpm-daftar': return <DataKpm {...props} />;
      default: return <div className="p-20 text-center font-bold text-slate-300 italic">Modul {activeTab} siap dirakit.</div>;
    }
  };

  return (
    <div className="h-screen w-screen flex bg-[#f8fafc] overflow-hidden">
      {/* SIDEBAR MODEREN 2026 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r transition-transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-24 flex items-center px-8 border-b">
           <span className="text-2xl font-black text-indigo-600">PKH<span className="text-slate-800">Pro</span></span>
        </div>
        <nav className="p-4 space-y-1">
          {menuConfig.map(menu => (
            <button key={menu.id} onClick={() => {setActiveTab(menu.id); setIsSidebarOpen(false);}} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === menu.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}>
              <i className={`${menu.icon} w-5`}></i> {menu.judul}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-8">
           <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-600"><i className="fa-solid fa-bars-staggered text-xl"></i></button>
           <h2 className="font-black text-slate-800 capitalize">{activeTab.replace('_', ' ')}</h2>
           <img src={`https://ui-avatars.com/api/?name=${currentUserData.nama || 'User'}&background=random`} className="w-10 h-10 rounded-2xl shadow-sm" />
        </header>
        <div className="flex-1 overflow-auto p-8">
           <RenderContent />
        </div>
      </main>
    </div>
  );
}
