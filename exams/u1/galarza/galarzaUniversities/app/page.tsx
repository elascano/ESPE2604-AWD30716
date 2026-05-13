'use client';

import { useEffect, useState } from 'react';

type University = {
  university_id: number;
  university_name: string;
  rector_name: string;
  university_type: string;
  foundation_year: number | string;
  total_degree_courses: number | string;
  national_ranking: number | string;
  mission: string;
  vision: string;
};

export default function UniversityDashboard() {
  const [items, setItems] = useState<University[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [uName, setUName] = useState('');
  const [rName, setRName] = useState('');
  const [uType, setUType] = useState('PUBLIC');
  const [uYear, setUYear] = useState<number | string>('');
  const [uCourses, setUCourses] = useState<number | string>('');
  const [uRanking, setURanking] = useState<number | string>('');
  const [uMission, setUMission] = useState('');
  const [uVision, setUVision] = useState('');

  const [editingItem, setEditingItem] = useState<University | null>(null);

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

  const submitData = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/insumos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        university_name: uName,
        rector_name: rName,
        foundation_year: Number(uYear) || 0,
        university_type: uType,
        total_degree_courses: Number(uCourses) || 0,
        mission: uMission,
        vision: uVision,
        national_ranking: Number(uRanking) || 0
      }),
    });
    setUName(''); setRName(''); setUType('PUBLIC'); setUYear(''); setUCourses(''); setURanking(''); setUMission(''); setUVision('');
    fetchItems();
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    await fetch('/api/insumos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editingItem,
        foundation_year: Number(editingItem.foundation_year) || 0,
        total_degree_courses: Number(editingItem.total_degree_courses) || 0,
        national_ranking: Number(editingItem.national_ranking) || 0
      }),
    });
    setEditingItem(null);
    fetchItems();
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 p-4 sm:p-8 font-sans text-slate-800 dark:text-slate-100 relative overflow-hidden">
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-800 shadow-2xl hover:scale-110 transition-transform duration-200 focus:outline-none flex items-center justify-center"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        )}
      </button>

      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all mt-10 mb-10">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg">Edit University</h3>
              <button onClick={() => setEditingItem(null)} className="text-white hover:text-cyan-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">University Name</label>
                <input type="text" value={editingItem.university_name} onChange={e => setEditingItem({...editingItem, university_name: e.target.value})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Rector Name</label>
                <input type="text" value={editingItem.rector_name} onChange={e => setEditingItem({...editingItem, rector_name: e.target.value})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Type</label>
                <select value={editingItem.university_type} onChange={e => setEditingItem({...editingItem, university_type: e.target.value})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white appearance-none cursor-pointer" required>
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Foundation Year</label>
                <input type="number" value={editingItem.foundation_year} onChange={e => setEditingItem({...editingItem, foundation_year: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Degree Courses</label>
                <input type="number" value={editingItem.total_degree_courses} onChange={e => setEditingItem({...editingItem, total_degree_courses: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" required />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Ranking</label>
                <input type="number" value={editingItem.national_ranking} onChange={e => setEditingItem({...editingItem, national_ranking: e.target.value === '' ? '' : Number(e.target.value)})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" required />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Mission</label>
                <textarea value={editingItem.mission} onChange={e => setEditingItem({...editingItem, mission: e.target.value})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" rows={2}></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Vision</label>
                <textarea value={editingItem.vision} onChange={e => setEditingItem({...editingItem, vision: e.target.value})} className="w-full p-3 mt-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" rows={2}></textarea>
              </div>
              
              <div className="md:col-span-2 pt-4 flex justify-end gap-3">
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
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400">Uni - ventory</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest">University Management</p>
          </div>
        </header>

        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-cyan-900/5 dark:shadow-black/20 overflow-hidden border border-slate-100 dark:border-slate-700">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-white font-semibold text-lg tracking-wide">Register New University</h2>
          </div>
          <form onSubmit={submitData} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</label>
              <input type="text" value={uName} onChange={e => setUName(e.target.value)} required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rector</label>
              <input type="text" value={rName} onChange={e => setRName(e.target.value)} required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</label>
              <select value={uType} onChange={e => setUType(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white appearance-none cursor-pointer" required>
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Foundation Year</label>
              <input type="number" value={uYear} onChange={e => setUYear(e.target.value === '' ? '' : Number(e.target.value))} required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Degree Courses</label>
              <input type="number" value={uCourses} onChange={e => setUCourses(e.target.value === '' ? '' : Number(e.target.value))} required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ranking</label>
              <input type="number" value={uRanking} onChange={e => setURanking(e.target.value === '' ? '' : Number(e.target.value))} required className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mission</label>
              <textarea value={uMission} onChange={e => setUMission(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" rows={2}></textarea>
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vision</label>
              <textarea value={uVision} onChange={e => setUVision(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none dark:text-white" rows={2}></textarea>
            </div>

            <div className="md:col-span-3 flex justify-end mt-2">
              <button type="submit" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/30 transform hover:-translate-y-0.5 transition-all duration-200 active:scale-95">Save</button>
            </div>
          </form>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Registered Universities</h2>
          </div>
          <div className="flex flex-nowrap overflow-x-auto gap-6 pb-6 snap-x">
            {items.map(item => (
              <div key={item.university_id} className="snap-start shrink-0 w-80 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{item.university_name}</h3>
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded-md">Rank: #{item.national_ranking}</span>
                  </div>
                  <button onClick={() => setEditingItem(item)} className="p-1.5 text-slate-400 hover:text-blue-500 dark:hover:bg-slate-700 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Rector</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.rector_name}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Type</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.university_type === 'PUBLIC' ? 'Public' : 'Private'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Founded</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.foundation_year}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Courses</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.total_degree_courses}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}