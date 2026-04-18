import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { ref, onValue, set, push, remove, update as dbUpdateRealtime } from 'firebase/database';
import { Menu, CheckCircle } from 'lucide-react';
import { auth, db, getBasePath } from './config/firebase';
import Sidebar from './components/layout/Sidebar';
import Views from './pages/Views'; // Merangkum semua tampilan halaman

// Utility Hook
function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  });
  useEffect(() => { localStorage.setItem(key, state); }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false); 
  
  const [isLoggedIn, setIsLoggedIn] = usePersistentState('pkh_is_logged_in', 'false');
  const [selectedUserId, setSelectedUserId] = usePersistentState('pkh_user_id', '');
  const [activeTab, setActiveTab] = usePersistentState('pkh_active_tab', 'dashboard');
  
  // State Sub-Tab dikelola di sini agar sinkron dengan Sidebar
  const [subTabs, setSubTabs] = useState({
    kpm: 'daftar',
    agenda: 'harian',
    tugas: 'daftar',
    monitoring: 'p2k2',
    laporan: 'input',
    pengaturan: 'profil',
    sdm: 'profil'
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  // State Database
  const [sdmData, setSdmData] = useState([]);
  const [kpmData, setKpmData] = useState([]);
  // ... Tambahkan state database lainnya (agendaData, tasksData, dll) sesuai kebutuhan Anda

  const showToast = (msg) => { 
    setToastMessage(String(msg)); 
    setTimeout(() => setToastMessage(null), 3500); 
  };

  const bindRealtimeDataWithSeed = (collName, setter, defaultDataArray) => {
    if (!db) { setter(defaultDataArray); return () => {}; }
    try {
      const dbRef = ref(db, getBasePath(collName));
      return onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const d = snapshot.val();
          setter(Object.entries(d).map(([k, v]) => ({ id: k, ...v })).reverse()); 
        } else {
          setter(defaultDataArray);
        }
      });
    } catch (err) { setter(defaultDataArray); return () => {}; }
  };

  useEffect(() => {
    // Jalankan binding data di sini (u1, u2, dst) seperti di kode asli
    setTimeout(() => setIsInitializing(false), 1500);
  }, []);

  const goToMenu = (mainMenu, subMenu = null) => { 
    setActiveTab(mainMenu);
    if (subMenu) {
      setSubTabs(prev => ({ ...prev, [mainMenu]: subMenu }));
    } 
    setIsSidebarOpen(false); 
  };

  const handleLogout = () => { 
    setIsLoggedIn('false'); 
    setSelectedUserId(''); 
    showToast('Berhasil Keluar dari Sistem.'); 
  };

  const activeSdmList = Array.isArray(sdmData) && sdmData.length > 0 ? sdmData : [];
  const currentUserData = activeSdmList.find(s => String(s.id) === String(selectedUserId)) || { role: 'pendamping', nama: 'Memuat...' };
  const isKorkab = currentUserData?.role === 'ketuatim_kab';

  if (isInitializing) return (<div className="h-screen bg-blue-900 flex items-center justify-center text-white font-bold tracking-widest text-sm uppercase">Menghubungkan ke Database...</div>);

  // Jika belum login, return Login Screen di sini (gunakan komponen renderLoginScreen Anda)
  if (isLoggedIn === 'false' || !isLoggedIn) return (<div className="p-10 text-center">Silakan buat komponen Login terpisah.</div>);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden w-full">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        goToMenu={goToMenu}
        handleLogout={handleLogout}
        isKorkab={isKorkab}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full bg-gray-50">
        <header className="bg-white border-b p-4 flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 p-2 bg-gray-100 rounded-xl cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-black text-xl capitalize">{String(activeTab).replace('_', ' ')}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
            {/* View Controller */}
            <Views 
              activeTab={activeTab} 
              subTabs={subTabs}
              currentUserData={currentUserData}
              kpmData={kpmData}
              isKorkab={isKorkab}
              // Oper props data lain yang dibutuhkan ke komponen Views
            />
        </main>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 lg:left-[calc(50%+9rem)] -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl text-sm z-[200] animate-in fade-in flex items-center shadow-2xl font-medium border border-gray-700">
          <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
          {String(toastMessage)}
        </div>
      )}
    </div>
  );
}
