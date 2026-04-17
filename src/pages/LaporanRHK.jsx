import React from 'react';
import { Banknote, AlertCircle, CalendarDays, CheckCircle } from 'lucide-react';

export default function LaporanRHK({ laporanTab, setLaporanTab, denda, currentUserData, aturanPiket, showToast }) {
  const rhkList = [
    { id: 1, title: 'RHK 1: Pemutakhiran Data KPM', desc: 'Verifikasi KPM' }, 
    { id: 2, title: 'RHK 2: Pelaksanaan P2K2', desc: 'Modul pengasuhan' }, 
    { id: 3, title: 'RHK 3: Fasilitasi Faskes/Fasdik', desc: 'Bantu KPM bermasalah' }, 
    { id: 4, title: 'RHK 4: Penyaluran Bansos', desc: 'Pendampingan KPM Bank' }, 
    { id: 5, title: 'RHK 5: Penanganan Pengaduan', desc: 'Menyelesaikan keluhan' }, 
    { id: 6, title: 'RHK 6: Rencana Kerja', desc: 'Tersusunnya Rencana' }
  ];
  
  const tagihanData = denda ? [{id:1, nama: `Anda (${String(currentUserData?.nama || '')})`, tgl: '10 Apr', denda: aturanPiket.denda}] : [];
  const totalDendaDisplay = tagihanData.reduce((sum, item) => sum + (Number(item.denda) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in max-w-5xl mx-auto">
      <div className="flex bg-white rounded-xl p-1.5 shadow-sm border overflow-x-auto">
        <button onClick={() => setLaporanTab('input')} className={`flex-none px-6 py-3 text-sm font-bold rounded-lg cursor-pointer ${laporanTab === 'input' ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`}>Laporan RHK</button>
        <button onClick={() => setLaporanTab('rekap')} className={`flex-none px-6 py-3 text-sm font-bold rounded-lg cursor-pointer ${laporanTab === 'rekap' ? 'bg-red-50 text-red-700' : 'text-gray-500'}`}>Rekap Denda Piket</button>
      </div>

      {laporanTab === 'input' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border space-y-6">
          <h3 className="font-black text-2xl text-gray-800 mb-2">Capaian RHK Bulanan</h3>
          <p className="text-sm text-gray-600 mb-4 font-medium">Centang Rencana Hasil Kerja (RHK) 1-9 yang telah terealisasi pada bulan ini.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto">
            {rhkList.map(rhk => (
              <label key={rhk.id} className="flex items-start p-5 border bg-gray-50 rounded-2xl cursor-pointer hover:bg
