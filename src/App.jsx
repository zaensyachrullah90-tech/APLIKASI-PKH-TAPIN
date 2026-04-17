import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, set, push, remove, update as dbUpdateRealtime } from 'firebase/database';
import * as Icons from 'lucide-react';

// --- 1. CONFIG & HELPERS ---
import { db, auth, appId } from './config/firebase';
import { getBasePath, getCurrentDate, getCurrentTime, usePersistentState, getAppIcon } from './utils/helpers';

// --- 2. IMPORT SEMUA MODUL KAMAR (PAGES) ---
import Dashboard from './pages/Dashboard';
import DataKPM from './pages/DataKPM';
import CatatanHarian from './pages/CatatanHarian';
import AgendaPiket from './pages/AgendaPiket';
import TugasVoting from './pages/TugasVoting';
import MonitoringKPM from './pages/MonitoringKPM';
import PengaduanLaporan from './pages/PengaduanLaporan';
import LaporanRHK from './pages/LaporanRHK';
import RankingSDM from './pages/RankingSDM';
import PetaGeotagging from './pages/PetaGeotagging';
import Pengaturan from './pages/Pengaturan';
import DatabaseSDM from './pages/DatabaseSDM';
import ManajemenData from './pages/ManajemenData';

// --- 3. SISTEM ISOLASI MODUL (ANTI-BLANK) ---
// Jika ada 1 file yang error (misal LaporanRHK), aplikasi tetap hidup!
class IsolasiModul extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("Error di Modul:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-10 bg-red-50 rounded-[2rem] border border-red-200 text-center m-4">
          <Icons.AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-2xl font-black text-red-700">Modul Sedang Diperbaiki</h3>
          <p className="text-red-500 mt-2 font-medium">Ada sedikit kesalahan kode pada menu ini, namun menu lainnya tetap bisa Anda gunakan dengan normal.</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg">Muat Ulang Halaman</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- 4. DAFTAR MENU SIDEBAR ---
const menuConfig = [
  { id: 'dashboard', judul: "Dashboard Utama", icon: "Home", subMenu: [] },
  { id: 'catatan', judul: "Catatan Harian", icon: "BookOpen", subMenu: [] },
  { id: 'kpm', judul: "Manajemen KPM", icon: "Users", subMenu: [{id:'daftar', judul:'Database KPM'}, {id:'potensial', judul:'Potensial'}, {id:'graduasi', judul:'Graduasi'}] },
  { id: 'agenda', judul: "Agenda & Piket", icon: "CalendarDays", subMenu: [{id:'harian', judul:'Agenda Harian'}, {id:'khusus', judul:'Giat Khusus'}, {id:'piket', judul:'Jadwal Piket'}] },
  { id: 'monitoring', judul: "Monitoring KPM", icon: "ClipboardList", subMenu: [{id:'p2k2', judul:'Modul P2K2'}] },
  { id: 'tugas', judul: "Tugas & Voting", icon: "ClipboardCheck", subMenu: [{id:'daftar', judul:'Daftar Tugas'}, {id:'progres', judul:'Progres Data'}, {id:'vote', judul:'Voting Aktif'}] },
  { id: 'pengaduan', judul: "Pengaduan / Laporan", icon: "MessageSquare", subMenu: [] },
  { id: 'laporan', judul: "Laporan & Denda", icon: "FileText", subMenu: [{id:'input', judul:'Input RHK'}, {id:'rekap', judul:'Rekap Denda'}] },
  { id: 'sdm', judul: "Database SDM", icon: "ShieldCheck", subMenu: [] },
  { id: 'aplikasi_lainnya', judul: "Aplikasi Terkait", icon: "Link", subMenu: [] },
  { id: 'ranking', judul: "Ranking SDM", icon: "Trophy", subMenu: [] },
  { id: 'manajemen_data', judul: "Manajemen Data", icon: "Database", subMenu: [] },
  { id: 'peta', judul: "Peta Lokasi", icon: "Map", subMenu: [] },
  { id: 'pengaturan', judul: "Pengaturan", icon: "Settings", subMenu: [{id:'profil', judul:'Profil Akun'}, {id:'sistem', judul:'Aturan Sistem'}] }
];

export default function App() {
  // === STATE APLIKASI (UTUH DARI FILE ASLI) ===
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = usePersistentState('pkh_is_logged_in', 'false');
  const [selectedUserId, setSelectedUserId] = usePersistentState('pkh_user_id', '');
  const [activeTab, setActiveTab] = usePersistentState('pkh_active_tab', 'dashboard');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [expandedMenu, setExpandedMenu] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // === STATE SUB-MENU DARI FILE ASLI ===
  const [kpmMainTab, setKpmMainTab] = useState('daftar'); 
  const [kpmDetailTab, setKpmDetailTab] = useState('profil');
  const [agendaSubTab, setAgendaSubTab] = useState('harian');
  const [tugasTab, setTugasTab] = useState('daftar');
  const [laporanTab, setLaporanTab] = useState('input');
  const [settingTab, setSettingTab] = useState('profil');
  const [monitoringSubTab, setMonitoringSubTab] = useState('p2k2');
  
  // === STATE DATABASE FIREBASE ===
  const [sdmData, setSdmData] = useState([]);
  const [kpmData, setKpmData] = useState([]);
  const [agendaData, setAgendaData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [votesData, setVotesData] = useState([]);
  const [jadwalKegiatanData, setJadwalKegiatanData] = useState([]);
  const [pengaduanData, setPengaduanData] = useState([]);
  const [catatanData, setCatatanData] = useState([]);
  const [piketData, setPiketData] = useState([]);
  const [aplikasiEksternal, setAplikasiEksternal] = useState([{ id: 'app1', nama: 'SIKS-NG KEMENSOS', url: 'https://siks.kemensos.go.id' }]);
  const [aturanPiket, setAturanPiket] = useState({ jamMulai: '08:00', jamSelesai: '16:00', denda: 50000 });
  const [rankingData, setRankingData] = useState([{ id: 1, nama: 'Ahmad Pendamping', poin: 450, level: 'Pendamping Ahli' }]);

  // === STATE SELECTIONS & MODALS ===
  const [selectedKPM, setSelectedKPM] = useState(null);
  const [filterDesaMaps, setFilterDesaMaps] = useState('Semua');
  const [selectedTaskView, setSelectedTaskView] = useState(null);
  const [selectedVoteView, setSelectedVoteView] = useState(null);
  const [selectedJadwalView, setSelectedJadwalView] = useState(null);
  const [selectedMonitoringEvent, setSelectedMonitoringEvent] = useState(null);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [selectedAgendaCategory, setSelectedAgendaCategory] = useState(null);
  const [selectedTugasToLapor, setSelectedTugasToLapor] = useState(null);
  const [selectedVote, setSelectedVote] = useState('');
  const [agendaTypeToEdit, setAgendaTypeToEdit] = useState('harian');
  const [sdmForm, setSdmForm] = useState({});
  const [uploadType, setUploadType] = useState('kpm');
  const [uploadState, setUploadState] = useState('idle');
  const [absenStatus, setAbsenStatus] = useState('belum');
  const [jamDatang, setJamDatang] = useState('');
  const [denda, setDenda] = useState(false);

  // Modals
  const [showPotensialModal, setShowPotensialModal] = useState(false);
  const [showGraduasiModal, setShowGraduasiModal] = useState(false);
  const [showCatatanModal, setShowCatatanModal] = useState(false);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [showLiburModal, setShowLiburModal] = useState(false);
  const [showTukarModal, setShowTukarModal] = useState(false);
  const [showTambahTugasModal, setShowTambahTugasModal] = useState(false);
  const [showLaporTugasModal, setShowLaporTugasModal] = useState(false);
  const [showTambahVoteModal, setShowTambahVoteModal] = useState(false);
  const [showTambahJadwalModal, setShowTambahJadwalModal] = useState(false);
  const [showIsiJadwalModal, setShowIsiJadwalModal] = useState(false);
  const [showPengaduanModal, setShowPengaduanModal] = useState(false);
  const [showTindakLanjutModal, setShowTindakLanjutModal] = useState(false);
  const [showSdmModal, setShowSdmModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddAppModal, setShowAddAppModal] = useState(false);

  // Safe Data
  const safeSdmData = Array.isArray(sdmData) ? sdmData : [];
  const safeKpmData = Array.isArray(kpmData) ? kpmData : [];
  const safeAgendaData = Array.isArray(agendaData) ? agendaData : [];
  const safeTasksData = Array.isArray(tasksData) ? tasksData : [];
  const safeVotesData = Array.isArray(votesData) ? votesData : [];
  const safeJadwalData = Array.isArray(jadwalKegiatanData) ? jadwalKegiatanData : [];
  const safePengaduanData = Array.isArray(pengaduanData) ? pengaduanData : [];
  const safeCatatanData = Array.isArray(catatanData) ? catatanData : [];
  const safePiketData = Array.isArray(piketData) ? piketData : [];

  const activeSdmList = safeSdmData.length > 0 ? safeSdmData : [{ id: 'admin1', nama: 'Admin Master', role: 'ketuatim_kab', nik: 'admin', password: 'admin', status: 'Aktif' }];
  const currentUserData = activeSdmList.find(s => String(s.id) === String(selectedUserId)) || activeSdmList[0];
  const isKorkab = currentUserData?.role === 'ketuatim_kab';
  const isKorcam = currentUserData?.role === 'ketuatim_kec';

  // === FIREBASE INIT ===
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => { try { await signInAnonymously(auth); } catch(e){} };
    initAuth();
    
    const collections = {
      kpmData: setKpmData, sdmData: setSdmData, agendaData: setAgendaData,
      piketData: setPiketData, catatanData: setCatatanData, tugasData: setTasksData,
      voteData: setVotesData, jadwalKegiatanData: setJadwalKegiatanData, pengaduanData: setPengaduanData
    };
    Object.entries(collections).forEach(([collName, setter]) => {
      onValue(ref(db, getBasePath(appId, collName)), (snapshot) => {
        setter(snapshot.exists() ? Object.values(snapshot.val()) : []);
      });
    });
    setTimeout(() => setIsInitializing(false), 1500);
  }, []);

  // === FUNGSI BANTUAN ===
  const showToast = (msg) => { setToastMessage(String(msg)); setTimeout(() => setToastMessage(null), 3000); };
  
  const getFilteredKPM = (data) => {
    if(!Array.isArray(data)) return []; 
    if (isKorkab) return data;
    if (isKorcam) return data.filter(k => String(k.kecamatan) === String(currentUserData?.kecamatan)); 
    return data.filter(k => String(k.pendampingId) === String(currentUserData?.nama)); 
  };
  const getFilteredAgenda = (data) => data.filter(a => selectedAgendaCategory ? a.category === selectedAgendaCategory : true);

  const dbUpdate = async (coll, id, data) => { try { await dbUpdateRealtime(ref(db, `${getBasePath(appId, coll)}/${id}`), data); } catch (e) {} };
  const dbDelete = async (coll, id) => { try { await remove(ref(db, `${getBasePath(appId, coll)}/${id}`)); showToast("Data dihapus!"); } catch (e) {} };
  const handleResetDB = async (type) => { if(window.confirm("Yakin reset DB?")) { try { await remove(ref(db, getBasePath(appId, type))); showToast("Reset berhasil!"); } catch(e){} } };
  const handleGeneratePiketReal = () => showToast("Jadwal Piket Di-Generate!");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginUsername === 'admin' && loginPassword === 'admin') {
      setSelectedUserId('admin1'); setIsLoggedIn('true'); return showToast("Berhasil Login Admin");
    }
    const matchUser = activeSdmList.find(x => String(x.nik) === String(loginUsername) && String(x.password) === String(loginPassword));
    if (matchUser) { setSelectedUserId(matchUser.id); setIsLoggedIn('true'); showToast(`Selamat datang, ${matchUser.nama}!`); } 
    else { setLoginError('NIK atau Password salah.'); }
  };

  const handleLogout = () => { setIsLoggedIn('false'); setSelectedUserId(''); setLoginUsername(''); setLoginPassword(''); showToast("Keluar Sistem"); };

  const handleMenuClick = (menuId, subMenus) => {
    if (subMenus && subMenus.length > 0) {
      setExpandedMenu(expandedMenu === menuId ? '' : menuId);
    } else {
      setActiveTab(menuId); setActiveSubTab(''); setExpandedMenu(''); setIsSidebarOpen(false); setSelectedKPM(null);
    }
  };

  const handleSubMenuClick = (menuId, subMenuId) => {
    setActiveTab(menuId); setActiveSubTab(subMenuId); setIsSidebarOpen(false); setSelectedKPM(null);
    if(menuId === 'kpm') setKpmMainTab(subMenuId);
    if(menuId === 'agenda') setAgendaSubTab(subMenuId);
    if(menuId === 'tugas') setTugasTab(subMenuId);
    if(menuId === 'monitoring') setMonitoringSubTab(subMenuId);
    if(menuId === 'laporan') setLaporanTab(subMenuId);
    if(menuId === 'pengaturan') setSettingTab(subMenuId);
  };

  const renderAplikasiLainnya = () => (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-xl flex justify-between items-center text-white">
        <div><h2 className="text-3xl font-black">Portal Aplikasi Terintegrasi</h2><p className="mt-2 text-blue-100">Akses cepat ke sistem eksternal PKH.</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {aplikasiEksternal.map(app => (
          <a key={app.id} href={app.url} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-3xl shadow-sm border text-center hover:shadow-md hover:-translate-y-1 transition-all group block cursor-pointer">
            <div className="flex justify-center mb-2"><Icons.Globe className="w-8 h-8 text-indigo-600" /></div>
            <h4 className="font-bold text-gray-800 text-sm">{app.nama}</h4>
          </a>
        ))}
      </div>
    </div>
  );

  if (isInitializing) return <div className="h-screen bg-blue-900 flex items-center justify-center"><Icons.RefreshCw className="w-10 h-10 text-white animate-spin"/></div>;

  if (isLoggedIn === 'false' || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center font-sans">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white">
          <div className="text-center mb-8"><div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-lg rotate-3"><Icons.Shield className="w-10 h-10 text-white -rotate-3"/></div><h2 className="text-3xl font-black text-gray-800">PKH Pro</h2><p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-wide">Sistem Terpadu Modular</p></div>
          {loginError && (<div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mb-6 flex items-center"><Icons.AlertCircle className="w-5 h-5 mr-3" /> {loginError}</div>)}
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div><input value={loginUsername} onChange={e => setLoginUsername(e.target.value)} type="text" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Username / NIK" /></div>
            <div><input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} type="password" required className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Kata Sandi" /></div>
            <button type="submit" className="w-full py-4 mt-2 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 cursor-pointer"><Icons.LogIn className="w-5 h-5 inline mr-2" /> Masuk ke Aplikasi</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* SIDEBAR MEWAH & MODULAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-100 shadow-2xl lg:shadow-none lg:relative transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 flex flex-col`}>
        <div className="p-8 border-b border-slate-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg"><Icons.Shield className="w-6 h-6 text-white" /></div>
          <h2 className="font-black text-2xl text-slate-800 tracking-tight">PKH<span className="text-blue-600">Pro</span></h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide">
          {menuConfig.map(item => {
             if (item.id === 'manajemen_data' && !isKorkab) return null;
             if (item.id === 'ranking' && !isKorkab) return null;
             const Icon = Icons[item.icon] || Icons.Circle;
             const hasSub = item.subMenu && item.subMenu.length > 0;
             const isExpanded = expandedMenu === item.id;
             const isActive = activeTab === item.id && !hasSub;

             return (
               <div key={item.id}>
                 <button onClick={() => handleMenuClick(item.id, item.subMenu)} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl cursor-pointer transition-all ${isActive ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-50 font-medium'}`}>
                   <div className="flex items-center"><Icon className="w-5 h-5 mr-3"/> <span className="text-sm tracking-wide">{item.judul}</span></div>
                   {hasSub && <Icons.ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                 </button>
                 {hasSub && isExpanded && (
                   <div className="ml-5 mt-1 pl-4 border-l-2 border-slate-100 space-y-1">
                     {item.subMenu.map(sub => (
                       <button key={sub.id} onClick={() => handleSubMenuClick(item.id, sub.id)} className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${activeTab === item.id && activeSubTab === sub.id ? 'bg-blue-50 text-blue-700 font-black' : 'text-slate-500 font-medium hover:text-blue-600 hover:bg-slate-50'}`}>
                         {sub.judul}
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             );
          })}
        </nav>
        <div className="p-6 border-t border-slate-50"><button onClick={handleLogout} className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-sm font-black uppercase flex items-center justify-center cursor-pointer transition-colors shadow-sm"><Icons.LogOut className="w-5 h-5 mr-3" /> Keluar Sistem</button></div>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 lg:px-8 flex items-center justify-between shadow-sm z-30 sticky top-0">
          <div className="flex items-center"><button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 p-2.5 bg-white border border-slate-200 shadow-sm text-slate-600 rounded-xl cursor-pointer"><Icons.Menu className="w-5 h-5" /></button><h1 className="font-black text-xl lg:text-2xl capitalize text-slate-800 tracking-tight hidden sm:block">{String(activeTab).replace('_', ' ')} {activeSubTab && ` / ${activeSubTab.replace('_', ' ')}`}</h1></div>
          <div className="flex items-center gap-4"><div className="text-right hidden md:block"><p className="text-sm font-black text-slate-800">{currentUserData.nama}</p><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{currentUserData.role.replace('_', ' ')}</p></div><img src={`https://ui-avatars.com/api/?name=${currentUserData.nama}&background=E0E7FF&color=4338CA&bold=true`} className="w-11 h-11 rounded-2xl border-2 border-white shadow-md" alt="Avatar" /></div>
        </header>

        {/* PEMANGGILAN ROUTER KE 13 FILE MODULAR (DILINDUNGI ISOLASIMODUL) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
           <IsolasiModul>
              {activeTab === 'dashboard' && !selectedKPM && <Dashboard safeKpmData={safeKpmData} currentUserData={currentUserData} safePiketData={safePiketData} safeAgendaData={safeAgendaData} safeTasksData={tasksData} safeVotesData={votesData} isKorkab={isKorkab} isKorcam={isKorcam} goToMenu={goToMenu} getFilteredAgenda={getFilteredAgenda} />}
              {activeTab === 'catatan' && !selectedKPM && <CatatanHarian safeCatatanData={safeCatatanData} currentUserData={currentUserData} setShowCatatanModal={setShowCatatanModal} dbDelete={dbDelete} />}
              {activeTab === 'kpm' && <DataKPM safeKpmData={safeKpmData} currentUserData={currentUserData} kpmMainTab={kpmMainTab} setKpmMainTab={setKpmMainTab} selectedKPM={selectedKPM} setSelectedKPM={setSelectedKPM} kpmDetailTab={kpmDetailTab} setKpmDetailTab={setKpmDetailTab} setShowPotensialModal={setShowPotensialModal} setShowGraduasiModal={setShowGraduasiModal} showToast={showToast} getFilteredKPM={getFilteredKPM} />}
              {activeTab === 'agenda' && !selectedKPM && <AgendaPiket agendaSubTab={agendaSubTab} setAgendaSubTab={setAgendaSubTab} safeAgendaData={safeAgendaData} getFilteredAgenda={getFilteredAgenda} isKorkab={isKorkab} isKorcam={isKorcam} setAgendaTypeToEdit={setAgendaTypeToEdit} setShowAgendaModal={setShowAgendaModal} dbUpdate={dbUpdate} dbDelete={dbDelete} selectedAgendaCategory={selectedAgendaCategory} setSelectedAgendaCategory={setSelectedAgendaCategory} handleGeneratePiketReal={handleGeneratePiketReal} setShowLiburModal={setShowLiburModal} aturanPiket={aturanPiket} absenStatus={absenStatus} setAbsenStatus={setAbsenStatus} jamDatang={jamDatang} setJamDatang={setJamDatang} denda={denda} setDenda={setDenda} showToast={showToast} safePiketData={safePiketData} setShowTukarModal={setShowTukarModal} showTukarModal={showTukarModal} getCurrentTime={getCurrentTime} />}
              {activeTab === 'monitoring' && !selectedKPM && <MonitoringKPM selectedMonitoringEvent={selectedMonitoringEvent} setSelectedMonitoringEvent={setSelectedMonitoringEvent} setMonitoringSubTab={setMonitoringSubTab} getFilteredKPM={getFilteredKPM} safeKpmData={safeKpmData} showToast={showToast} />}
              {activeTab === 'tugas' && !selectedKPM && <TugasVoting tugasTab={tugasTab} setTugasTab={setTugasTab} selectedTaskView={selectedTaskView} setSelectedTaskView={setSelectedTaskView} selectedVoteView={selectedVoteView} setSelectedVoteView={setSelectedVoteView} selectedJadwalView={selectedJadwalView} setSelectedJadwalView={setSelectedJadwalView} safeTasksData={tasksData} safeVotesData={votesData} safeJadwalData={safeJadwalData} isKorkab={isKorkab} isKorcam={isKorcam} currentUserData={currentUserData} setShowTambahTugasModal={setShowTambahTugasModal} setShowLaporTugasModal={setShowLaporTugasModal} setSelectedTugasToLapor={setSelectedTugasToLapor} showToast={showToast} activeSdmList={activeSdmList} dbUpdate={dbUpdate} selectedVote={selectedVote} setSelectedVote={setSelectedVote} setShowTambahVoteModal={setShowTambahVoteModal} setShowTambahJadwalModal={setShowTambahJadwalModal} setShowIsiJadwalModal={setShowIsiJadwalModal} />}
              {activeTab === 'pengaduan' && !selectedKPM && <PengaduanLaporan safePengaduanData={safePengaduanData} setShowPengaduanModal={setShowPengaduanModal} isKorkab={isKorkab} setSelectedPengaduan={setSelectedPengaduan} setShowTindakLanjutModal={setShowTindakLanjutModal} dbDelete={dbDelete} />} 
              {activeTab === 'laporan' && !selectedKPM && <LaporanRHK laporanTab={laporanTab} setLaporanTab={setLaporanTab} denda={denda} currentUserData={currentUserData} aturanPiket={aturanPiket} showToast={showToast} />}
              {activeTab === 'ranking' && !selectedKPM && isKorkab && <RankingSDM rankingData={rankingData} />}
              {activeTab === 'sdm' && !selectedKPM && <DatabaseSDM safeSdmData={safeSdmData} isKorkab={isKorkab} setSdmForm={setSdmForm} setShowSdmModal={setShowSdmModal} dbDelete={dbDelete} isSaving={isSaving} setIsSaving={setIsSaving} />}
              {activeTab === 'manajemen_data' && !selectedKPM && isKorkab && <ManajemenData setUploadType={setUploadType} setUploadState={setUploadState} setShowUploadModal={setShowUploadModal} handleResetDB={handleResetDB} isKorkab={isKorkab} db={db} appId={appId} />} 
              {activeTab === 'peta' && !selectedKPM && <PetaGeotagging filterDesaMaps={filterDesaMaps} setFilterDesaMaps={setFilterDesaMaps} getFilteredKPM={getFilteredKPM} safeKpmData={safeKpmData} isKorkab={isKorkab} setIsSaving={setIsSaving} dbUpdate={dbUpdate} showToast={showToast} />}
              {activeTab === 'pengaturan' && !selectedKPM && isKorkab && <Pengaturan settingTab={settingTab} setSettingTab={setSettingTab} currentUserData={currentUserData} isKorkab={isKorkab} aturanPiket={aturanPiket} setAturanPiket={setAturanPiket} showToast={showToast} />} 
              {activeTab === 'aplikasi_lainnya' && !selectedKPM && renderAplikasiLainnya()}
           </IsolasiModul>
        </main>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl z-[200] font-bold shadow-2xl flex items-center">
          <Icons.CheckCircle className="w-5 h-5 mr-3 text-emerald-400" /> {toastMessage}
        </div>
      )}
    </div>
  );
}
