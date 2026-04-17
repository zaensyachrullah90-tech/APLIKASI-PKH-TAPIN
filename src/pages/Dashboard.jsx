import React from 'react';
import { Shield, Trophy, CalendarClock, Activity, UserCheck, ChevronRight, CalendarDays, Timer, ClipboardCheck, BarChart2 } from 'lucide-react';

export default function Dashboard({ currentUserData, isKorkab, isKorcam, safeKpmData, safePiketData, safeAgendaData, safeTasksData, safeVotesData, goToMenu }) {
  const safeName = String(currentUserData?.nama || '');
  const wTotalKPM = safeKpmData.filter(k => String(k.type) !== 'potensial' && String(k.type) !== 'graduasi').length || 0;
  const mTotalKPM = safeKpmData.filter(k => String(k.pendampingId) === safeName && String(k.type) !== 'potensial' && String(k.type) !== 'graduasi').length || 0;
  const piketToday = safePiketData.find(p => String(p.status) === 'today');

  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      {/* Banner Utama Premium */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
        <Shield className="w-64 h-64 absolute -right-10 -top-10 opacity-10" />
        <h2 className="text-3xl font-black relative z-10">Halo, {safeName}!</h2>
        <p className="text-blue-100 mt-2 text-lg relative z-10">
          {isKorkab ? 'Admin Kabupaten' : isKorcam ? `Ketua Tim Kec. ${currentUserData?.kecamatan}` : `SDM Kec. ${currentUserData?.kecamatan}`}
        </p>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
           <p className="text-[10px] font-black text-blue-500 uppercase mb-2">Total KPM</p>
           <h3 className="text-3xl font-black text-slate-800">{wTotalKPM}</h3>
        </div>
        {/* Tambahkan card lainnya di sini sesuai kode asli Anda */}
      </div>
    </div>
  );
}
