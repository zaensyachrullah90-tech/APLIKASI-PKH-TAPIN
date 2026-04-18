import React from 'react';
import { Shield, Users, MapPin, Plus, Search, ChevronRight } from 'lucide-react';

export default function Views({ activeTab, subTabs, currentUserData, kpmData, isKorkab }) {
  
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2rem] p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
        <Shield className="w-64 h-64 absolute -right-10 -top-10 opacity-10" />
        <h2 className="text-3xl lg:text-4xl font-black relative z-10">Halo, {currentUserData?.nama}!</h2>
        <p className="text-blue-100 mt-2 text-lg relative z-10">{isKorkab ? 'Admin Kabupaten' : 'Pendamping Sosial'}</p>
      </div>
      {/* Lanjutkan UI Dashboard Anda di sini */}
    </div>
  );

  const renderKPM = () => {
    // Ambil state sub-tab dari props
    const currentSubTab = subTabs.kpm; 

    return (
      <div className="space-y-6 animate-in fade-in max-w-6xl mx-auto">
        <h2 className="text-2xl font-black text-gray-800">Manajemen Data KPM: {currentSubTab.toUpperCase()}</h2>
        
        {currentSubTab === 'daftar' && (
           <div className="bg-white p-6 rounded-3xl shadow-sm border">
              <p>Ini adalah daftar KPM Utama.</p>
           </div>
        )}
        {currentSubTab === 'potensial' && (
           <div className="bg-white p-6 rounded-3xl shadow-sm border">
              <p>Ini adalah daftar KPM Potensial.</p>
           </div>
        )}
        {/* Lanjutkan UI KPM Anda di sini */}
      </div>
    );
  };

  // Controller
  switch (activeTab) {
    case 'dashboard': return renderDashboard();
    case 'kpm': return renderKPM();
    // Tambahkan case untuk 'agenda', 'tugas', 'pengaduan' dll.
    default: return <div>Halaman sedang dalam pengembangan.</div>;
  }
}
