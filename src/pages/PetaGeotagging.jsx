import React from 'react';
import { Map, Download, Users as UsersIcon, MapPin, CheckCircle, Target } from 'lucide-react';

export default function PetaGeotagging({ filterDesaMaps, setFilterDesaMaps, getFilteredKPM, safeKpmData, isKorkab, setIsSaving, dbUpdate, showToast }) {
  const myKpmMaps = getFilteredKPM(safeKpmData).filter(k => filterDesaMaps === 'Semua' || String(k.desa) === filterDesaMaps);
  const listDesa = [...new Set(getFilteredKPM(safeKpmData).map(k => k.desa))];

  const handleRekamLokasi = (kpmId) => {
    setIsSaving(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          await dbUpdate('kpmData', kpmId, { lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsSaving(false);
          showToast("Lokasi berhasil direkam!"); 
        },
        (err) => { 
          setIsSaving(false); 
          showToast("Gagal akses GPS smartphone. Pastikan izin lokasi aktif!"); 
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsSaving(false);
      showToast("Perangkat tidak mendukung GPS.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-blue-900 to-blue-950 p-8 rounded-[2rem] shadow-xl text-white flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        <Map className="w-48 h-48 absolute -left-10 -top-10 opacity-10 text-yellow-500" />
        <div className="relative z-10 mb-4 md:mb-0">
          <h2 className="font-black text-3xl text-yellow-500">Geotagging KPM</h2>
          <p className="text-blue-200 mt-2 font-medium">Pemetaan lokasi rumah KPM terintegrasi.</p>
        </div>
        <div className="flex gap-3 relative z-10 w-full md:w-auto">
          <select value={filterDesaMaps} onChange={e => setFilterDesaMaps(e.target.value)} className="p-3 rounded-xl text-gray-800 font-bold outline-none flex-1 md:w-48">
            <option value="Semua">Semua Desa</option>
            {listDesa.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {isKorkab && (
            <button onClick={() => showToast("Mendownload Data Peta KPM...")} className="bg-yellow-500 text-blue-900 px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-yellow-400 flex items-center cursor-pointer">
              <Download className="w-5 h-5 mr-2" /> Export Maps
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border overflow-hidden flex flex-col h-[600px]">
           <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
             <h3 className="font-black text-gray-800"><UsersIcon className="w-5 h-5 inline mr-2 text-blue-600"/> Daftar KPM</h3>
             <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">{myKpmMaps.length} Data</span>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {myKpmMaps.map(kpm => (
                <div key={kpm.id} className="bg-white border p-4 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{String(kpm.nama || '')}</h4>
                  <p className="text-xs text-gray-500 mb-3"><MapPin className="w-3 h-3 inline mr-1"/> {String(kpm.desa || '')}</p>
                  {kpm.lat && kpm.lng ? (
                    <div className="bg-green-50 text-green-700 text-[10px] font-bold p-2 rounded-lg flex items-center justify-between">
                       <span><CheckCircle className="w-3 h-3 inline mr-1"/> Tersimpan</span>
                       <span className="font-mono">{Number(kpm.lat).toFixed(4)}, {Number(kpm.lng).toFixed(4)}</span>
                    </div>
                  ) : (
                    <button onClick={() => handleRekamLokasi(kpm.id)} className="w-full bg-blue-50 text-blue-700 text-xs font-bold py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors cursor-pointer border border-blue-100">
                      <Target className="w-4 h-4 inline mr-1"/> Rekam Titik Koordinat
                    </button>
                  )}
                </div>
              ))}
              {myKpmMaps.length === 0 && <p className="text-center text-gray-500 text-sm italic py-10">Tidak ada KPM di wilayah ini.</p>}
           </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border p-4 h-[600px] flex flex-col relative">
          <div className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-md border border-gray-100">
             <h4 className="font-black text-blue-900 text-sm"><Map className="w-4 h-4 inline mr-2"/> Visualisasi Pemetaan</h4>
             <p className="text-xs text-gray-500 mt-1">{filterDesaMaps === 'Semua' ? 'Seluruh Wilayah' : `Desa ${filterDesaMaps}`}</p>
          </div>
          <div className="flex-1 bg-gray-100 rounded-2xl overflow-hidden relative border shadow-inner flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             {myKpmMaps.some(k => k.lat && k.lng) ? (
               <div className="relative w-full h-full p-10">
                  {myKpmMaps.filter(k => k.lat && k.lng).map((kpm) => {
                     const topPos = Math.abs(Math.sin(kpm.lat * 10000)) * 80 + 10;
                     const leftPos = Math.abs(Math.cos(kpm.lng * 10000)) * 80 + 10;
                     return (
                       <div key={kpm.id} className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer hover:z-30" style={{ top: `${topPos}%`, left: `${leftPos}%` }}>
                         <div className="bg-blue-900 text-yellow-400 text-[10px] font-black px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
                           {String(kpm.nama || '')}
                         </div>
                         <MapPin className="w-8 h-8 text-yellow-500 drop-shadow-md animate-bounce" />
                       </div>
                     );
                  })}
               </div>
             ) : (
               <div className="text-center relative z-10">
                 <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                 <p className="text-gray-500 font-bold text-lg">Peta Geotagging Kosong</p>
                 <p className="text-gray-400 text-sm mt-1">Belum ada data koordinat KPM yang direkam.</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
