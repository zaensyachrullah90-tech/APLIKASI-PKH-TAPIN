import React from 'react';
import { Shield, Trophy, CalendarClock, Activity, UserCheck, ChevronRight, AlertTriangle, Briefcase, CalendarDays, Timer, ClipboardCheck, BarChart2 } from 'lucide-react';

export default function Dashboard({ safeKpmData, currentUserData, safePiketData, safeAgendaData, safeTasksData, safeVotesData, isKorkab, isKorcam, goToMenu, getFilteredAgenda }) {
  const wTotalKPM = safeKpmData.filter(k => String(k.type) !== 'potensial' && String(k.type) !== 'graduasi').length || 0; 
  const mTotalKPM = safeKpmData.filter(k => String(k.pendampingId) === String(currentUserData?.nama) && String(k.type) !== 'potensial' && String(k.type) !== 'graduasi').length || 0;
  const safeName = String(currentUserData?.nama || ''); 
  const myPiket = safePiketData.filter(p => String(p.nama || '').includes(safeName.split(' ')[0]));
  const piketToday = safePiketData.find(p => String(p.status) === 'today'); 
  const myHarian = getFilteredAgenda(safeAgendaData).filter(a => String(a.type) === 'harian').length || 0;
  const myDeadline = safeAgendaData.filter(a => String(a.type) === 'deadline' && (isKorkab || isKorcam || String(a.pic) === safeName || String(a.pic) === 'Semua SDM')).length || 0;

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      {/* Header Dashboard Mewah */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
        <Shield className="w-64 h-64 absolute -right-10 -top-10 opacity-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Halo, {safeName}!</h2>
            <p className="text-blue-100 mt-3 text-lg font-medium">{isKorkab ? 'Admin Kabupaten' : isKorcam ? `Ketua Tim Kec. ${String(currentUserData?.kecamatan || '')}` : `SDM Kec. ${String(currentUserData?.kecamatan || '')}`}</p>
          </div>
          {isKorkab && (
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 text-center min-w-[200px] shadow-xl">
              <Trophy className="w-10 h-10 text-yellow-300 mx-auto mb-2 drop-shadow-lg" />
              <p className="text-xs font-bold uppercase tracking-widest text-blue-100">Poin Kinerja</p>
              <p className="text-3xl font-black mt-1">4.250 <span className="text-sm font-medium">Pts</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Grid Statistik KPM & Jadwal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(isKorkab || isKorcam) && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">KPM Wilayah</p>
            <p className="text-5xl font-black text-gray-800">{wTotalKPM}</p>
          </div>
        )}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">KPM Dampingan</p>
          <p className="text-5xl font-black text-gray-800">{mTotalKPM}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg"><CalendarClock className="w-6 h-6 mr-3 text-emerald-500"/> Jadwal Piket Anda</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {myPiket.length > 0 ? myPiket.map((p, i) => (
              <div key={i} onClick={() => goToMenu('agenda', 'piket')} className={`p-5 rounded-2xl min-w-[160px] cursor-pointer border transition-all hover:scale-105 ${String(p.status) === 'today' ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-blue-50 border-blue-100'}`}>
                <p className={`text-xs font-black uppercase tracking-wider ${String(p.status) === 'today' ? 'text-emerald-600' : 'text-blue-600'}`}>{String(p.status) === 'today' ? 'HARI INI' : `PIKET ${i+1}`}</p>
                <p className="text-sm font-bold text-gray-800 mt-2">{String(p.tgl || '')}</p>
              </div>
            )) : <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 w-full text-center">Tidak ada jadwal piket bulan ini.</p>}
          </div>
        </div>
      </div>

      {/* Pusat Informasi Live */}
      <h3 className="font-black text-gray-800 mt-10 mb-4 flex items-center text-2xl"><Activity className="w-8 h-8 mr-3 text-indigo-600"/> Live Database</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-emerald-50 rounded-3xl shadow-sm border border-emerald-200 p-6 flex justify-between items-center cursor-pointer hover:bg-emerald-100 transition-colors md:col-span-2 lg:col-span-3" onClick={() => goToMenu('agenda', 'piket')}>
          <div className="flex items-center">
            <div className="bg-emerald-500 p-4 rounded-2xl mr-5 shadow-sm"><UserCheck className="w-7 h-7 text-white" /></div>
            <div><p className="text-xs font-black text-emerald-700 uppercase mb-1.5 tracking-wider">Petugas Piket Hari Ini</p><p className="text-xl font-black text-gray-800">{piketToday ? String(piketToday.nama || '') : 'Tidak Ada / Libur'}</p></div>
          </div>
          <ChevronRight className="w-7 h-7 text-emerald-600" />
        </div>

        <div onClick={() => goToMenu('agenda', 'harian')} className="bg-white p-6 rounded-3xl shadow-sm border-l-4 border-blue-500 cursor-pointer flex items-center justify-between hover:shadow-md transition-all">
          <div className="flex items-center"><CalendarDays className="w-10 h-10 text-blue-500 mr-4" /><div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Agenda Aktif</p><p className="text-2xl font-black text-gray-800 mt-1">{myHarian}</p></div></div>
        </div>
        
        <div onClick={() => goToMenu('tugas', 'progres')} className="bg-white border-l-4 border-indigo-500 p-6 rounded-3xl cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center"><ClipboardCheck className="w-10 h-10 text-indigo-500 mr-4" /><div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tugas Berjalan</p><p className="text-2xl font-black text-gray-800 mt-1">{safeTasksData.length}</p></div></div>
        </div>

        <div onClick={() => goToMenu('tugas', 'vote')} className="bg-white border-l-4 border-purple-500 p-6 rounded-3xl cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center"><BarChart2 className="w-10 h-10 text-purple-500 mr-4" /><div><p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Polling Aktif</p><p className="text-2xl font-black text-gray-800 mt-1">{safeVotesData.length}</p></div></div>
        </div>
      </div>
    </div>
  );
}