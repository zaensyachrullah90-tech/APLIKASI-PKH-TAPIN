import React, { useState } from 'react';
import { 
  Home, Users, Calendar, FileText, Trophy, Map, X,
  LogOut, Shield, Database, ExternalLink, Settings,
  ClipboardList, ClipboardCheck, MessageSquare, BookOpen,
  ChevronDown, ChevronRight
} from 'lucide-react';

const SidebarItem = ({ item, activeTab, goToMenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubMenu = item.subMenus && item.subMenus.length > 0;
  const isActive = activeTab === item.id;

  const handleClick = () => {
    if (hasSubMenu) {
      setIsOpen(!isOpen);
    } else {
      goToMenu(item.id);
    }
  };

  return (
    <div className="mb-1">
      <button 
        onClick={handleClick} 
        className={`w-full flex items-center justify-between px-6 py-3.5 rounded-xl transition-all cursor-pointer ${isActive ? 'bg-blue-600 text-white shadow-lg font-bold translate-x-2' : 'text-gray-600 hover:bg-blue-50 font-medium'}`}
      >
        <div className="flex items-center">
          <item.icon className={`w-5 h-5 mr-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
          <span className="text-sm tracking-wide">{item.label}</span>
        </div>
        {hasSubMenu && (
          isOpen ? <ChevronDown size={18} className={isActive ? 'text-white' : 'text-gray-400'} /> : <ChevronRight size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
        )}
      </button>

      {/* Render Sub-Menu */}
      {hasSubMenu && isOpen && (
        <div className="ml-12 mt-1 space-y-1">
          {item.subMenus.map((sub) => (
            <button
              key={sub.subId}
              onClick={() => goToMenu(item.id, sub.subId)}
              className="w-full text-left px-4 py-2 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium cursor-pointer"
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeTab, goToMenu, handleLogout, isKorkab }) {
  // Definisi Navigasi Modular beserta Sub-Menu-nya
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Beranda' }, 
    { id: 'catatan', icon: BookOpen, label: 'Catatan Harian' }, 
    { id: 'kpm', icon: Users, label: 'Data KPM', subMenus: [
      { subId: 'daftar', label: 'Daftar KPM' },
      { subId: 'potensial', label: 'KPM Potensial' },
      { subId: 'graduasi', label: 'KPM Graduasi' }
    ]}, 
    { id: 'agenda', icon: Calendar, label: 'Agenda & Piket', subMenus: [
      { subId: 'harian', label: 'Agenda Harian' },
      { subId: 'khusus', label: 'Giat Khusus' },
      { subId: 'piket', label: 'Jadwal Piket' },
      { subId: 'deadline', label: 'Deadline Tugas' }
    ]}, 
    { id: 'monitoring', icon: ClipboardList, label: 'Monitoring KPM' }, 
    { id: 'tugas', icon: ClipboardCheck, label: 'Tugas & Voting', subMenus: [
      { subId: 'daftar', label: 'Daftar Tugas' },
      { subId: 'progres', label: 'Progres Data' },
      { subId: 'vote', label: 'Voting Aktif' },
      { subId: 'jadwal', label: 'Jadwal Kegiatan' }
    ]}, 
    { id: 'pengaduan', icon: MessageSquare, label: 'Pengaduan' }, 
    { id: 'laporan', icon: FileText, label: 'Laporan & Denda', subMenus: [
      { subId: 'input', label: 'Input Laporan' },
      { subId: 'rekap', label: 'Rekap Denda' }
    ]}, 
    { id: 'sdm', icon: Shield, label: 'Database SDM' }, 
    { id: 'aplikasi_lainnya', icon: ExternalLink, label: 'Aplikasi Terkait' }, 
    ...(isKorkab ? [{ id: 'ranking', icon: Trophy, label: 'Ranking SDM' }] : []), 
    ...(isKorkab ? [{ id: 'manajemen_data', icon: Database, label: 'Manajemen Data' }] : []), 
    { id: 'peta', icon: Map, label: 'Peta Lokasi' }, 
    { id: 'pengaturan', icon: Settings, label: 'Pengaturan' }
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 w-72 lg:w-80 bg-white shadow-xl transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 flex flex-col border-r`}>
      <div className="bg-blue-700 p-6 lg:p-8 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8"/>
          <h2 className="font-black text-2xl">PKH Tapin</h2>
        </div>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 bg-blue-800 rounded-full cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
        <nav className="flex flex-col space-y-1.5 py-4">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.id} 
              item={item} 
              activeTab={activeTab} 
              goToMenu={goToMenu} 
            />
          ))}
        </nav>
      </div>
      <div className="p-6 bg-gray-50 border-t">
        <button onClick={handleLogout} className="w-full py-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase flex items-center justify-center cursor-pointer hover:bg-red-100 transition-colors">
          <LogOut className="w-4 h-4 mr-2"/> Keluar Sistem
        </button>
      </div>
    </aside>
  );
}
