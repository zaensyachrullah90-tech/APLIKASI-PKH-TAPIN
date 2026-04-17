import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, set, push, remove, update as dbUpdateRealtime, child } from 'firebase/database';
import * as Icons from 'lucide-react';

// --- Konfigurasi & Bantuan ---
import { db, auth, appId } from './config/firebase';
import { menuConfig } from './config/menuConfig';
import { getBasePath, getCurrentDate, getCurrentTime, usePersistentState, getAppIcon } from './utils/helpers';

// --- 13 Modul Halaman (Kamar) ---
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

export default function App() {
  // --- STATE OTENTIKASI & APLIKASI ---
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = usePersistentState('pkh_active_tab', 'dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // --- STATE LOGIN & USER ---
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = usePersistentState('pkh_current_user', null);

  // --- STATE NAVIGASI TAB HALAMAN ---
  const [kpmMainTab, setKpmMainTab] = useState('daftar');
  const [kpmDetailTab, setKpmDetailTab] = useState('profil');
  const [agendaSubTab, setAgendaSubTab] = useState('harian');
  const [tugasTab, setTugasTab] = useState('daftar');
  const [laporanTab, setLaporanTab] = useState('input');
  const [settingTab, setSettingTab] = useState('profil');
  const [monitoringSubTab, setMonitoringSubTab] = useState('p2k2');
  
  // --- STATE FILTER & VIEW ---
  const [filterDesa, setFilterDesa] = useState('Semua');
  const [filterDesaMaps, setFilterDesaMaps] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKPM, setSelectedKPM] = useState(null);
  const [selectedTaskView, setSelectedTaskView] = useState(null);
  const [selectedVoteView, setSelectedVoteView] = useState(null);
  const [selectedJadwalView, setSelectedJadwalView] = useState(null);
  const [selectedMonitoringEvent, setSelectedMonitoringEvent] = useState(null);
  
  // --- STATE DATA FIREBASE ---
  const [kpmData, setKpmData] = useState([]);
  const [sdmData, setSdmData] = useState([]);
  const [agendaData, setAgendaData] = useState([]);
  const [piketData, setPiketData] = useState([]);
  const [catatanData, setCatatanData] = useState([]);
  const [tasksData, setTasksData] = useState([]);
  const [votesData, setVotesData] = useState([]);
  const [jadwalData, setJadwalData] = useState([]);
  const [pengaduanData, setPengaduanData] = useState([]);
  const [rankingData, setRankingData] = useState([]);
  const [appsData, setAppsData] = useState([]);
  const [aturanPiket, setAturanPiket] = useState({ jamMulai: '08:00', jamSelesai: '16:00', denda: 50000 });
  const [denda, setDenda] = useState(false);

  // --- STATE MODAL & FORM ---
  const [isSaving, setIsSaving] = useState(false);
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

  const [selectedTugasToLapor, setSelectedTugasToLapor] = useState(null);
  const [selectedVote, setSelectedVote] = useState(null);
  const [selectedPengaduan, setSelectedPengaduan] = useState(null);
  const [selectedAgendaCategory, setSelectedAgendaCategory] = useState(null);
  const [agendaTypeToEdit, setAgendaTypeToEdit] = useState('harian');
  const [sdmForm, setSdmForm] = useState({});
  const [uploadType, setUploadType] = useState('kpm');
  const [uploadState, setUploadState] = useState('idle');
  const [absenStatus, setAbsenStatus] = useState('belum');
  const [jamDatang, setJamDatang] = useState('');

  // --- FIREBASE LISTENERS ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        const collections = {
          kpmData: setKpmData, sdmData: setSdmData, agendaData: setAgendaData,
          piketData: setPiketData, catatanData: setCatatanData, tasksData: setTasksData,
          votesData: setVotesData, jadwalData: setJadwalData, pengaduanData: setPengaduanData,
          rankingData: setRankingData, appsData: setAppsData
        };
        Object.entries(collections).forEach(([collName, setter]) => {
          onValue(ref(db, getBasePath(appId, collName)), (snapshot) => {
            setter(snapshot.exists() ? Object.values(snapshot.val()) : []);
          });
        });
        onValue(ref(db, getBasePath(appId, 'settings/piket')), (snapshot) => {
          if (snapshot.exists()) setAturanPiket(snapshot.val());
        });
        setIsLoading(false);
      } else {
        signInAnonymously(auth).catch(error => console.error("Auth Error:", error));
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // --- FUNGSI BANTUAN ---
  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(''), 3000); };
  
  const handleLogin = (e) => {
    e.preventDefault();
    const user = sdmData.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) { setCurrentUser(user); setLoginError(''); showToast(`Selamat datang, ${user.nama}!`); } 
    else { setLoginError('Username atau password salah!'); }
  };

  const handleLogout = () => { setCurrentUser(null); setActiveTab('dashboard'); };
  const dbUpdate = async (coll, id, data) => { try { await dbUpdateRealtime(ref(db, `${getBasePath(appId, coll)}/${id}`), data); } catch (e) { console.error(e); } };
  const dbDelete = async (coll, id) => { try { await remove(ref(db, `${getBasePath(appId, coll)}/${id}`)); showToast("Data dihapus!"); } catch (e) { console.error(e); } };
  const handleResetDB = async (type) => { 
    if (window.confirm(`PERINGATAN! Anda yakin mereset database ${type}?`)) {
      if(type === 'ALL') {
        const collections = ['kpmData', 'sdmData', 'agendaData', 'piketData', 'catatanData', 'tasksData', 'votesData', 'jadwalData', 'pengaduanData', 'rankingData', 'appsData'];
        for(let coll of collections) await remove(ref(db, getBasePath(appId, coll)));
      } else {
        await remove(ref(db, getBasePath(appId, type)));
      }
      showToast("Database berhasil dikosongkan!");
    }
  };

  const handleGeneratePiketReal = async () => {
    setIsSaving(true);
    const activeSdm = sdmData.filter(s => s.status === 'Aktif' && (s.role === 'pendamping' || s.role === 'ketuatim_kec'));
    if(activeSdm.length === 0) { showToast("Gagal: Tidak ada SDM Aktif!"); setIsSaving(false); return; }
    await remove(ref(db, getBasePath(appId, 'piketData')));
    let today = new Date();
    let hariKerja = [];
    for(let i=0; i<30; i++) {
      let d = new Date(today); d.setDate(today.getDate() + i);
      if(d.getDay() !== 0 && d.getDay() !== 6) hariKerja.push(d.toISOString().split('T')[0]);
    }
    for(let i=0; i<hariKerja.length; i++) {
      let sdmAssign = activeSdm[i % activeSdm.length];
      let newId = Date.now() + i;
      await set(ref(db, `${getBasePath(appId, 'piketData')}/${newId}`), {
        id: newId, nama: sdmAssign.nama, tgl: hariKerja[i],
        status: i === 0 ? 'today' : 'upcoming', absen: false, denda: false
      });
    }
    setIsSaving(false);
    showToast("Jadwal Piket Auto Generate Berhasil!");
  };

  const handleAddApp = async (e) => {
    e.preventDefault();
    const newId = Date.now().toString();
    await set(ref(db, `${getBasePath(appId, 'appsData')}/${newId}`), {
      id: newId, nama: e.target.nama.value, url: e.target.url.value
    });
    setShowAddAppModal(false); showToast("Aplikasi ditambahkan!");
  };

  const getFilteredKPM = (data) => data.filter(k => 
    (filterDesa === 'Semua' || k.desa === filterDesa) &&
    (searchQuery === '' || (k.nama && k.nama.toLowerCase().includes(searchQuery.toLowerCase())) || (k.nik && k.nik.includes(searchQuery)))
  );
  
  const getFilteredAgenda = (data) => data.filter(a => selectedAgendaCategory ? a.category === selectedAgendaCategory : true);
  const goToMenu = (tab, subTab) => { setActiveTab(tab); if(subTab) { if(tab==='agenda') setAgendaSubTab(subTab); if(tab==='tugas') setTugasTab(subTab); } };

  const renderAplikasiLainnya = () => (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl flex justify-between items-center text-white">
        <div><h2 className="text-3xl font-black">Portal Aplikasi Terintegrasi</h2><p className="mt-2 text-blue-100">Akses cepat ke sistem eksternal PKH.</p></div>
        {currentUser?.role === 'ketuatim_kab' && (<button onClick={() => setShowAddAppModal(true)} className="bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl font-bold backdrop-blur-sm cursor-pointer"><Icons.Plus className="w-5 h-5 inline mr-2"/>Tambah Link</button>)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {appsData.map(app => (
          <a key={app.id} href={app.url} target="_blank" rel="noreferrer" className="bg-white p-6 rounded-3xl shadow-sm border text-center hover:shadow-md hover:-translate-y-1 transition-all group block cursor-pointer relative">
            {currentUser?.role === 'ketuatim_kab' && (
              <button onClick={(e) => { e.preventDefault(); dbDelete('appsData', app.id); }} className="absolute top-3 right-3 text-red-300 hover:text-red-600"><Icons.Trash2 className="w-4 h-4"/></button>
            )}
            {getAppIcon(app.nama)}
            <h4 className="font-bold text-gray-800 text-sm">{app.nama}</h4>
            <span className="text-[10px] text-blue-500 font-bold mt-2 inline-block bg-blue-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Buka Link <Icons.ExternalLink className="w-3 h-3 inline"/></span>
          </a>
        ))}
      </div>
    </div>
  );

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Icons.RefreshCw className="w-10 h-10 text-blue-600 animate-spin" /></div>;
  
  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse"></div>
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-3xl bottom-0 right-0 animate-pulse delay-1000"></div>
        <div className="bg-white/10 backdrop-blur-2xl p-10 lg:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/20 relative z-10 transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl rotate-3 mb-6">
              <Icons.Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">PKH<span className="text-blue-400">Pro</span></h1>
            <p className="text-blue-200 mt-3 font-medium text-sm">Sistem Manajemen Terpadu SDM PKH Tapin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <div className="relative">
                <Icons.UserCheck className="absolute left-4 top-4 w-5 h-5 text-blue-200" />
                <input required type="text" placeholder="Username (NIP/NIK)" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 outline-none transition-all focus:bg-white/20" />
              </div>
            </div>
            <div>
              <div className="relative">
                <Icons.Shield className="absolute left-4 top-4 w-5 h-5 text-blue-200" />
                <input required type="password" placeholder="Password Sistem" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-blue-200/50 focus:ring-2 focus:ring-blue-400 outline-none transition-all focus:bg-white/20" />
              </div>
            </div>
            {loginError && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl text-sm font-medium flex items-center"><Icons.AlertCircle className="w-4 h-4 mr-2" /> {loginError}</div>}
            <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer">Login Workspace</button>
          </form>
          <p className="text-center text-blue-200/60 text-xs mt-8 font-medium">© 2026 Developer M. Zaen Syachrullah</p>
        </div>
      </div>
    );
  }

  const isKorkab = currentUser?.role === 'ketuatim_kab';
  const isKorcam = currentUser?.role === 'ketuatim_kec';
  const activeSdmList = sdmData.filter(s => s.status === 'Aktif');

  return (
    <div className="flex h-screen bg-[#f4f7fb] overflow-hidden text-gray-800 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className={`w-72 bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:static inset-y-0 left-0 z-50 flex flex-col`}>
        <div className="h-24 flex items-center justify-between px-8 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
               <Icons.Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight">PKH<span className="text-blue-600">Pro</span></h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600"><Icons.X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={`https://ui-avatars.com/api/?name=${currentUser.nama}&background=3b82f6&color=fff&rounded=true&bold=true`} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white shadow-md" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-800 truncate">{currentUser.nama}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5 tracking-wider truncate">{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-hide">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 mt-2">Menu Utama</p>
          {menuConfig.map((item) => {
            const Icon = Icons[item.icon.split('-').pop().charAt(0).toUpperCase() + item.icon.split('-').pop().slice(1)] || Icons.Circle;
            if (item.id === 'manajemen_data' && !isKorkab) return null;
            if (item.id === 'pengaturan' && !isKorkab) return null;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSelectedKPM(null); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer ${activeTab === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-gray-600 hover:bg-gray-100'}`}>
                <i className={`${item.icon} w-5 text-center`}></i> {item.judul}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100 bg-white">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">
            <Icons.LogOut className="w-5 h-5" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-xl cursor-pointer">
              <Icons.Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-black text-gray-800 capitalize tracking-tight hidden sm:block">
              {activeTab.replace('_', ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
              <Icons.Calendar className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-xs font-bold text-gray-600">{getCurrentDate()}</span>
            </div>
            <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-100">
              <Icons.Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* --- RENDER CONTENT (KAMAR-KAMAR) --- */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
          {activeTab === 'dashboard' && !selectedKPM && <Dashboard safeKpmData={kpmData} currentUserData={currentUser} safePiketData={piketData} safeAgendaData={agendaData} safeTasksData={tasksData} safeVotesData={votesData} isKorkab={isKorkab} isKorcam={isKorcam} goToMenu={goToMenu} getFilteredAgenda={getFilteredAgenda} />}
          
          {activeTab === 'catatan' && !selectedKPM && <CatatanHarian safeCatatanData={catatanData} currentUserData={currentUser} setShowCatatanModal={setShowCatatanModal} dbDelete={dbDelete} />}
          
          {activeTab === 'kpm' && <DataKPM safeKpmData={kpmData} currentUserData={currentUser} kpmMainTab={kpmMainTab} setKpmMainTab={setKpmMainTab} selectedKPM={selectedKPM} setSelectedKPM={setSelectedKPM} kpmDetailTab={kpmDetailTab} setKpmDetailTab={setKpmDetailTab} setShowPotensialModal={setShowPotensialModal} setShowGraduasiModal={setShowGraduasiModal} showToast={showToast} getFilteredKPM={getFilteredKPM} />}
          
          {activeTab === 'agenda' && !selectedKPM && <AgendaPiket agendaSubTab={agendaSubTab} setAgendaSubTab={setAgendaSubTab} safeAgendaData={agendaData} getFilteredAgenda={getFilteredAgenda} isKorkab={isKorkab} isKorcam={isKorcam} setAgendaTypeToEdit={setAgendaTypeToEdit} setShowAgendaModal={setShowAgendaModal} dbUpdate={dbUpdate} dbDelete={dbDelete} selectedAgendaCategory={selectedAgendaCategory} setSelectedAgendaCategory={setSelectedAgendaCategory} handleGeneratePiketReal={handleGeneratePiketReal} setShowLiburModal={setShowLiburModal} aturanPiket={aturanPiket} absenStatus={absenStatus} setAbsenStatus={setAbsenStatus} jamDatang={jamDatang} setJamDatang={setJamDatang} denda={denda} setDenda={setDenda} showToast={showToast} safePiketData={piketData} setShowTukarModal={setShowTukarModal} showTukarModal={showTukarModal} getCurrentTime={getCurrentTime} />}
          
          {activeTab === 'monitoring' && !selectedKPM && <MonitoringKPM selectedMonitoringEvent={selectedMonitoringEvent} setSelectedMonitoringEvent={setSelectedMonitoringEvent} setMonitoringSubTab={setMonitoringSubTab} getFilteredKPM={getFilteredKPM} safeKpmData={kpmData} showToast={showToast} />}
          
          {activeTab === 'tugas' && !selectedKPM && <TugasVoting tugasTab={tugasTab} setTugasTab={setTugasTab} selectedTaskView={selectedTaskView} setSelectedTaskView={setSelectedTaskView} selectedVoteView={selectedVoteView} setSelectedVoteView={setSelectedVoteView} selectedJadwalView={selectedJadwalView} setSelectedJadwalView={setSelectedJadwalView} safeTasksData={tasksData} safeVotesData={votesData} safeJadwalData={jadwalData} isKorkab={isKorkab} isKorcam={isKorcam} currentUserData={currentUser} setShowTambahTugasModal={setShowTambahTugasModal} setShowLaporTugasModal={setShowLaporTugasModal} setSelectedTugasToLapor={setSelectedTugasToLapor} showToast={showToast} activeSdmList={activeSdmList} dbUpdate={dbUpdate} selectedVote={selectedVote} setSelectedVote={setSelectedVote} setShowTambahVoteModal={setShowTambahVoteModal} setShowTambahJadwalModal={setShowTambahJadwalModal} setShowIsiJadwalModal={setShowIsiJadwalModal} />}
          
          {activeTab === 'pengaduan' && !selectedKPM && <PengaduanLaporan safePengaduanData={pengaduanData} setShowPengaduanModal={setShowPengaduanModal} isKorkab={isKorkab} setSelectedPengaduan={setSelectedPengaduan} setShowTindakLanjutModal={setShowTindakLanjutModal} dbDelete={dbDelete} />} 
          
          {activeTab === 'laporan' && !selectedKPM && <LaporanRHK laporanTab={laporanTab} setLaporanTab={setLaporanTab} denda={denda} currentUserData={currentUser} aturanPiket={aturanPiket} showToast={showToast} />}
          
          {activeTab === 'ranking' && !selectedKPM && <RankingSDM rankingData={rankingData} />}
          
          {activeTab === 'sdm' && !selectedKPM && <DatabaseSDM safeSdmData={sdmData} isKorkab={isKorkab} setSdmForm={setSdmForm} setShowSdmModal={setShowSdmModal} dbDelete={dbDelete} isSaving={isSaving} setIsSaving={setIsSaving} />}
          
          {activeTab === 'peta' && !selectedKPM && <PetaGeotagging filterDesaMaps={filterDesaMaps} setFilterDesaMaps={setFilterDesaMaps} getFilteredKPM={getFilteredKPM} safeKpmData={kpmData} isKorkab={isKorkab} setIsSaving={setIsSaving} dbUpdate={dbUpdate} showToast={showToast} />}
          
          {activeTab === 'aplikasi_lainnya' && !selectedKPM && renderAplikasiLainnya()}
          
          {activeTab === 'pengaturan' && !selectedKPM && <Pengaturan settingTab={settingTab} setSettingTab={setSettingTab} currentUserData={currentUser} isKorkab={isKorkab} aturanPiket={aturanPiket} setAturanPiket={setAturanPiket} showToast={showToast} />} 
          
          {activeTab === 'manajemen_data' && !selectedKPM && isKorkab && <ManajemenData setUploadType={setUploadType} setUploadState={setUploadState} setShowUploadModal={setShowUploadModal} handleResetDB={handleResetDB} isKorkab={isKorkab} db={db} appId={appId} />} 
        </main>
      </div>

      {/* --- MODAL GLOBAL APLIKASI (JANGAN DIHAPUS) --- */}
      {showAddAppModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowAddAppModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 p-8">
            <h3 className="font-black text-2xl mb-6">Tambah Tautan Aplikasi</h3>
            <form onSubmit={handleAddApp} className="space-y-5">
              <div><input name="nama" required type="text" placeholder="Nama Aplikasi" className="w-full p-4 border rounded-xl"/></div>
              <div><input name="url" required type="url" placeholder="https://..." className="w-full p-4 border rounded-xl"/></div>
              <div className="flex gap-3 mt-8"><button type="button" onClick={() => setShowAddAppModal(false)} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold cursor-pointer">Batal</button><button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold cursor-pointer">Simpan</button></div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-md text-white px-6 py-4 rounded-2xl text-sm z-[200] shadow-2xl font-bold flex items-center">
          <Icons.CheckCircle className="w-5 h-5 text-green-400 mr-3" /> {toastMessage}
        </div>
      )}
    </div>
  );
}
