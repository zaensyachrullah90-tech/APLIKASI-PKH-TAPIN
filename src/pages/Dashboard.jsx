import React from 'react';
import { Shield, Trophy, CalendarClock, Activity, UserCheck, ChevronRight, AlertTriangle, CalendarDays, Briefcase, Timer, ClipboardCheck, BarChart2 } from 'lucide-react';

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
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2rem] p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
        <Shield className="w-64 h-64 absolute -right-10 -top-10 opacity-10" />
        <h2 className="text-3xl lg:text-4xl font-black relative z-10">Halo, {safeName}!</h2>
        <p className="text-blue-100 mt-2 text-lg relative z-10">{isKorkab ? 'Admin Kabupaten' : isKorcam ? `Ketua Tim Kec. ${String(currentUserData?.kecamatan || '')}` : `SDM Kec. ${String(currentUserData?.kecamatan || '')}`}</p>
        {isKorkab && (
          <div className="mt-8 flex justify-between items-end border-t border-blue-500/50 pt-6 relative z-10">
            <div>
              <p className="text-xs text-blue-200 uppercase font-bold">Total Poin Kinerja</p>
              <p className="text-4xl font-black mt-2">4.250 Pts</p>
            </div>
            <Trophy className="w-12 h-12 text-yellow-300 drop-shadow-xl" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {(isKorkab || isKorcam) && (
          <div className="bg-white rounded-3xl shadow-sm border p-6">
            <p className="text-[10px] font-black text-blue-500 uppercase mb-2">Total KPM Wilayah</p>
            <p className="text-4xl font-black text-gray-800">{wTotalKPM}</p>
          </div>
        )}
        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <p className="text-[10px] font-black text-gray-500 uppercase mb-2">KPM Dampingan</p>
          <p className="text-4xl font-black text-gray-800">{mTotalKPM}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center"><CalendarClock className="w-5 h-5 mr-2 text-green-600"/> Jadwal Piket Anda</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {myPiket.length > 0 ? myPiket.map((p, i) => (
              <div key={i} onClick={() => goToMenu('agenda', 'piket')} className={`p-4 rounded-xl min-w-[140px] cursor-pointer border ${String(p.status) === 'today' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-100'}`}>
                <p className={`text-xs font-black ${String(p.status) === 'today' ? 'text-green-600' : 'text-blue-600'}`}>{String(p.status) === 'today' ? 'HARI INI' : `PIKET ${i+1}`}</p>
                <p className="text-sm font-bold text-gray-800 mt-2">{String(p.tgl || '')}</p>
              </div>
            )) : <p className="text-sm text-gray-500 italic p-2">Tidak ada jadwal piket.</p>}
          </div>
        </div>
      </div>

      <h3 className="font-bold text-gray-800 mt-8 mb-4 flex items-center text-xl"><Activity className="w-6 h-6 mr-2 text-indigo-600"/> Pusat Informasi Database</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-green-50 rounded-3xl shadow-sm border border-green-200 p-6 flex justify-between items-center cursor-pointer hover:bg-green-100 transition-colors md:col-span-2 lg:col-span-3" onClick={() => goToMenu('agenda', 'piket')}>
          <div className="flex items-center">
            <div className="bg-green-500 p-4 rounded-2xl mr-5 shadow-sm"><UserCheck className="w-7 h-7 text-white" /></div>
            <div><p className="text-xs font-black text-green-700 uppercase mb-1.5">Petugas Piket Hari Ini</p><p className="text-lg font-bold text-gray-800">{piketToday ? String(piketToday.nama || '') : 'Tidak Ada'}</p></div>
          </div>
          <ChevronRight className="w-7 h-7 text-green-600" />
        </div>

        <div className="bg-red-50 rounded-3xl shadow-sm border p-6 cursor-pointer hover:bg-red-100 flex flex-col justify-between" onClick={() => goToMenu('agenda', 'khusus')}>
          <h3 className="font-bold text-red-800 mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2" /> Kegiatan Khusus / Ekstra</h3>
          {safeAgendaData.filter(a => String(a.type) === 'khusus').slice(0,1).map(k => (
            <div key={k.id} className="bg-white p-4 rounded-xl border border-red-100">
              <p className="text-sm font-bold text-gray-800 break-words">{String(k.title || '')}</p>
              <p className="text-xs text-red-600 mt-2"><CalendarDays className="w-3 h-3 inline mr-1"/>{String(k.date || '')}</p>
            </div>
          ))}
        </div>

        <div className="bg-indigo-50 rounded-3xl shadow-sm border p-6 cursor-pointer hover:bg-indigo-100 flex flex-col justify-between" onClick={() => goToMenu('agenda', 'ketuatim')}>
          <h3 className="font-bold text-indigo-800 mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2" /> Agenda Ketua Tim</h3>
          <div className="space-y-3">
            {safeAgendaData.filter(a => String(a.type) === 'ketuatim').slice(0,2).map(a => (
              <div key={a.id} className="bg-white p-3 rounded-xl border border-indigo-100">
                <p className="text-sm font-bold text-gray-800">{String(a.title || '')}</p>
                <p className="text-[10px] text-indigo-600 mt-1.5"><CalendarDays className="w-3 h-3 inline mr-1"/>{String(a.date || '')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4 lg:gap-6">
          <div onClick={() => goToMenu('agenda', 'harian')} className="bg-white p-5 rounded-3xl shadow-sm border-l-4 border-blue-500 cursor-pointer flex items-center justify-between">
            <div className="flex items-center"><CalendarDays className="w-8 h-8 text-blue-500 mr-4" /><div><p className="text-[10px] text-gray-500 uppercase font-black">Agenda Aktif</p><p className="text-base font-bold text-gray-800 mt-1">{myHarian} Kegiatan</p></div></div>
            <ChevronRight className="w-5 h-5 text-gray-300"/>
          </div>
          <div onClick={() => goToMenu('agenda', 'deadline')} className="bg-white p-5 rounded-3xl shadow-sm border-l-4 border-orange-500 cursor-pointer flex items-center justify-between">
            <div className="flex items-center"><Timer className="w-8 h-8 text-orange-500 mr-4" /><div><p className="text-[10px] text-gray-500 uppercase font-black">Deadline Tugas</p><p className="text-base font-bold text-gray-800 mt-1">{myDeadline} Tugas</p></div></div>
            <ChevronRight className="w-5 h-5 text-gray-300"/>
          </div>
        </div>
        
        <div onClick={() => goToMenu('tugas', 'progres')} className="bg-white border p-6 rounded-3xl cursor-pointer flex items-center justify-between shadow-sm md:col-span-2 lg:col-span-1">
          <div className="flex items-center"><div className="bg-indigo-50 p-4 rounded-xl mr-5"><ClipboardCheck className="w-8 h-8 text-indigo-600" /></div><div><p className="text-[10px] font-black text-indigo-500 uppercase mb-1">Tugas Aktif</p><p className="text-lg font-bold text-gray-800">{safeTasksData.length} Berjalan</p></div></div>
          <ChevronRight className="w-6 h-6 text-gray-300" />
        </div>

        <div onClick={() => goToMenu('tugas', 'vote')} className="bg-white border p-6 rounded-3xl cursor-pointer flex items-center justify-between shadow-sm md:col-span-2 lg:col-span-2">
          <div className="flex items-center"><div className="bg-purple-50 p-4 rounded-xl mr-5"><BarChart2 className="w-8 h-8 text-purple-600" /></div><div><p className="text-[10px] font-black text-purple-500 uppercase mb-1">Polling Aktif</p><p className="text-lg font-bold text-gray-800">{safeVotesData.length} Polling</p></div></div>
          <ChevronRight className="w-6 h-6 text-gray-300" />
        </div>
      </div>
    </div>
  );
}
