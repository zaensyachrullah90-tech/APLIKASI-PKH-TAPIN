import React from 'react';
import { ChevronLeft, CheckSquare, Plus, ChevronRight, BarChart2, Users as UsersIcon, UserSquare, Target, Link as LinkIcon, Share2, AlertCircle, CheckCircle } from 'lucide-react';

export default function TugasVoting({ 
  tugasTab, setTugasTab, selectedTaskView, setSelectedTaskView, selectedVoteView, 
  setSelectedVoteView, selectedJadwalView, setSelectedJadwalView, safeTasksData, 
  safeVotesData, safeJadwalData, isKorkab, isKorcam, currentUserData, setShowTambahTugasModal, 
  setShowLaporTugasModal, setSelectedTugasToLapor, showToast, activeSdmList, dbUpdate, 
  selectedVote, setSelectedVote, setShowTambahVoteModal, setShowTambahJadwalModal, 
  setShowIsiJadwalModal 
}) {
  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="flex bg-white rounded-2xl p-2 shadow-sm border overflow-x-auto">
        <button onClick={() => {setTugasTab('daftar'); setSelectedTaskView(null); setSelectedVoteView(null); setSelectedJadwalView(null);}} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${tugasTab === 'daftar' && !selectedTaskView && !selectedVoteView && !selectedJadwalView ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>Daftar Tugas</button>
        <button onClick={() => {setTugasTab('progres'); setSelectedTaskView(null); setSelectedVoteView(null); setSelectedJadwalView(null);}} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${tugasTab === 'progres' && !selectedTaskView && !selectedVoteView && !selectedJadwalView ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500'}`}>Progres Data</button>
        <button onClick={() => {setTugasTab('vote'); setSelectedTaskView(null); setSelectedVoteView(null); setSelectedJadwalView(null);}} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${tugasTab === 'vote' && !selectedVoteView ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}>Voting Aktif</button>
        <button onClick={() => {setTugasTab('jadwal'); setSelectedTaskView(null); setSelectedVoteView(null); setSelectedJadwalView(null);}} className={`flex-none px-6 py-3.5 text-sm font-bold rounded-xl cursor-pointer ${tugasTab === 'jadwal' && !selectedJadwalView ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500'}`}>Jadwal Kegiatan</button>
      </div>

      {tugasTab === 'daftar' && (
        <>
          {selectedTaskView ? (
            <div className="space-y-5 animate-in fade-in">
              <button onClick={() => setSelectedTaskView(null)} className="flex items-center text-blue-600 font-bold bg-white border px-5 py-3 rounded-xl hover:bg-blue-50 shadow-sm w-fit cursor-pointer"><ChevronLeft className="w-5 h-5 mr-2" /> Kembali</button>
              <div className={`bg-white border-t-8 border-t-blue-500 p-8 rounded-3xl shadow-md border-x border-b`}>
                <h3 className="font-black text-gray-800 text-2xl mb-5">{String(selectedTaskView.title || '')}</h3>
                <div className={`bg-blue-50 p-6 rounded-2xl mb-8 text-base text-gray-700 border`}><p>{String(selectedTaskView.desc || '')}</p></div>
                <button onClick={() => { setSelectedTugasToLapor(selectedTaskView); setShowLaporTugasModal(true); }} className={`w-full md:w-1/2 py-4 bg-blue-600 text-white rounded-xl text-base font-black flex items-center justify-center hover:bg-blue-700 shadow-lg cursor-pointer`}><CheckSquare className="w-6 h-6 mr-3"/> Lapor Kegiatan</button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {isKorkab && (<button onClick={() => setShowTambahTugasModal(true)} className="py-4 w-full bg-blue-50 border text-blue-700 rounded-3xl text-base font-bold shadow-sm hover:bg-blue-100 cursor-pointer"><Plus className="w-6 h-6 inline mr-2" /> Buat Tugas</button>)}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {safeTasksData.map(task => (<div key={task.id} onClick={() => setSelectedTaskView(task)} className="bg-white border-l-4 border-blue-500 p-6 rounded-3xl shadow-sm cursor-pointer hover:shadow-md min-h-[10rem]"><div><h4 className="font-black text-gray-800 text-lg mb-2">{String(task.title || '')}</h4><p className="text-sm text-gray-500">{String(task.desc || '')}</p></div><div className="flex justify-end mt-4"><ChevronRight className="w-6 h-6 text-gray-300" /></div></div>))}
              </div>
            </div>
          )}
        </>
      )}
      [cite_start]{/* ... sisa tab progres, vote, dan jadwal sesuai file asli [cite: 446-473] */}
    </div>
  );
}
