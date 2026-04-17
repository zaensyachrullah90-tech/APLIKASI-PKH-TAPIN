import React from 'react';
import { Plus, CalendarDays, MapPin, CheckCircle, Trash2, Timer, CalendarClock, RefreshCw, CalendarOff, Clock, ArrowRightLeft } from 'lucide-react';

export default function AgendaPiket({ 
  agendaSubTab, setAgendaSubTab, safeAgendaData, getFilteredAgenda, isKorkab, isKorcam, 
  setAgendaTypeToEdit, setShowAgendaModal, dbUpdate, dbDelete, selectedAgendaCategory, 
  setSelectedAgendaCategory, handleGeneratePiketReal, setShowLiburModal, aturanPiket, 
  absenStatus, setAbsenStatus, jamDatang, setJamDatang, denda, setDenda, showToast, 
  safePiketData, setShowTukarModal, showTukarModal, getCurrentTime 
}) {
  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="flex bg-white rounded-2xl p-2 shadow-sm border overflow-x-auto scrollbar-hide">
        <button onClick={() => setAgendaSubTab('harian')} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${agendaSubTab === 'harian' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>Agenda Harian</button>
        <button onClick={() => setAgendaSubTab('khusus')} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${agendaSubTab === 'khusus' ? 'bg-red-50 text-red-700' : 'text-gray-500'}`}>Giat Khusus</button>
        {(isKorkab || isKorcam) && <button onClick={() => setAgendaSubTab('ketuatim')} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${agendaSubTab === 'ketuatim' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}>Ketua Tim</button>}
        <button onClick={() => setAgendaSubTab('piket')} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${agendaSubTab === 'piket' ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}>Jadwal Piket</button>
        <button onClick={() => setAgendaSubTab('deadline')} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${agendaSubTab === 'deadline' ? 'bg-orange-100 text-orange-700' : 'text-gray-500'}`}>Deadline</button>
        {isKorkab && <button onClick={() => { setAgendaSubTab('jadwal'); setSelectedAgendaCategory(null); }} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${agendaSubTab === 'jadwal' ? 'bg-blue-100 text-blue-800' : 'text-gray-500'}`}>Jadwal Agenda</button>}
      </div>

      {agendaSubTab === 'harian' && (
        <div className="space-y-5">
          <button onClick={() => { setAgendaTypeToEdit('harian'); setShowAgendaModal(true); }} className="w-full py-4 bg-white border-2 border-dashed text-blue-600 rounded-3xl font-bold flex items-center justify-center text-lg cursor-pointer"><Plus className="w-6 h-6 mr-2" /> Tambah Agenda Harian</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredAgenda(safeAgendaData.filter(a => String(a.type) === 'harian')).map((agenda) => (
              <div key={agenda.id} className="bg-white p-6 rounded-3xl shadow-sm border-t-4 border-blue-500 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-gray-800 text-lg mb-3">{String(agenda.title || '')}</h4>
                  <div className="space-y-2"><p className="text-sm text-gray-600 flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-blue-500" /> {String(agenda.date || '')}, {String(agenda.time || '')}</p><p className="text-sm text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" /> {String(agenda.loc || '')}</p></div>
                </div>
                {isKorkab && (<div className="mt-5 pt-4 border-t"><button onClick={async () => { await dbUpdate('agendaData', agenda.id, { supervisi: !agenda.supervisi }); }} className={`w-full text-xs py-2.5 rounded-xl font-bold border flex items-center justify-center cursor-pointer ${agenda.supervisi ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600'}`}><CheckCircle className="w-4 h-4 mr-2" />{agenda.supervisi ? 'Telah Disupervisi' : 'Beri Status Supervisi'}</button></div>)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Piket Logic */}
      {agendaSubTab === 'piket' && (
        <div className="space-y-6">
          {(isKorkab || isKorcam) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <button onClick={handleGeneratePiketReal} className="bg-blue-600 text-white p-5 rounded-2xl font-bold shadow-lg hover:bg-blue-700 uppercase cursor-pointer"><RefreshCw className="w-5 h-5 inline mr-2"/>Generate Piket Auto</button>
              <button onClick={() => setShowLiburModal(true)} className="bg-white border text-gray-700 p-5 rounded-2xl font-bold shadow-sm uppercase cursor-pointer"><CalendarOff className="w-5 h-5 inline mr-2 text-red-500"/>Hari Libur</button>
            </div>
          )}
          <div className="bg-white border-2 border-green-500 p-8 rounded-3xl shadow-lg relative overflow-hidden">
            <Clock className="w-48 h-48 text-green-500 absolute -right-8 -top-8 opacity-5" />
            <h3 className="font-black text-gray-800 mb-5 flex items-center text-2xl relative z-10"><Clock className="w-8 h-8 mr-3 text-green-600" /> Absen Piket Hari Ini</h3>
            <p className="text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-xl font-medium inline-block relative z-10">Aturan Jam Piket: {aturanPiket.jamMulai} - {aturanPiket.jamSelesai} WIB</p>
            {absenStatus === 'belum' && (
              <button onClick={() => { setAbsenStatus('datang'); setJamDatang(getCurrentTime() + ' WIB'); showToast("Berhasil Absen!"); }} className="w-full md:w-1/2 py-5 bg-green-600 text-white rounded-2xl font-black text-lg relative z-10 cursor-pointer">KLIK DATANG PIKET</button>
            )}
            [cite_start]{/* ... sisa logika absenStatus 'datang' dan 'pulang' sesuai file asli [cite: 416-419] */}
          </div>
          [cite_start]{/* List Jadwal Piket Sebulan [cite: 420-422] */}
        </div>
      )}
    </div>
  );
}
