import React from 'react';
import { ChevronLeft, CalendarDays, ChevronRight } from 'lucide-react';

export default function MonitoringKPM({ selectedMonitoringEvent, setSelectedMonitoringEvent, setMonitoringSubTab, getFilteredKPM, safeKpmData, showToast }) {
  const dampinganKPM = getFilteredKPM(safeKpmData);

  return (
    <div className="space-y-4 animate-in fade-in max-w-6xl mx-auto">
      <div className="flex bg-white rounded-lg p-1.5 shadow-sm border">
        <button onClick={() => {setMonitoringSubTab('p2k2'); setSelectedMonitoringEvent(null);}} className={`flex-1 py-2.5 text-sm font-bold rounded-lg cursor-pointer bg-blue-100 text-blue-700`}>Modul P2K2</button>
      </div>
      {selectedMonitoringEvent ? (
        <div className="space-y-4">
          <button onClick={() => setSelectedMonitoringEvent(null)} className="flex items-center text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-xl mb-2 cursor-pointer"><ChevronLeft className="w-5 h-5 mr-1" /> Kembali</button>
          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <h4 className="font-bold text-gray-800 text-base mb-4 border-b pb-3">Daftar Hadir KPM</h4>
            <div className="space-y-3">
              {dampinganKPM.map(kpm => (
                <div key={kpm.id} className="bg-gray-50 p-4 rounded-xl border flex justify-between items-center">
                  <span className="font-bold text-sm text-gray-700">{String(kpm.nama || '')}</span>
                  <label className="flex items-center text-sm font-bold text-green-600 cursor-pointer bg-green-100 px-3 py-1.5 rounded-lg border-green-200">
                    <input type="checkbox" className="mr-2 w-4 h-4 text-green-600 focus:ring-green-500 rounded cursor-pointer" defaultChecked /> Hadir
                  </label>
                </div>
              ))}
            </div>
            <button onClick={() => { showToast("Kehadiran disimpan!"); setSelectedMonitoringEvent(null); }} className="w-full mt-6 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg cursor-pointer">Simpan Kehadiran Final</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div onClick={() => setSelectedMonitoringEvent({title: 'P2K2 Desa Sukamaju', date: 'Hari Ini, 10:00 - Selesai'})} className="bg-white border-l-4 border-blue-500 p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md flex justify-between items-center">
            <div><h4 className="font-bold text-gray-800 text-base">P2K2 Desa Sukamaju</h4><p className="text-xs text-gray-500 mt-2 font-medium flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1.5"/> Hari Ini, 10:00 WIB</p></div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      )}
    </div>
  );
}
