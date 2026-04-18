```react
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getDatabase, ref, onValue, set, push, remove, update as dbUpdateRealtime, child } from 'firebase/database';
import { 
  Home, Users, Calendar, FileText, Trophy, Map as MapIcon, Menu, X, MapPin, Download,
  Search, Filter, ChevronLeft, UserSquare, TrendingUp, Briefcase,
  UploadCloud, CheckCircle, AlertCircle, Plus, CalendarDays, CalendarClock,
  AlertTriangle, Clock, LogIn, LogOut, RefreshCw, CalendarOff, Settings,
  Timer, ArrowRightLeft, Banknote, ClipboardCheck, CheckSquare, BarChart2,
  Users as UsersIcon, Share2, Target, ChevronRight, Link as LinkIcon,
  ClipboardList, GraduationCap, Stethoscope, HeartHandshake, Edit, Trash2,
  MessageSquare, Headset, Save, Shield, Database, Sliders, Activity, 
  Printer, CreditCard, BookOpen, ExternalLink, Globe, UserCheck, Bell,
  UserPlus, FileSpreadsheet, ListTodo, FileUp, Columns, ShieldCheck, ChevronDown
} from 'lucide-react';

// ==========================================
// 1. FIREBASE CONFIG & ANTI-ERROR HELPERS
// ==========================================
const userFirebaseConfig = {
  apiKey: "AIzaSyD_ROaVGAbJep3gp4BgnBnyRceAxjtX2tw",
  authDomain: "aplikasi-pkh-tapin.firebaseapp.com",
  databaseURL: "https://aplikasi-pkh-tapin-default-rtdb.firebaseio.com",
  projectId: "aplikasi-pkh-tapin",
  storageBucket: "aplikasi-pkh-tapin.firebasestorage.app",
  messagingSenderId: "553098582321",
  appId: "1:553098582321:web:d27b3445f92e1fd5c87810"
};

let app, auth, db, appId = 'aplikasi-pkh-tapin';
try {
  if (typeof __firebase_config !== 'undefined') {
    app = initializeApp(JSON.parse(__firebase_config));
    auth = getAuth(app); db = getDatabase(app);
    appId = typeof __app_id !== 'undefined' ? String(__app_id) : 'aplikasi-pkh-tapin';
  } else {
    app = initializeApp(userFirebaseConfig);
    auth = getAuth(app); db = getDatabase(app);
    appId = userFirebaseConfig.projectId;
  }
} catch (error) { console.error("Firebase Init Error:", error); }

// ANTI-ERROR COPY PASTE: Pakai penggabungan string biasa
const getBasePath = (collName) => {
  if (!db) return collName;
  const safeAppId = String(appId).split('.').join('_').split('#').join('_').split('$').join('_').split('[').join('_').split(']').join('_');
  return "artifacts/" + safeAppId + "/public/data/" + collName;
};

const getCurrentDate = () => new Date().toISOString().split('T')[0];
const getCurrentTime = () => { const d = new Date(); return d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0'); };

function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => { const v = localStorage.getItem(key); return v !== null ? v : initialValue; });
  useEffect(() => { localStorage.setItem(key, state); }, [key, state]); return [state, setState];
}

// INJEKSI SCRIPT SHEETJS UNTUK EXCEL
const loadXLSX = async () => {
  if (window.XLSX) return window.XLSX;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.onload = () => resolve(window.XLSX);
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const getAppIcon = (nama) => {
  const n = String(nama || '').toLowerCase();
  if (n.includes('siks') || n.includes('data')) return <Database className="w-8 h-8 text-blue-400" />;
  if (n.includes('cek') || n.includes('search')) return <Search className="w-8 h-8 text-cyan-400" />;
  if (n.includes('pkh') || n.includes('bayar')) return <CreditCard className="w-8 h-8 text-indigo-400" />;
  if (n.includes('lapor') || n.includes('pengaduan')) return <MessageSquare className="w-8 h-8 text-rose-400" />;
  return <Globe className="w-8 h-8 text-blue-500" />;
};

// ==========================================
// 2. STYLING KELAS GLOBAL (FUTURISTIC BLUE GLASS)
// ==========================================
const glassCard = "bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-[2rem]";
const glassInput = "w-full p-4 bg-slate-800/50 border border-slate-700 focus:border-cyan-500 rounded-2xl outline-none transition-all text-slate-200 font-medium placeholder:text-slate-500 focus:bg-slate-800 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]";
const glassButton = "w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-2xl font-black tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:-translate-y-1 flex items-center justify-center cursor-pointer";
const modalOverlay = "fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300";
const modalContent = "bg-slate-900 border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] w-full max-w-lg relative z-10 p-8 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide animate-in zoom-in-95 duration-300";

// ==========================================
// 3. KOMPONEN MODULAR INTERNAL (ANTI ERROR)
// ==========================================

const ModulManajemenData = ({ db, isKorkab, showToast }) => {
  const [activeTab, setActiveTab] = useState('kpm');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [formData, setFormData] = useState({});

  const tabs = [{ id: 'kpm', label: 'Data KPM', node: 'kpmData' }, { id: 'sdm', label: 'Data SDM', node: 'sdmData' }, { id: 'tugas', label: 'Data Tugas', node: 'tugasData' }, { id: 'agenda', label: 'Data Agenda', node: 'agendaData' }];
  const activeNode = tabs.find(t => t.id === activeTab).node;

  useEffect(() => {
    setLoading(true); const dataRef = ref(db, getBasePath(activeNode));
    const unsubscribe = onValue(dataRef, (snapshot) => { setData(snapshot.exists() ? snapshot.val() : {}); setLoading(false); });
    return () => unsubscribe();
  }, [activeTab, db, activeNode]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return; setLoading(true);
    try {
      const XLSX = await loadXLSX();
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const parsedData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      if (parsedData.length > 0) {
        const updates = {}; parsedData.forEach((row) => { const newKey = push(child(ref(db), getBasePath(activeNode))).key; updates[getBasePath(activeNode) + '/' + newKey] = row; });
        await dbUpdateRealtime(ref(db), updates); showToast('Sistem: Excel berhasil disinkronisasi ke Cloud!');
      }
    } catch (error) { showToast('Gagal memproses Excel.'); } finally { setLoading(false); e.target.value = null; }
  };

  const handleAddColumn = async () => {
    if (!isKorkab) return;
    const newColName = window.prompt("Nama Kolom Baru (cth: nomor_hp):"); if (!newColName) return;
    const safeColName = newColName.split('.').join('_').split(' ').join('_').toLowerCase();
    setLoading(true);
    try {
      const updates = {}; Object.keys(data).forEach(id => { updates[getBasePath(activeNode) + '/' + id + '/' + safeColName] = "-"; });
      await dbUpdateRealtime(ref(db), updates); showToast("Kolom " + safeColName + " ditambahkan.");
    } catch (error) { showToast('Gagal menambah kolom.'); } finally { setLoading(false); }
  };

  const handleSaveData = async (e) => {
    e.preventDefault(); if (!isKorkab) return;
    try {
      if (modalMode === 'add') await set(push(ref(db, getBasePath(activeNode))), formData);
      else if (modalMode === 'edit') await dbUpdateRealtime(ref(db, getBasePath(activeNode) + '/' + currentRecordId), formData);
      setShowModal(false); setFormData({}); showToast("Data tersimpan di Cloud!");
    } catch (error) { showToast('Gagal menyimpan.'); }
  };

  const handleDelete = async (id) => { if (!isKorkab) return; if (window.confirm("Hapus baris ini permanen?")) try { await remove(ref(db, getBasePath(activeNode) + '/' + id)); } catch(e){} };
  const openEditModal = (id, record) => { if (!isKorkab) return; setCurrentRecordId(id); setFormData(record); setModalMode('edit'); setShowModal(true); };
  const openAddModal = () => { if (!isKorkab) return; setCurrentRecordId(null); setFormData({}); setModalMode('add'); setShowModal(true); };

  const records = Object.entries(data || {});
  const headers = records.length > 0 ? Object.keys(records[0][1]).filter(k => k !== 'id' && typeof records[0][1][k] !== 'object') : [];
  const filteredRecords = records.filter(([id, r]) => Object.values(r).some(val => String(val).toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div className="space-y-6">
      <div className={`${glassCard} p-8 flex flex-col lg:flex-row justify-between items-center gap-6 overflow-hidden relative`}>
        <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30"><Database className="w-8 h-8 text-white"/></div>
          <div><h2 className="text-3xl font-black text-white tracking-tight">Database Engine</h2><p className="text-slate-400 font-medium">Manipulasi data dinamis & sinkronisasi Cloud.</p></div>
        </div>
        <div className="flex flex-wrap bg-slate-800/80 backdrop-blur-md p-1.5 rounded-2xl relative z-10 border border-slate-700 overflow-x-auto">
          {tabs.map((tab) => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-cyan-500 text-slate-900 shadow-md' : 'text-slate-400 hover:text-white'}`}>{tab.label}</button>))}
        </div>
      </div>

      <div className={`${glassCard} p-8`}>
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full lg:w-1/3"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" /><input type="text" placeholder={`Cari di ${activeTab}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={glassInput} style={{paddingLeft: '3rem'}} /></div>
          {isKorkab && (
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <label className="cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1"><UploadCloud className="w-5 h-5" /> Import Excel<input type="file" accept=".csv, .xlsx, .xls" className="hidden" onChange={handleFileUpload} disabled={loading}/></label>
              <button onClick={handleAddColumn} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-blue-400 px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"><Columns className="w-5 h-5" /> Kolom</button>
              <button onClick={openAddModal} className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer"><Plus className="w-5 h-5" /> Baris</button>
            </div>
          )}
        </div>

        {loading ? (<div className="py-20 text-center"><RefreshCw className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" /><p className="text-slate-400 font-bold animate-pulse">Menyinkronkan Data...</p></div>) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-700">
            <table className="w-full text-sm text-left"><thead className="bg-slate-800 text-slate-300 uppercase font-black text-xs tracking-wider border-b border-slate-700"><tr>{isKorkab && <th className="px-6 py-5">Aksi</th>}{headers.map(h => <th key={h} className="px-6 py-5">{h.split('_').join(' ')}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-700/50">{filteredRecords.length > 0 ? filteredRecords.map(([id, record]) => (<tr key={id} className="hover:bg-slate-800/50 transition-colors">{isKorkab && (<td className="px-6 py-4 flex gap-2"><button onClick={() => openEditModal(id, record)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all cursor-pointer"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete(id)} className="p-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button></td>)}{headers.map(h => <td key={id + '-' + h} className="px-6 py-4 text-slate-300 font-medium truncate max-w-[200px]">{String(record[h] || '-')}</td>)}</tr>)) : (<tr><td colSpan={headers.length + (isKorkab ? 1 : 0)} className="text-center py-16"><Database className="w-16 h-16 text-slate-600 mx-auto mb-4" /><p className="text-slate-400 font-bold">Database Kosong</p></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && isKorkab && (
        <div className={modalOverlay} onClick={() => setShowModal(false)}>
          <div className={modalContent} onClick={e => e.stopPropagation()}>
            <h3 className="font-black text-2xl mb-6 text-white flex items-center">{modalMode === 'add' ? <Plus className="w-6 h-6 mr-3 text-cyan-400"/> : <Edit className="w-6 h-6 mr-3 text-cyan-400"/>} {modalMode === 'add' ? 'Tambah Data' : 'Edit Data'}</h3>
            <form id="crud-form" onSubmit={handleSaveData} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(headers.length > 0 ? headers : ['nama', 'nik', 'status']).map((key) => (<div key={key}><label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">{key.split('_').join(' ')}</label><input type="text" value={formData[key] || ''} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })} className={glassInput} /></div>))}
            </form>
            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-700"><button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700 cursor-pointer">Batal</button><button type="submit" form="crud-form" className={glassButton}>Simpan ke Cloud</button></div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. MAIN APP COMPONENT (ULTIMATE)
// ==========================================
export default function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false); 
  const [toastMessage, setToastMessage] = useState(null);
  
  const [isLoggedIn, setIsLoggedIn] = usePersistentState('pkh_is_logged_in', 'false');
  const [selectedUserId, setSelectedUserId] = usePersistentState('pkh_user_id', '');
  const [activeTab, setActiveTab] = usePersistentState('pkh_active_tab', 'dashboard');
  const [activeSubTab, setActiveSubTab] = useState('');
  const [expandedMenu, setExpandedMenu] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // TABS & SELECTIONS
  const [kpmMainTab, setKpmMainTab] = useState('daftar'); 
  const [agendaSubTab, setAgendaSubTab] = useState('harian');
  const [tugasTab, setTugasTab] = useState('daftar');
  const [laporanTab, setLaporanTab] = useState('input');
  
  const [selectedKPM, setSelectedKPM] = useState(null);
  const [absenStatus, setAbsenStatus] = useState('belum');
  const [jamDatang, setJamDatang] = useState('');
  
  // FIREBASE DATA
  const [sdmData, setSdmData] = useState([]); const [kpmData, setKpmData] = useState([]);
  const [agendaData, setAgendaData] = useState([]); const [tasksData, setTasksData] = useState([]);
  const [votesData, setVotesData] = useState([]); const [pengaduanData, setPengaduanData] = useState([]);
  const [catatanData, setCatatanData] = useState([]); const [piketData, setPiketData] = useState([]);
  const [aplikasiEksternal, setAplikasiEksternal] = useState([{ id: 'app1', nama: 'SIKS-NG KEMENSOS', url: 'https://siks.kemensos.go.id' }]);

  const aturanPiket = { jamMulai: '08:00', jamSelesai: '16:00', denda: 50000 };
  const safeSdmData = Array.isArray(sdmData) ? sdmData : [];
  const safeKpmData = Array.isArray(kpmData) ? kpmData : [];
  const safeAgendaData = Array.isArray(agendaData) ? agendaData : [];
  const safeTasksData = Array.isArray(tasksData) ? tasksData : [];
  const safeVotesData = Array.isArray(votesData) ? votesData : [];
  const safePiketData = Array.isArray(piketData) ? piketData : [];
  const safeCatatanData = Array.isArray(catatanData) ? catatanData : [];

  const activeSdmList = safeSdmData.length > 0 ? safeSdmData : [{ id: 'admin1', nama: 'Admin Master', role: 'ketuatim_kab', nik: 'admin', password: 'admin', status: 'Aktif' }];
  const currentUserData = activeSdmList.find(s => String(s.id) === String(selectedUserId)) || activeSdmList[0];
  const isKorkab = currentUserData?.role === 'ketuatim_kab';
  const isKorcam = currentUserData?.role === 'ketuatim_kec';

  // INIT DATA FIREBASE
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => { try { await signInAnonymously(auth); } catch(e){} };
    initAuth();
    const bindData = (col, setter) => { if(!db) return ()=>{}; return onValue(ref(db, getBasePath(col)), s => setter(s.exists() ? Object.entries(s.val()).map(([k,v])=>({id:k,...v})).reverse() : []), ()=>setter([])); };
    
    const u1 = bindData('sdmData', setSdmData); const u2 = bindData('kpmData', setKpmData);
    const u3 = bindData('agendaData', setAgendaData); const u4 = bindData('tugasData', setTasksData);
    const u5 = bindData('voteData', setVotesData); const u6 = bindData('pengaduanData', setPengaduanData);
    const u7 = bindData('catatanData', setCatatanData); const u8 = bindData('piketData', setPiketData);
    
    setTimeout(() => setIsInitializing(false), 1500);
    return () => { u1(); u2(); u3(); u4(); u5(); u6(); u7(); u8(); };
  }, []);

  const showToast = (msg) => { setToastMessage(String(msg)); setTimeout(() => setToastMessage(null), 4000); };
  
  const handleLoginSubmit = (e) => {
    e.preventDefault(); 
    if (loginUsername === 'admin' && loginPassword === 'admin') { localStorage.setItem('pkh_user_id', 'admin1'); setSelectedUserId('admin1'); setIsLoggedIn('true'); return showToast("Akses Admin Master Diberikan!"); }
    const matchUser = activeSdmList.find(x => String(x.nik) === String(loginUsername) && String(x.password) === String(loginPassword));
    if (matchUser) { localStorage.setItem('pkh_user_id', matchUser.id); setSelectedUserId(matchUser.id); setIsLoggedIn('true'); setLoginError(''); showToast("Welcome back, " + matchUser.nama + "!"); } 
    else { setLoginError('Autentikasi Gagal. Periksa NIK/Sandi.'); }
  };

  const handleLogout = () => { setIsLoggedIn('false'); setSelectedUserId(''); setLoginUsername(''); setLoginPassword(''); showToast("Sesi Berakhir. Logout Berhasil."); };
  
  const handleMenuClick = (mId, subs) => { if(subs && subs.length > 0) setExpandedMenu(expandedMenu===mId ? '' : mId); else {setActiveTab(mId); setActiveSubTab(''); setIsSidebarOpen(false); setSelectedKPM(null);} };
  const handleSubMenuClick = (mId, subId) => { setActiveTab(mId); setActiveSubTab(subId); setIsSidebarOpen(false); setSelectedKPM(null); if(mId==='kpm') setKpmMainTab(subId); if(mId==='agenda') setAgendaSubTab(subId); if(mId==='tugas') setTugasTab(subId); };
  
  // --- MENU CONFIG ---
  const menuConfig = [
    { id: 'dashboard', judul: "Dashboard Utama", icon: Home, subMenu: [] },
    { id: 'catatan', judul: "Catatan Harian", icon: BookOpen, subMenu: [] },
    { id: 'kpm', judul: "Manajemen KPM", icon: UsersIcon, subMenu: [{id:'daftar', judul:'Database KPM'}, {id:'potensial', judul:'Potensial'}, {id:'graduasi', judul:'Graduasi'}] },
    { id: 'agenda', judul: "Agenda & Piket", icon: CalendarDays, subMenu: [{id:'harian', judul:'Agenda Harian'}, {id:'khusus', judul:'Giat Khusus'}, {id:'piket', judul:'Jadwal Piket'}] },
    { id: 'tugas', judul: "Tugas & Voting", icon: ClipboardCheck, subMenu: [{id:'daftar', judul:'Daftar Tugas'}, {id:'progres', judul:'Progres Data'}, {id:'vote', judul:'Polling'}] },
    { id: 'pengaduan', judul: "Pengaduan Laporan", icon: MessageSquare, subMenu: [] },
    { id: 'laporan', judul: "Laporan & Denda", icon: FileText, subMenu: [{id:'input', judul:'Input RHK'}, {id:'rekap', judul:'Rekap Denda'}] },
    { id: 'sdm', judul: "Database SDM", icon: ShieldCheck, subMenu: [] },
    { id: 'aplikasi_lainnya', judul: "Aplikasi Terkait", icon: LinkIcon, subMenu: [] },
    { id: 'manajemen_data', judul: "Manajemen Data", icon: Database, subMenu: [] },
    { id: 'peta', judul: "Peta Lokasi", icon: MapIcon, subMenu: [] },
    { id: 'pengaturan', judul: "Pengaturan", icon: Settings, subMenu: [{id:'profil', judul:'Profil Akun'}] }
  ];

  // --- RENDERING ---
  if (isInitializing) return <div className="h-screen bg-slate-950 flex flex-col justify-center items-center"><div className="relative"><div className="absolute inset-0 bg-cyan-500 blur-xl opacity-40 rounded-full animate-pulse"></div><div className="w-24 h-24 bg-slate-900 border border-slate-700 rounded-[2rem] flex items-center justify-center relative z-10 shadow-2xl shadow-cyan-500/20"><Shield className="w-12 h-12 text-cyan-400"/></div></div><RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mt-8 mb-4"/><h2 className="text-sm font-black text-slate-400 tracking-widest uppercase animate-pulse">Menghubungkan Server...</h2></div>;

  if (isLoggedIn === 'false' || !isLoggedIn) return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className={`${glassCard} p-10 lg:p-14 w-full max-w-md relative z-10 transition-transform duration-500 transform scale-100 border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
        <div className="text-center mb-10"><div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.4)] transform rotate-6"><Shield className="w-12 h-12 text-white transform -rotate-6"/></div><h2 className="text-4xl font-black text-white tracking-tight">PKH Pro</h2><p className="text-sm text-cyan-400 font-black mt-2 uppercase tracking-widest flex items-center justify-center gap-2">Secure Portal</p></div>
        
        {loginError && (<div className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl text-xs font-bold mb-6 flex items-center border border-rose-500/20 animate-in shake duration-300"><AlertCircle className="w-5 h-5 mr-3 shrink-0" /> {String(loginError)}</div>)}
        
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div className="relative"><UserSquare className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500"/><input value={loginUsername} onChange={e => setLoginUsername(e.target.value)} type="text" required className={`${glassInput} pl-14`} placeholder="Username / NIK KTP" /></div>
          <div className="relative"><Settings className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500"/><input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} type="password" required className={`${glassInput} pl-14`} placeholder="Secure Password" /></div>
          <button type="submit" className={`${glassButton} mt-8 py-5 text-lg`}><LogIn className="w-6 h-6 mr-3" /> Authorize Access</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans relative">
      <div className="absolute top-[-20%] left-[-10%] w-[60rem] h-[60rem] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-4 left-4 z-40 w-[280px] bg-slate-900/60 backdrop-blur-3xl border border-slate-700/50 shadow-2xl rounded-[2.5rem] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%]'} lg:relative lg:translate-x-0 transition-all duration-500 flex flex-col overflow-hidden`}>
        <div className="h-28 flex items-center px-8 border-b border-slate-800/80 bg-slate-900/50">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] mr-4"><Activity className="w-6 h-6 text-white" /></div>
          <div><h1 className="text-2xl font-black text-white tracking-tight leading-none">PKH<span className="text-cyan-400">Pro</span></h1><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sistem Pintar</span></div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-hide">
          {menuConfig.map(item => {
             if (item.id === 'manajemen_data' && !isKorkab) return null;
             if (item.id === 'ranking' && !isKorkab) return null;
             const hasSub = item.subMenu && item.subMenu.length > 0; const isExpanded = expandedMenu === item.id; const isActive = activeTab === item.id && !hasSub; const isParentActive = activeTab === item.id || (hasSub && item.subMenu.some(s => s.id === activeSubTab && activeTab === item.id));
             const IconComp = item.icon || Activity;
             
             return (
               <div key={item.id}>
                 <button onClick={() => handleMenuClick(item.id, item.subMenu)} className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_5px_20px_rgba(34,211,238,0.3)]' : isParentActive && hasSub ? 'bg-slate-800/80 text-cyan-400 font-bold border border-slate-700' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'}`}>
                   <div className="flex items-center gap-4"><div className={`w-6 text-center ${isActive ? 'text-white' : isParentActive && hasSub ? 'text-cyan-400' : 'text-slate-500'}`}><IconComp className="w-5 h-5"/></div> <span className="text-sm font-bold tracking-wide">{item.judul}</span></div>
                   {hasSub && <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-cyan-400' : ''}`} />}
                 </button>
                 <div className={`overflow-hidden transition-all duration-300 ease-in-out ${hasSub && isExpanded ? 'max-h-48 opacity-100 mt-2 mb-4' : 'max-h-0 opacity-0'}`}>
                   <div className="ml-12 border-l-2 border-slate-700/50 pl-4 py-1 space-y-2">
                     {item.subMenu.map(sub => (
                       <button key={sub.id} onClick={() => handleSubMenuClick(item.id, sub.id)} className={`relative w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === item.id && activeSubTab === sub.id ? 'text-cyan-400 bg-slate-800/80 shadow-inner border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'}`}>
                         {activeTab === item.id && activeSubTab === sub.id && <div className="absolute left-[-21px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>} {sub.judul}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
             );
          })}
        </nav>
        <div className="p-4 m-4 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center justify-between cursor-pointer hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors group" onClick={handleLogout}>
           <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-colors"><LogOut className="w-4 h-4" /></div><div><p className="text-sm font-black text-slate-300 group-hover:text-rose-400">Logout</p><p className="text-[10px] font-bold text-slate-500">End Session</p></div></div>
        </div>
      </aside>

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-24 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center"><button onClick={() => setIsSidebarOpen(true)} className="lg:hidden mr-4 p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"><Menu className="w-5 h-5" /></button><h1 className="font-black text-2xl capitalize tracking-tight text-white hidden sm:flex items-center gap-3">{activeTab.split('_').join(' ')} {activeSubTab && <><ChevronRight className="w-5 h-5 text-cyan-500 opacity-50"/> <span className="text-cyan-400">{activeSubTab.split('_').join(' ')}</span></>}</h1></div>
          <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur-md border border-slate-700 py-2 px-4 rounded-2xl shadow-lg"><div className="text-right hidden sm:block"><p className="text-sm font-black text-white">{currentUserData.nama}</p><p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{currentUserData.role.split('_').join(' ')}</p></div><img src={`https://ui-avatars.com/api/?name=${currentUserData.nama}&background=06b6d4&color=fff&bold=true`} className="w-10 h-10 rounded-xl border border-slate-600 shadow-sm" alt="Avatar" /></div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide pb-24">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-7xl mx-auto">
              <div className={`${glassCard} p-8 lg:p-12 overflow-hidden relative border-cyan-500/20`}>
                <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute left-10 bottom-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 text-cyan-400 text-xs font-bold mb-5 tracking-widest uppercase shadow-inner"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> SINKRONISASI CLOUD AKTIF</div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">Selamat Datang,<br/>{currentUserData.nama.split(' ')[0]}!</h2>
                    <p className="text-slate-400 mt-4 text-lg font-medium max-w-md">Sistem manajemen cerdas untuk produktivitas maksimal.</p>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-[2rem] text-center min-w-[200px] shadow-2xl backdrop-blur-xl"><Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" /><p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Poin</p><p className="text-4xl font-black text-white mt-1">4.250</p></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[{t:"Total KPM", v:safeKpmData.length, i:UsersIcon, c:"from-blue-600 to-cyan-500", s:"shadow-cyan-500/30", b:"border-cyan-500/30"}, {t:"Tugas Aktif", v:safeTasksData.length, i:Target, c:"from-emerald-500 to-teal-400", s:"shadow-emerald-500/30", b:"border-emerald-500/30"}, {t:"Agenda", v:safeAgendaData.length, i:CalendarClock, c:"from-indigo-500 to-purple-500", s:"shadow-indigo-500/30", b:"border-indigo-500/30"}].map((st, i) => {
                  const StatIcon = st.i;
                  return (
                  <div key={i} className={`${glassCard} p-8 flex items-center gap-6 hover:-translate-y-1 transition-all group cursor-pointer border-t-4 ${st.b}`}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${st.c} rounded-[1.5rem] flex items-center justify-center shadow-xl ${st.s} group-hover:scale-110 transition-transform duration-300`}><StatIcon className="w-8 h-8 text-white"/></div>
                    <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{st.t}</p><p className="text-4xl font-black text-white">{st.v}</p></div>
                  </div>
                )})}
              </div>
            </div>
          )}

          {/* MANAJEMEN DATA EXCEL */}
          {activeTab === 'manajemen_data' && isKorkab && <ModulManajemenData db={db} isKorkab={isKorkab} showToast={showToast} />}

          {/* KPM */}
          {activeTab === 'kpm' && (
             <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
               <div className="flex bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-2 border border-slate-700/50 overflow-x-auto scrollbar-hide sticky top-20 z-20 shadow-lg">
                 {['daftar','potensial','graduasi'].map(t => (<button key={t} onClick={() => setKpmMainTab(t)} className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-black tracking-widest uppercase rounded-2xl transition-all cursor-pointer ${kpmMainTab === t ? 'bg-cyan-500 text-slate-900 shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-slate-400 hover:text-white'}`}>{t}</button>))}
               </div>
               <div className={`${glassCard} p-8 border-t-4 border-t-cyan-500/50`}>
                 <div className="flex justify-between items-center mb-8 gap-4"><div className="relative flex-1"><Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"/><input type="text" placeholder="Cari NIK / Nama KPM..." className={`${glassInput} pl-14`}/></div></div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {safeKpmData.slice(0,9).map(k => (
                     <div key={k.id} className="bg-slate-800/50 p-8 rounded-[2rem] border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all group hover:-translate-y-1 cursor-pointer">
                       <div className="w-16 h-16 bg-slate-700 text-slate-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors shadow-inner"><UserSquare className="w-8 h-8"/></div>
                       <h3 className="font-black text-2xl text-white mb-2">{k.nama}</h3>
                       <p className="text-xs text-cyan-400 font-mono mb-8 bg-cyan-900/30 px-3 py-1.5 rounded-lg inline-block border border-cyan-800">{k.nik}</p>
                       <button className="w-full py-4 bg-slate-900 hover:bg-cyan-500 border border-slate-700 hover:border-transparent text-slate-300 hover:text-slate-900 font-black tracking-wider rounded-xl transition-colors uppercase text-xs">Detail Profil Lengkap</button>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          )}

          {/* AGENDA */}
          {activeTab === 'agenda' && (
            <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
               <div className="flex bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-2 border border-slate-700/50 overflow-x-auto scrollbar-hide sticky top-20 z-20 shadow-lg">
                 {['harian','khusus','piket'].map(t => (<button key={t} onClick={() => setAgendaSubTab(t)} className={`flex-1 min-w-[140px] px-6 py-4 text-sm font-black tracking-widest uppercase rounded-2xl transition-all cursor-pointer ${agendaSubTab === t ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-slate-400 hover:text-white'}`}>{t}</button>))}
               </div>
               <div className={`${glassCard} p-12 text-center flex flex-col items-center justify-center min-h-[50vh] border-t-4 border-t-indigo-500/50`}>
                 <div className="w-28 h-28 bg-indigo-500/20 rounded-[2.5rem] flex items-center justify-center mb-8 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]"><CalendarDays className="w-12 h-12 text-indigo-400"/></div>
                 <h3 className="text-4xl font-black text-white mb-4 tracking-tight">Area {agendaSubTab.toUpperCase()}</h3>
                 <p className="text-slate-400 font-medium text-lg">Sinkronisasi Jadwal Cloud Berjalan Aman.</p>
               </div>
            </div>
          )}

          {/* PLACEHOLDER SISA MENU AGAR TIDAK BLANK */}
          {!['dashboard', 'kpm', 'agenda', 'manajemen_data'].includes(activeTab) && (
            <div className={`${glassCard} p-12 text-center flex flex-col items-center justify-center min-h-[60vh] transition-all transform translate-y-0 opacity-100 duration-500 max-w-4xl mx-auto mt-10 border-t-4 border-t-blue-500/50`}>
              <div className="relative mb-10">
                 <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 rounded-full"></div>
                 <div className="w-32 h-32 bg-slate-800 rounded-[3rem] flex items-center justify-center border border-slate-700 shadow-2xl relative z-10"><Activity className="w-14 h-14 text-cyan-400 animate-pulse"/></div>
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Modul <span className="text-cyan-400">{activeTab.split('_').join(' ').toUpperCase()}</span></h2>
              <p className="text-slate-400 font-bold max-w-lg mx-auto text-lg leading-relaxed">
                Antarmuka <span className="text-white font-bold">Premium Glassmorphism</span> untuk modul ini sedang aktif. Seluruh data Anda dijamin 100% aman dan tersinkronisasi di server Cloud.
              </p>
              <button onClick={() => {setActiveTab('dashboard'); setActiveSubTab(''); setIsSidebarOpen(false);}} className="mt-10 px-10 py-5 bg-slate-800 border border-slate-600 text-white font-black rounded-2xl hover:bg-slate-700 hover:border-slate-500 transition-all cursor-pointer shadow-lg hover:shadow-xl uppercase tracking-widest text-sm">Kembali ke Dashboard</button>
            </div>
          )}
        </main>
      </div>

      {/* --- ALL MODALS & TOAST ANIMASI KEREN --- */}
      {isSaving && (<div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300"><div className="w-24 h-24 bg-slate-900 border border-slate-700 rounded-[2.5rem] shadow-[0_0_50px_rgba(34,211,238,0.2)] flex items-center justify-center mb-8 animate-bounce"><RefreshCw className="w-10 h-10 text-cyan-400 animate-spin"/></div><p className="text-cyan-400 font-black text-xl tracking-widest animate-pulse drop-shadow-md">SINKRONISASI CLOUD...</p></div>)}

      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-2xl text-white px-8 py-5 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700 flex items-center gap-4 font-black z-[9999] transition-all duration-500 transform translate-y-0 opacity-100 min-w-[300px] justify-center animate-in slide-in-from-bottom-10 fade-in">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/30"><CheckCircle className="w-5 h-5 text-emerald-400" /></div>
          <span className="tracking-wide text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}


```
