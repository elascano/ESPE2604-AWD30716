'use client';

import { useEffect, useState } from 'react';

type SupplyItem = {
  id: string;
  nombre: string;
  tipo: string;
  horas_uso: number;
  fecha_calibracion: string | null;
  stock: number;
  estado: string;
  creado_en: string;
};

export default function LogisticsDashboard() {
  const [items, setItems] = useState<SupplyItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Create Form State
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('EQUIPO');
  const [usageHours, setUsageHours] = useState(0);
  const [calibrationDate, setCalibrationDate] = useState('');
  const [stockAmount, setStockAmount] = useState(0);
  const [itemStatus, setItemStatus] = useState('IN_USE');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);

  // Toggle Dark Mode globally
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchItems = async () => {
    const response = await fetch('/api/insumos');
    const data = await response.json();
    setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  // CREATE Protocol
  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/insumos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: itemName,
        tipo: itemType,
        horas_uso: usageHours,
        fecha_calibracion: calibrationDate,
        stock: stockAmount,
        estado: itemStatus
      }),
    });
    setItemName(''); setItemType('EQUIPO'); setUsageHours(0); setCalibrationDate(''); setStockAmount(0); setItemStatus('IN_USE');
    fetchItems();
  };

  // UPDATE Protocol
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    await fetch('/api/insumos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem),
    });
    setEditingItem(null);
    fetchItems();
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4 sm:p-8 font-sans text-slate-800 dark:text-slate-100 relative">

    {/* Dark Mode Floating Toggle */}
    <button
    onClick={() => setIsDarkMode(!isDarkMode)}
    className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-800 shadow-2xl hover:scale-110 transition-transform duration-200 focus:outline-none flex items-center justify-center"
    title="Toggle UI Theme"
    >
    {isDarkMode ? (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    ) : (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
    )}
    </button>

    {/* Edit Modal Overlay */}
    {editingItem && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex justify-between items-center">
      <h3 className="text-white font-bold text-lg">Edit Asset Details</h3>
      <button onClick={() => setEditingItem(null)} className="text-white hover:text-cyan-200">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      </div>

      <form onSubmit={handleUpdate} className="p-6 space-y-4">
      <div>
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Asset Name</label>
      <input type="text" value={editingItem.nombre} onChange={e => setEditingItem({...editingItem, nombre: e.target.value})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
      <div>
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</label>
      <select value={editingItem.estado} onChange={e => setEditingItem({...editingItem, estado: e.target.value})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white appearance-none">
      <option value="IN_USE">Active / In Use</option>
      <option value="DEPRECATED">Deprecated</option>
      </select>
      </div>

      {editingItem.tipo === 'EQUIPO' ? (
        <>
        <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Usage Hours</label>
        <input type="number" min="0" value={editingItem.horas_uso} onChange={e => setEditingItem({...editingItem, horas_uso: Number(e.target.value)})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white" />
        </div>
        <div className="col-span-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Calibration Date</label>
        <input type="date" value={editingItem.fecha_calibracion || ''} onChange={e => setEditingItem({...editingItem, fecha_calibracion: e.target.value})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white" required />
        </div>
        </>
      ) : (
        <div>
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Stock</label>
        <input type="number" min="0" value={editingItem.stock} onChange={e => setEditingItem({...editingItem, stock: Number(e.target.value)})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white" />
        </div>
      )}
      </div>

      <div className="pt-4 flex justify-end gap-3">
      <button type="button" onClick={() => setEditingItem(null)} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">Cancel</button>
      <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all">Save Changes</button>
      </div>
      </form>
      </div>
      </div>
    )}

    <div className="max-w-7xl mx-auto space-y-10">
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
    <div>
    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">
    Ser Salud
    </h1>
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">
    Logistics & Supply Management
    </p>
    </div>
    </header>

    {/* CREATE SECTION */}
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-cyan-900/5 dark:shadow-black/20 overflow-hidden border border-slate-100 dark:border-slate-700">
    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex justify-between items-center">
    <h2 className="text-white font-semibold text-lg tracking-wide">Register New Asset</h2>
    </div>

    <form onSubmit={submitData} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
    <div className="md:col-span-3 space-y-1">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asset Name</label>
    <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="e.g., Shockwave Therapy" required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all dark:text-white" />
    </div>

    <div className="md:col-span-2 space-y-1">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
    <select value={itemType} onChange={e => setItemType(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all dark:text-white appearance-none">
    <option value="EQUIPO">Equipment</option>
    <option value="CONSUMIBLE">Consumable</option>
    </select>
    </div>

    <div className="md:col-span-2 space-y-1">
    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
    <select value={itemStatus} onChange={e => setItemStatus(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all dark:text-white appearance-none">
    <option value="IN_USE">In Use</option>
    <option value="DEPRECATED">Deprecated</option>
    </select>
    </div>

    {itemType === 'EQUIPO' ? (
      <>
      <div className="md:col-span-1 space-y-1">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hours</label>
      <input type="number" min="0" value={usageHours} onChange={e => setUsageHours(Number(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all dark:text-white" />
      </div>
      <div className="md:col-span-2 space-y-1">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Calibration</label>
      <input type="date" value={calibrationDate} onChange={e => setCalibrationDate(e.target.value)} required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all dark:text-white" />
      </div>
      </>
    ) : (
      <div className="md:col-span-3 space-y-1">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Available Stock</label>
      <input type="number" min="0" value={stockAmount} onChange={e => setStockAmount(Number(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all dark:text-white" />
      </div>
    )}

    <div className="md:col-span-2 md:mt-6 flex justify-end">
    <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95">
    Save
    </button>
    </div>
    </form>
    </section>

    {/* READ & UPDATE VIEWS */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

    <section>
    <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Active Equipment</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {items.filter(i => i.tipo === 'EQUIPO').map(item => (
      <div key={item.id} className={`group relative bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-black/40 border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${item.estado === 'DEPRECATED' ? 'opacity-60 grayscale-[50%]' : ''}`}>
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${item.estado === 'DEPRECATED' ? 'bg-slate-400' : 'bg-blue-500 group-hover:bg-blue-400'}`}></div>

      <div className="flex justify-between items-start mb-4">
      <div>
      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.nombre}</h3>
      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${item.estado === 'IN_USE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
      {item.estado.replace('_', ' ')}
      </span>
      </div>
      <button onClick={() => setEditingItem(item)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </button>
      </div>

      <div className="space-y-3">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Usage</span>
      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.horas_uso}h</span>
      </div>
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Calibration</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.fecha_calibracion}</span>
      </div>
      </div>
      </div>
    ))}
    </div>
    </section>

    <section>
    <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
    <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory Status</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {items.filter(i => i.tipo === 'CONSUMIBLE').map(item => (
      <div key={item.id} className={`group relative bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-black/40 border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1 overflow-hidden ${item.estado === 'DEPRECATED' ? 'opacity-60 grayscale-[50%]' : ''}`}>
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${item.estado === 'DEPRECATED' ? 'bg-slate-400' : 'bg-cyan-500 group-hover:bg-cyan-400'}`}></div>

      <div className="flex justify-between items-start mb-4">
      <div>
      <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.nombre}</h3>
      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${item.estado === 'IN_USE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
      {item.estado.replace('_', ' ')}
      </span>
      </div>
      <button onClick={() => setEditingItem(item)} className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-slate-700 rounded-lg transition-colors" title="Edit">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </button>
      </div>

      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Current Stock</span>
      <span className={`text-2xl font-black ${item.stock < 10 ? 'text-rose-500 dark:text-rose-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
      {item.stock}
      </span>
      </div>
      </div>
    ))}
    </div>
    </section>

    </div>
    </div>
    </main>
  );
}
