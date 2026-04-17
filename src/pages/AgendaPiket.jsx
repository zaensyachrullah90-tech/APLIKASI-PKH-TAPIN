import React from 'react';
import { Plus, CalendarDays, MapPin, CheckCircle, Trash2, Timer, CalendarClock, RefreshCw, CalendarOff, Clock, ArrowRightLeft } from 'lucide-react';

export default function AgendaPiket({ agendaSubTab, setAgendaSubTab, safeAgendaData, getFilteredAgenda, isKorkab, isKorcam, setAgendaTypeToEdit, setShowAgendaModal, dbUpdate, dbDelete, selectedAgendaCategory, setSelectedAgendaCategory, handleGeneratePiketReal, setShowLiburModal, aturanPiket, absenStatus, setAbsenStatus, jamDatang, setJamDatang, denda, setDenda, showToast, safePiketData, setShowTukarModal, showTukarModal, getCurrentTime }) {
  return (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <div className="flex bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-gray-200 overflow-x-auto scrollbar-hide sticky top-20 z-20">
        <button onClick={() => setAgendaSubTab('harian')} className={`flex-none min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'harian' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>AGENDA HARIAN</button>
        <button onClick={() => setAgendaSubTab('khusus')} className={`flex-none min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'khusus' ? 'bg-red-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>GIAT KHUSUS</button>
        {(isKorkab || isKorcam) && <button onClick={() => setAgendaSubTab('ketuatim')} className={`flex-none min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'ketuatim' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>AGENDA KATIM</button>}
        <button onClick={() => setAgendaSubTab('piket')} className={`flex-none min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'piket' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>JADWAL PIKET</button>
        <button onClick={() => setAgendaSubTab('deadline')} className={`flex-none min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'deadline' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>DEADLINE</button>
        {isKorkab && <button onClick={() => { setAgendaSubTab('jadwal'); setSelectedAgendaCategory(null); }} className={`flex-none min-w-[150px] px-6 py-4 text-sm font-black tracking-wide rounded-xl cursor-pointer transition-all ${agendaSubTab === 'jadwal' ? 'bg-slate-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>REKAP JADWAL</button>}
      </div>

      {agendaSubTab === 'harian' && (
        <div className="space-y-6">
          <button onClick={() => { setAgendaTypeToEdit('harian'); setShowAgendaModal(true); }} className="w-full py-6 bg-white border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors rounded-3xl font-black flex items-center justify-center text-lg cursor-pointer"><Plus className="w-7 h-7 mr-3" /> Tambah Agenda Harian</button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredAgenda(safeAgendaData.filter(a => String(a.type) === 'harian')).map((agenda) => (
              <div key={agenda.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between border-t-8 border-t-blue-500">
                <div>
                  <h4 className="font-black text-gray-800 text-xl mb-4 leading-snug">{String(agenda.title || '')}</h4>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <p className="text-sm font-medium text-gray-600 flex items-center"><CalendarDays className="w-4 h-4 mr-3 text-blue-500" /> {String(agenda.date || '')}, {String(agenda.time || '')}</p>
                    <p className="text-sm font-medium text-gray-600 flex items-center"><MapPin className="w-4 h-4 mr-3 text-red-500" /> {String(agenda.loc || '')}</p>
                  </div>
                </div>
                {isKorkab && (<div className="mt-6 pt-5 border-t border-gray-100"><button onClick={async () => { await dbUpdate('agendaData', agenda.id, { supervisi: !agenda.supervisi }); }} className={`w-full py-4 rounded-xl font-black flex items-center justify-center cursor-pointer transition-colors ${agenda.supervisi ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}><CheckCircle className="w-5 h-5 mr-2" />{agenda.supervisi ? 'Telah Disupervisi' : 'Beri Status Supervisi'}</button></div>)}
              </div>
            ))}
          </div>
        </div>
      )}

      {agendaSubTab === 'piket' && (
        <div className="space-y-8">
          {(isKorkab || isKorcam) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
              <button onClick={handleGeneratePiketReal} className="bg-blue-600 text-white py-5 px-6 rounded-2xl font-black shadow-lg shadow-blue-600/30 hover:bg-blue-700 flex items-center justify-center transition-all cursor-pointer"><RefreshCw className="w-5 h-5 mr-3"/> GENERATE PIKET AUTO</button>
              <button onClick={() => setShowLiburModal(true)} className="bg-white border border-gray-200 text-gray-700 py-5 px-6 rounded-2xl font-black shadow-sm hover:bg-gray-50 flex items-center justify-center transition-all cursor-pointer"><CalendarOff className="w-5 h-5 mr-3 text-red-500"/> TENTUKAN HARI LIBUR</button>
            </div>
          )}
          
          {/* Box Absensi Clock-In */}
          <div className="bg-white border-2 border-emerald-400 p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <Clock className="w-64 h-64 text-emerald-500 absolute -right-10 -top-10 opacity-5" />
            <h3 className="font-black text-gray-800 mb-4 flex items-center text-3xl relative z-10"><Clock className="w-10 h-10 mr-4 text-emerald-600" /> Absen Piket Kantor</h3>
            <p className="text-gray-600 mb-8 font-medium text-lg relative z-10 bg-emerald-50 inline-block px-4 py-2 rounded-xl border border-emerald-100">Aturan Jam Piket: <span className="font-bold text-emerald-800">{aturanPiket.jamMulai} - {aturanPiket.jamSelesai} WIB</span></p>
            
            {absenStatus === 'belum' && (
              <button onClick={() => { setAbsenStatus('datang'); setJamDatang(getCurrentTime() + ' WIB'); showToast("Berhasil Absen!"); }} className="w-full md:w-1/2 py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer relative z-10 tracking-wider">KLIK DATANG PIKET</button>
            )}
            {absenStatus === 'datang' && (
              <div className="space-y-6 relative z-10">
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center font-black text-lg md:w-1/2">Terekam Datang: {jamDatang}</div>
                <div className="grid grid-cols-2 gap-5 md:w-1/2">
                  <button onClick={() => { setAbsenStatus('pulang'); setDenda(false); showToast("Selesai Piket!"); }} className="py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-base cursor-pointer transition-all shadow-lg shadow-red-600/30">PULANG NORMAL</button>
                  <button onClick={() => { setAbsenStatus('pulang'); setDenda(true); showToast("Kena Denda!"); }} className="py-5 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-base cursor-pointer transition-all shadow-lg shadow-orange-500/30">SIMULASI DENDA</button>
                </div>
              </div>
            )}
            {absenStatus === 'pulang' && (
              <div className={`p-8 rounded-3xl text-center space-y-4 bg-gray-50 border border-gray-200 md:w-1/2 relative z-10`}>
                <h4 className={`font-black text-gray-800 text-2xl flex items-center justify-center`}><CheckCircle className="w-8 h-8 mr-3 text-emerald-500"/>Piket Selesai</h4>
                <p className="text-lg font-medium text-gray-600 bg-white py-3 rounded-xl border">Datang: <span className="font-bold text-gray-800">{jamDatang}</span> | Pulang: <span className="font-bold text-gray-800">10:00 WIB</span></p>
                {denda && (<div className="mt-6 bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200"><span className="font-black text-sm uppercase tracking-widest block mb-2">Denda Keterlambatan</span><span className="text-4xl font-black block">Rp {aturanPiket.denda.toLocaleString('id-ID')}</span></div>)}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 lg:p-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
               <h4 className="font-black text-gray-800 text-2xl flex items-center"><CalendarDays className="w-8 h-8 mr-3 text-blue-600"/> Jadwal Sebulan (Server)</h4>
               <button onClick={() => setShowTukarModal(!showTukarModal)} className="w-full md:w-auto text-sm bg-purple-50 text-purple-700 border border-purple-100 px-6 py-4 rounded-2xl font-black cursor-pointer hover:bg-purple-100 transition-colors"><ArrowRightLeft className="w-5 h-5 inline mr-2" /> TUKAR JADWAL SAYA</button>
            </div>
            <div className="space-y-4">
              {safePiketData.map((piket, idx) => (
                <div key={idx} className={`flex justify-between items-center p-6 rounded-2xl border-2 transition-colors ${String(piket.status) === 'today' ? 'border-emerald-300 bg-emerald-50 shadow-sm' : 'border-gray-50 bg-gray-50 hover:bg-white hover:border-gray-200'}`}>
                  <span className={`text-base md:text-lg font-bold w-1/3 ${String(piket.status) === 'today' ? 'text-emerald-700' : 'text-gray-500'}`}>{String(piket.tgl || '')}</span>
                  <span className={`text-lg md:text-xl font-black w-2/3 text-right ${String(piket.status) === 'today' ? 'text-emerald-700' : 'text-gray-800'}`}>{String(piket.nama || '')}</span>
                </div>
              ))}
              {safePiketData.length === 0 && <p className="text-base text-gray-500 font-medium p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center">Belum ada jadwal piket yang dibuat admin.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}