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
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
        <Shield className="w-64 h-64 absolute -right-10 -top-10 opacity-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Halo, {safeName}!</h2>
          <p className="text-blue-100 mt-3 text-lg font-medium">{isKorkab ? 'Admin Kabupaten' : isKorcam ? `Ketua Tim Kec. ${String(currentUserData?.kecamatan || '')}` : `SDM Kec. ${String(currentUserData?.kecamatan || '')}`}</p>
        </div>
        {isKorkab && (
          <div className="mt-8 flex justify-between items-end border-t border-blue-400/30 pt-6 relative z-10">
            <div>
              <p className="text-xs text-blue-200 uppercase font-black tracking-widest">Total Poin Kinerja</p>
              <p className="text-4xl font-black mt-2">4.250 <span className="text-lg font-medium">Pts</span></p>
            </div>
            <Trophy className="w-14 h-14 text-yellow-400 drop-shadow-xl" />
          </div>
        )}
      </div>

      {/* Grid Data KPM & Piket */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(isKorkab || isKorcam) && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Total KPM Wilayah</p>
            <p className="text-5xl font-black text-gray-800">{wTotalKPM}</p>
          </div>
        )}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">KPM Dampingan</p>
          <p className="text-5xl font-black text-gray-800">{mTotalKPM}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center text-lg"><CalendarClock className="w-6 h-6 mr-3 text-emerald-500"/> Jadwal Piket Anda</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {myPiket.length > 0 ? myPiket.map((p, i) => (
              <div key={i} onClick={() => goToMenu('agenda', 'piket')} className={`p-5 rounded-2xl min-w-[160px] cursor-pointer border transition-all hover:-translate-y-1 ${String(p.status) === 'today' ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-blue-50 border-blue-100'}`}>
                <p className={`text-xs font-black uppercase tracking-wider ${String(p.status) === 'today' ? 'text-emerald-600' : 'text-blue-600'}`}>{String(p.status) === 'today' ? 'HARI INI' : `PIKET ${i+1}`}</p>
                <p className="text-sm font-bold text-gray-800 mt-2">{String(p.tgl || '')}</p>
              </div>
            )) : <p className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded-xl w-full text-center">Tidak ada jadwal piket.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
