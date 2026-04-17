import React from 'react';
import { Plus, CalendarDays, MapPin, CheckCircle, Trash2, Timer, CalendarClock, RefreshCw, CalendarOff, Clock } from 'lucide-react';

export default function AgendaPiket({ agendaSubTab, setAgendaSubTab, safeAgendaData, getFilteredAgenda, isKorkab, isKorcam, setAgendaTypeToEdit, setShowAgendaModal, dbUpdate, dbDelete, selectedAgendaCategory, setSelectedAgendaCategory, handleGeneratePiketReal, setShowLiburModal, aturanPiket, absenStatus, setAbsenStatus, jamDatang, setJamDatang, denda, setDenda, showToast, safePiketData, setShowTukarModal, showTukarModal, getCurrentTime }) {
  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="flex bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-gray-200 overflow-x-auto scrollbar-hide">
        <button onClick={() => setAgendaSubTab('harian')} className={`flex-none px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'harian' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>AGENDA HARIAN</button>
        <button onClick={() => setAgendaSubTab('khusus')} className={`flex-none px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'khusus' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>GIAT KHUSUS</button>
        <button onClick={() => setAgendaSubTab('piket')} className={`flex-none px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'piket' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>JADWAL PIKET</button>
      </div>

      {agendaSubTab === 'harian' && (
        <div className="space-y-6">
          <button onClick={() => { setAgendaTypeToEdit('harian'); setShowAgendaModal(true); }} className="w-full py-5 bg-white border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors rounded-3xl font-black flex items-center justify-center text-lg cursor-pointer"><Plus className="w-6 h-6 mr-3" /> Tambah Agenda Harian</button>
        </div>
      )}

      {agendaSubTab === 'piket' && (
        <div className="space-y-6">
          <div className="bg-white border-2 border-emerald-400 p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <Clock className="w-64 h-64 text-emerald-500 absolute -right-10 -top-10 opacity-5" />
            <h3 className="font-black text-gray-800 mb-4 flex items-center text-3xl relative z-10"><Clock className="w-10 h-10 mr-4 text-emerald-600" /> Absen Piket Kantor</h3>
            <p className="text-gray-600 mb-8 font-medium text-lg relative z-10">Aturan Jam Piket: {aturanPiket.jamMulai} - {aturanPiket.jamSelesai} WIB</p>
            {absenStatus === 'belum' && (
              <button onClick={() => { setAbsenStatus('datang'); setJamDatang(getCurrentTime() + ' WIB'); showToast("Berhasil Absen Datang!"); }} className="w-full md:w-1/2 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer relative z-10">KLIK DATANG PIKET</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
